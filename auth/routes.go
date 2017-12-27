package auth

import (
	"database/sql"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
	"strings"
)

type loginBody struct {
	Token string `json:"token"`
}

type ok struct {
	Data loginBody `json:"data"`
}

// TODO: extract common types
type clienterr struct {
	Title  string `json:"title"`
	Status int    `json:"status"`
}

type bad struct {
	Errors []clienterr `json:"errors"`
}

func login(c *gin.Context) {
	db := c.MustGet("db").(*sql.DB)
	signingKey := []byte(os.Getenv("SECRET_KEY"))

	var u User
	var passwordHash string
	var err error
	var tokenString string

	c.ShouldBind(&u)

	passwordHash, err = findPasswordHash(db, u.Username)

	isMatch := passwordMatchesHash(u.Password, passwordHash)

	if !isMatch {
		c.JSON(http.StatusUnauthorized, bad{Errors: []clienterr{{Title: "Invalid login", Status: http.StatusUnauthorized}}})
		return
	}

	tokenString, err = createSignedToken(signingKey)

	if err != nil {
		fmt.Println("error logging in", err)
		c.JSON(http.StatusInternalServerError, bad{Errors: []clienterr{{Title: "Login failed", Status: http.StatusInternalServerError}}})
		return
	}
	c.JSON(http.StatusCreated, ok{Data: loginBody{Token: tokenString}})

}

func denyLogin(c *gin.Context, err error) {
	fmt.Println("Error validating token", err)
	c.JSON(http.StatusUnauthorized, bad{Errors: []clienterr{{Title: "Invalid token", Status: http.StatusUnauthorized}}})
	c.Abort()
}

func IsLoggedIn(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		signingKey := []byte(os.Getenv("SECRET_KEY"))
		bearer := c.GetHeader("Authorization")
		if bearer == "" {
			denyLogin(c, errors.New("No Authorization header"))
			return
		}
		authParts := strings.Split(bearer, " ")
		if len(authParts) < 2 {
			denyLogin(c, errors.New("Malformed Authorization header"))
			return
		}
		isValid, err := isTokenValid(signingKey, authParts[1])
		if isValid {
			c.Next()
		} else {
			denyLogin(c, err)
		}
	}
}

func Mount(router *gin.Engine) {
	router.POST("/api/v1/auth", login)
}

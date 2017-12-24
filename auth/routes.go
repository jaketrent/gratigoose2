package auth

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
	"net/http"
	"os"
)

type loginBody struct {
	Token string `json:"token"`
}

type ok struct {
	Data loginBody `json:"data"`
}

// TODO: extract common types
type clienterr struct {
	Title  string
	Status int
}

type bad struct {
	Errors []clienterr `json:"errors"`
}

func login(c *gin.Context) {
	db := c.MustGet("db").(*sql.DB)
	signingKey := []byte(os.Getenv("SECRET_KEY"))

	var u user
	var passwordHash string
	var err error
	var tokenString string

	c.ShouldBind(&u)

	passwordHash, err = findPasswordHash(db, u.Username)

	isMatch := passwordMatchesHash(u.Password, passwordHash)

	if !isMatch {
		c.JSON(http.StatusUnauthorized, bad{Errors: []clienterr{{Title: "Not authorized", Status: http.StatusUnauthorized}}})
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

func Mount(router *gin.Engine) {
	router.POST("/api/v1/auth", login)
}

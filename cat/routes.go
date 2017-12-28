package cat

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

type ok struct {
	Data []*Cat `json:"data"`
}

type clienterr struct {
	Title  string `json:"title"`
	Status int    `json:"status"` // TODO: make this a union
}

type bad struct {
	Errors []clienterr `json:"errors"`
}

func list(c *gin.Context) {
	db, _ := c.MustGet("db").(*sql.DB)
	term, _ := c.GetQuery("term")

	var cats []*Cat
	var err error
	if term != "" {
		cats, err = search(db, term)
	} else {
		cats, err = findAll(db)
	}

	if err == nil {
		c.JSON(http.StatusOK, ok{
			Data: cats,
		})
	} else {
		c.JSON(http.StatusInternalServerError, bad{Errors: []clienterr{{Title: "Server error", Status: http.StatusInternalServerError}}})
		fmt.Println("cat list error", err)
	}
}

func Mount(router *gin.Engine) {
	router.GET("/api/v1/cat", list)
}

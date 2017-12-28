package expected

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

type ok struct {
	Data []*Expected `json:"data"`
}

type clienterr struct {
	Title  string `json:"title"`
	Status int    `json:"status"` // TODO: make this a union
}

type bad struct {
	Errors []clienterr `json:"errors"`
}

func create(c *gin.Context) {
	db, _ := c.MustGet("db").(*sql.DB)

	var err error
	var expected *Expected
	err = c.BindJSON(&expected)

	if err != nil {
		c.JSON(http.StatusBadRequest, bad{
			Errors: []clienterr{{Title: "Bad expected", Status: http.StatusBadRequest}},
		})
		fmt.Println("expected create req error", err)
		return
	}
	expected, err = insert(db, expected)

	if err == nil {
		c.JSON(http.StatusCreated, ok{
			Data: []*Expected{expected},
		})
	} else {
		c.JSON(http.StatusInternalServerError, err)
		fmt.Println("expected create db error", err)
	}
}

func change(c *gin.Context) {
	db, _ := c.MustGet("db").(*sql.DB)

	var id int
	var err error
	var expected *Expected
	err = c.BindJSON(&expected)

	if err != nil {
		c.JSON(http.StatusBadRequest, bad{
			Errors: []clienterr{{Title: "Bad expected", Status: http.StatusBadRequest}},
		})
		fmt.Println("expected update req error", err)
		return
	}
	id, err = strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, bad{
			Errors: []clienterr{{Title: "Bad id", Status: http.StatusBadRequest}},
		})
		return
	}
	if expected.Id != id {
		c.JSON(http.StatusBadRequest, bad{
			Errors: []clienterr{{Title: "URL id must match expected id", Status: http.StatusBadRequest}},
		})
		fmt.Println("expected update req error", err)
		return
	}

	expected, err = update(db, expected)
	if err == nil {
		c.JSON(http.StatusOK, ok{
			Data: []*Expected{expected},
		})
	} else {
		c.JSON(http.StatusInternalServerError, err)
		fmt.Println("expected update db error", err)
	}
}

func Mount(router *gin.Engine) {
	// TODO: update client to pass year/month instead of date
	router.POST("/api/v1/expected", create)
	router.PUT("/api/v1/expected/:id", change)
}

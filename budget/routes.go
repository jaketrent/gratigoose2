package budget

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jaketrent/gratigoose2/expected"
	"github.com/jaketrent/gratigoose2/trans"
	"net/http"
	"strconv"
)

type data struct {
	Expecteds []*expected.Expected `json:"expecteds"`
	Transs    []*trans.Trans       `json:"transs"`
}

type ok struct {
	Data data `json:"data"`
}

type clienterr struct {
	Title  string `json:"title"`
	Status int    `json:"status"` // TODO: make this a union
}

type bad struct {
	Errors []clienterr `json:"errors"`
}

func show(c *gin.Context) {
	var expecteds []*expected.Expected
	var transs []*trans.Trans
	var err error
	var year int
	var month int

	db := c.MustGet("db").(*sql.DB)
	year, err = strconv.Atoi(c.Param("year"))
	if err != nil {
		c.JSON(http.StatusBadRequest, bad{Errors: []clienterr{{Title: "Invalid year", Status: http.StatusBadRequest}}})
		return
	}
	month, err = strconv.Atoi(c.Param("month"))
	if err != nil {
		c.JSON(http.StatusBadRequest, bad{Errors: []clienterr{{Title: "Invalid month", Status: http.StatusBadRequest}}})
		return
	}

	expecteds, err = expected.FindInYearMonth(db, year, month)
	if err != nil {
		fmt.Println("error in budget expecteds", err)
		c.JSON(http.StatusInternalServerError, bad{Errors: []clienterr{{Title: "Error retrieving expected", Status: http.StatusInternalServerError}}})
		return
	}

	transs, err = trans.FindInYearMonth(db, year, month)
	if err != nil {
		fmt.Println("error in budget transs", err)
		c.JSON(http.StatusInternalServerError, bad{Errors: []clienterr{{Title: "Error retrieving transactions", Status: http.StatusInternalServerError}}})
		return
	}

	c.JSON(http.StatusOK, ok{Data: data{
		Expecteds: expecteds,
		Transs:    transs,
	}})
}

func Mount(router *gin.Engine) {
	router.GET("/api/v1/budget/year/:year/month/:month", show)
}

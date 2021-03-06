package budget

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jaketrent/gratigoose2/expected"
	"github.com/jaketrent/gratigoose2/trans"
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

func yearMonthCat(c *gin.Context) {
	var expecteds []*expected.Expected
	var transs []*trans.Trans
	var err error
	var year int
	var month int
	var catId int

	db, _ := c.MustGet("db").(*sql.DB)
	year, err = strconv.Atoi(c.Param("year"))
	if err != nil {
		c.JSON(http.StatusBadRequest, bad{
			Errors: []clienterr{{Title: "Bad year", Status: http.StatusBadRequest}},
		})
		return
	}

	month, err = strconv.Atoi(c.Param("month"))
	if err != nil {
		c.JSON(http.StatusBadRequest, bad{
			Errors: []clienterr{{Title: "Bad month", Status: http.StatusBadRequest}},
		})
		return
	}

	catId, err = strconv.Atoi(c.Param("catId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, bad{
			Errors: []clienterr{{Title: "Bad category", Status: http.StatusBadRequest}},
		})
		return
	}

	expecteds, err = expected.FindInYearMonthCat(db, year, month, catId)
	if err != nil {
		fmt.Println("error in year month cat expecteds", err)
		c.JSON(http.StatusInternalServerError, bad{Errors: []clienterr{{Title: "Error retrieving expected", Status: http.StatusInternalServerError}}})
		return
	}

	transs, err = trans.FindInYearMonthCat(db, year, month, catId)
	if err != nil {
		fmt.Println("error in year month cat transs", err)
		c.JSON(http.StatusInternalServerError, bad{Errors: []clienterr{{Title: "Error retrieving transactions", Status: http.StatusInternalServerError}}})
		return
	}

	c.JSON(http.StatusOK, ok{Data: data{
		Expecteds: expecteds,
		Transs:    transs,
	}})
}

func reuseLastBudget(c *gin.Context) {
	var expecteds []*expected.Expected
	var err error
	var thisYear int
	var thisMonth int
	var lastYear int
	var lastMonth int

	db := c.MustGet("db").(*sql.DB)
	thisYear, err = strconv.Atoi(c.Param("year"))
	if err != nil {
		c.JSON(http.StatusBadRequest, bad{Errors: []clienterr{{Title: "Invalid year", Status: http.StatusBadRequest}}})
		return
	}
	thisMonth, err = strconv.Atoi(c.Param("month"))
	if err != nil {
		c.JSON(http.StatusBadRequest, bad{Errors: []clienterr{{Title: "Invalid month", Status: http.StatusBadRequest}}})
		return
	}

	if thisMonth == 1 {
		lastMonth = 12
		lastYear = thisYear - 1
	} else {
		lastYear = thisYear
		lastMonth = thisMonth - 1
	}

	expecteds, err = expected.CopyFrom(db, lastYear, lastMonth, thisYear, thisMonth)
	if err != nil {
		fmt.Println("error in expecteds copying", err)
		c.JSON(http.StatusInternalServerError, bad{Errors: []clienterr{{Title: "Error copying expecteds", Status: http.StatusInternalServerError}}})
		return
	}

	c.JSON(http.StatusOK, ok{Data: data{
		Expecteds: expecteds,
	}})
}

func Mount(router *gin.Engine) {
	router.GET("/api/v1/budget/year/:year/month/:month", show)
	router.GET("/api/v1/budget/year/:year/month/:month/cat/:catId", yearMonthCat)
	router.POST("/api/v1/budget/year/:year/month/:month/reuse", reuseLastBudget)
}

package trans

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

type ok struct {
	Data []*Trans `json:"data"`
}

type clienterr struct {
	Title  string
	Status int // TODO: make this a union
}

type bad struct {
	Errors []clienterr `json:"errors"`
}

func list(c *gin.Context) {
	db, _ := c.MustGet("db").(*sql.DB)
	transs, err := findAll(db)

	if err == nil {
		c.JSON(http.StatusOK, ok{
			Data: transs,
		})
	} else {
		c.JSON(http.StatusInternalServerError, bad{Errors: []clienterr{{Title: "Server error", Status: http.StatusInternalServerError}}})
		fmt.Println("trans list error", err)
	}
}

func year(c *gin.Context) {
	db, _ := c.MustGet("db").(*sql.DB)
	year, err := strconv.Atoi(c.Param("year"))

	if err != nil {
		c.JSON(http.StatusBadRequest, bad{
			Errors: []clienterr{{Title: "Bad year", Status: http.StatusBadRequest}},
		})
		return
	}

	transs, err := findInYear(db, year)
	if err == nil {
		c.JSON(http.StatusOK, ok{
			Data: transs,
		})
	} else {
		c.JSON(http.StatusInternalServerError, bad{Errors: []clienterr{{Title: "Server error", Status: http.StatusInternalServerError}}})
		fmt.Println("trans year error", err)
	}
}

func yearMonth(c *gin.Context) {
	db, _ := c.MustGet("db").(*sql.DB)
	year, err := strconv.Atoi(c.Param("year"))
	if err != nil {
		c.JSON(http.StatusBadRequest, bad{
			Errors: []clienterr{{Title: "Bad year", Status: http.StatusBadRequest}},
		})
		return
	}

	month, err := strconv.Atoi(c.Param("month"))
	if err != nil {
		c.JSON(http.StatusBadRequest, bad{
			Errors: []clienterr{{Title: "Bad month", Status: http.StatusBadRequest}},
		})
		return
	}

	transs, err := findInYearMonth(db, year, month)
	if err == nil {
		c.JSON(http.StatusOK, ok{
			Data: transs,
		})
	} else {
		c.JSON(http.StatusInternalServerError, bad{Errors: []clienterr{{Title: "Server error", Status: http.StatusInternalServerError}}})
		fmt.Println("trans year month error", err)
	}
}

type newtrans struct {
	Data *Trans `json:"data"`
}

func create(c *gin.Context) {
	db, _ := c.MustGet("db").(*sql.DB)

	var err error
	var trans *Trans
	err = c.BindJSON(&trans)

	if err != nil {
		c.JSON(http.StatusBadRequest, bad{
			Errors: []clienterr{{Title: "Bad transaction", Status: http.StatusBadRequest}},
		})
		fmt.Println("trans create req error", err)
		return
	}
	trans, err = insert(db, trans)

	if err == nil {
		c.JSON(http.StatusCreated, struct {
			Data *Trans `json:"data"`
		}{
			trans,
		})
	} else {
		c.JSON(http.StatusInternalServerError, err)
		fmt.Println("trans create db error", err)
	}
}

func Mount(router *gin.Engine) {
	router.POST("/api/v1/transactions", create)
	router.GET("/api/v1/transactions", list)
	router.GET("/api/v1/transactions/year/:year", year)
	router.GET("/api/v1/transactions/year/:year/month/:month", yearMonth)
}

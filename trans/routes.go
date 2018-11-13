package trans

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ok struct {
	Data []*Trans `json:"data"`
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

	transs, err := FindInYearMonth(db, year, month)
	if err == nil {
		c.JSON(http.StatusOK, ok{
			Data: transs,
		})
	} else {
		c.JSON(http.StatusInternalServerError, bad{Errors: []clienterr{{Title: "Server error", Status: http.StatusInternalServerError}}})
		fmt.Println("trans year month error", err)
	}
}

func yearMonthCat(c *gin.Context) {
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

	catId, err := strconv.Atoi(c.Param("catId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, bad{
			Errors: []clienterr{{Title: "Bad category", Status: http.StatusBadRequest}},
		})
		return
	}

	transs, err := FindInYearMonthCat(db, year, month, catId)
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
		c.JSON(http.StatusCreated, ok{
			Data: []*Trans{trans},
		})
	} else {
		c.JSON(http.StatusInternalServerError, err)
		fmt.Println("trans create db error", err)
	}
}

func change(c *gin.Context) {
	db, _ := c.MustGet("db").(*sql.DB)

	var id int
	var err error
	var trans *Trans
	err = c.BindJSON(&trans)

	if err != nil {
		c.JSON(http.StatusBadRequest, bad{
			Errors: []clienterr{{Title: "Bad transaction", Status: http.StatusBadRequest}},
		})
		fmt.Println("trans update req error", err)
		return
	}
	id, err = strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, bad{
			Errors: []clienterr{{Title: "Bad id", Status: http.StatusBadRequest}},
		})
		return
	}
	if trans.Id != id {
		c.JSON(http.StatusBadRequest, bad{
			Errors: []clienterr{{Title: "URL id must match transaction id", Status: http.StatusBadRequest}},
		})
		fmt.Println("trans update req error", err)
		return
	}

	trans, err = update(db, trans)
	if err == nil {
		c.JSON(http.StatusOK, ok{
			Data: []*Trans{trans},
		})
	} else {
		c.JSON(http.StatusInternalServerError, err)
		fmt.Println("trans update db error", err)
	}
}

func destroy(c *gin.Context) {
	db, _ := c.MustGet("db").(*sql.DB)

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, bad{
			Errors: []clienterr{{Title: "Bad id", Status: http.StatusBadRequest}},
		})
		return
	}

	err = delete(db, id)
	if err == nil {
		c.Status(http.StatusNoContent)
	} else {
		c.JSON(http.StatusInternalServerError, err)
		fmt.Println("trans destroy db error", err)
	}
}

func Mount(router *gin.Engine) {
	router.POST("/api/v1/trans", create)
	router.PUT("/api/v1/trans/:id", change)
	router.DELETE("/api/v1/trans/:id", destroy)
	router.GET("/api/v1/trans", list)
	router.GET("/api/v1/trans/year/:year", year)
	router.GET("/api/v1/trans/year/:year/month/:month", yearMonth)
}

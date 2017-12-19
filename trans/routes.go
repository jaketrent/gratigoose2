package trans

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/http"
)

type response struct {
	Data []*Trans `json:"data"`
}

func list(c *gin.Context) {
	db, _ := c.MustGet("db").(*sql.DB)
	transs, err := FindAll(db)

	if err == nil {
		c.JSON(http.StatusOK, response{
			Data: transs,
		})
	} else {
		c.JSON(http.StatusInternalServerError, err)
	}
}

func Mount(router *gin.Engine) {
	router.GET("/api/v1/transactions", list)
}

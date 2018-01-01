package static

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func mountFile(router *gin.Engine, fileName string) {
	router.GET(fileName, func(c *gin.Context) {
		c.Status(http.StatusOK)
		c.File("./client/build" + fileName)
	})
}

func Mount(router *gin.Engine) {
	mountFile(router, "/asset-manifest.json")
	mountFile(router, "/favicon.ico")
	mountFile(router, "/index.html")
	router.GET("/", func(c *gin.Context) {
		c.Status(http.StatusOK)
		c.File("./client/build/index.html")
	})
	mountFile(router, "/manifest.json")
	mountFile(router, "/service-worker.js")
	router.Static("/static", "./client/build/static")
}

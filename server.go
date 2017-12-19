package main

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	// "github.com/jinzhu/gorm"
	// _ "github.com/jinzhu/gorm/dialects/postgres"
	"log"
	"net/http"
	"os"
)

type User struct {
	Username string `json: username`
	Password string `json: password`
}

func handleGet(c *gin.Context) {
	message, _ := c.GetQuery("m")
	c.String(http.StatusOK, "Get works! you sent "+message)
}

func handleOptions(c *gin.Context) {

	c.Header("Allow", "POST, GET, OPTIONS")
	c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Headers", "origin, content-type, accept")
	c.Header("Content-Type", "application/json")
	c.Status(http.StatusOK)
}

func handleVerification(c *gin.Context) {
	var u User
	c.BindJSON(&u)
	c.JSON(http.StatusOK, gin.H{
		"user": u.Username,
		"pass": u.Password,
	})
}

type Trans struct {
	Id int
	// Description string
	// Year        int64
}

func listTransactions(c *gin.Context) {
	db, _ := c.MustGet("db").(*sql.DB)
	rows, err := db.Query("select id from trans")

	if err != nil {
		log.Fatal("Error in query", err)
	}

	transs := make([]*Trans, 0)
	for rows.Next() {
		var trans Trans
		if err := rows.Scan(&trans.Id); err != nil {
			log.Fatal("Access err", err)
		}
		transs = append(transs, &trans)
	}
	fmt.Printf("----- trans --- %+v", transs)

	c.JSON(http.StatusOK, transs)
}

func initializeRoutes(router *gin.Engine) {
	router.GET("/api/v1/transactions", listTransactions)
	router.POST("/api", handleVerification)
	router.OPTIONS("/api", handleOptions)
	router.GET("/api", handleGet)
}

func hasDatabase(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	}
}

func main() {
	connStr := os.Getenv("DATABASE_URL")
	db, err := sql.Open("postgres", connStr)

	if err != nil {
		log.Fatal("Db unable to connect", err)
	}

	router := gin.Default()
	router.Use(hasDatabase(db))
	initializeRoutes(router)
	router.Run()
}

package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
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
	gorm.Model
	ID int
	// Description string
	// Year        int64
}

func listTransactions(c *gin.Context) {
	db, _ := c.MustGet("db").(gorm.DB)
	// tx := db.Begin()

	var model Trans
	// var models []Trans
	// db.Find(&models)
	// tx.First(&model, 70)
	fmt.Printf("%+v", db)
	db.First(&model)
	// log.Println("after", model)

	// err := tx.Commit().Error
	// if err != nil {
	// 	log.Fatal("Error in query", err)
	// }
	// transs := make([]Trans, 999999)
	// db.Find(&transs)
	// db.Where(&Trans{Year: 2017}).Find(&transs)
	// db.Find(&transs)
	// c.JSON(http.StatusOK, model)
}

func initializeRoutes(router *gin.Engine) {
	router.GET("/api/v1/transactions", listTransactions)
	router.POST("/api", handleVerification)
	router.OPTIONS("/api", handleOptions)
	router.GET("/api", handleGet)
}

func hasDatabase(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	}
}

func main() {
	dbHost := os.Getenv("DB_HOST")
	dbUser := os.Getenv("DB_USER")
	dbName := os.Getenv("DB_NAME")
	dbPassword := os.Getenv("DB_PASSWORD")
	connStr := fmt.Sprintf("host=%v user=%v dbname=%v sslmode=disable password=%v", dbHost, dbUser, dbName, dbPassword)
	fmt.Printf("----------connStr: %+v", connStr)
	db, err := gorm.Open("postgres", connStr)
	fmt.Printf("----------db: %+v", db)
	if err != nil {
		log.Fatal("Db unable to connect", err)
	}
	db.AutoMigrate()
	// defer db.Close()

	router := gin.Default()
	router.Use(hasDatabase(db))
	initializeRoutes(router)
	router.Run()
}

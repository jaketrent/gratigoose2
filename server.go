package main

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/jaketrent/gratigoose2/acct"
	"github.com/jaketrent/gratigoose2/auth"
	"github.com/jaketrent/gratigoose2/budget"
	"github.com/jaketrent/gratigoose2/cat"
	"github.com/jaketrent/gratigoose2/expected"
	"github.com/jaketrent/gratigoose2/static"
	"github.com/jaketrent/gratigoose2/trans"
	_ "github.com/joho/godotenv/autoload"
	_ "github.com/lib/pq"
	"log"
	"os"
)

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
	defer db.Close()

	router := gin.Default()

	router.Use(hasDatabase(db))
	auth.Mount(router)

	router.Use(auth.IsLoggedIn(db))
	acct.Mount(router)
	budget.Mount(router)
	cat.Mount(router)
	expected.Mount(router)
	trans.Mount(router)

	static.Mount(router)

	router.Run()
}

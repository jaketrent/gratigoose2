package main

import (
	"database/sql"
	"github.com/jaketrent/gratigoose2/auth"
	_ "github.com/joho/godotenv/autoload"
	_ "github.com/lib/pq"
	"log"
	"os"
)

func main() {
	args := os.Args[1:]
	username := args[0]
	password := args[1]

	passwordHash, err := auth.CreateHash(password)

	connStr := os.Getenv("DATABASE_URL")
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Db unable to connect", err)
	}
	defer db.Close()

	err = auth.Insert(db, &auth.User{Username: username, PasswordHash: passwordHash})
	if err != nil {
		log.Fatal("Unable to persist user", err)
	}

}

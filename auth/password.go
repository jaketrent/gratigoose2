package auth

import (
	"golang.org/x/crypto/bcrypt"
)

func passwordMatchesHash(password string, passwordHash string) bool {
	return bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(password)) == nil
}

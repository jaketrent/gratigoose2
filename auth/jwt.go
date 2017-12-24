package auth

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"time"
)

func createSignedToken(signingKey []byte) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		ExpiresAt: time.Now().Add(24 * time.Hour).Unix(),
		Issuer:    "jake",
	})

	tokenString, err := token.SignedString(signingKey)

	if err != nil {
		fmt.Println("jwt signing error", err)
	}

	return tokenString, err
}

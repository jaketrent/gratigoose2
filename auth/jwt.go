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

func isTokenValid(signingKey []byte, tokenString string) (bool, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return signingKey, nil

	})

	return err == nil && token.Valid, err
}

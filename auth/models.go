package auth

type User struct {
	Username     string `json:"username"`
	Password     string `json:"password"`
	PasswordHash string
}

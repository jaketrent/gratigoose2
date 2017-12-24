package auth

import (
	"database/sql"
)

func findPasswordHash(db *sql.DB, username string) (string, error) {
	const query = `
select password_hash
from auth_user
where username = $1
`
	var passwordHash string
	err := db.QueryRow(query, username).Scan(&passwordHash)

	return passwordHash, err
}

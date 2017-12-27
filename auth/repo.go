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

func Insert(db *sql.DB, user *User) error {

	const query = `
insert into auth_user
( username
, password_hash
) values
( $1
, $2)
returning created
, updated
`
	_, err := db.Exec(query, user.Username, user.PasswordHash)

	return err
}

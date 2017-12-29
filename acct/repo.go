package acct

import (
	"database/sql"
	"fmt"
	"strings"
)

func findAll(db *sql.DB) ([]*Acct, error) {
	const query = `
select id
, name
, abbrev
, liquidable
, created
, updated
from acct
`
	rows, err := db.Query(query)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	accts := make([]*Acct, 0)
	for rows.Next() {
		var acct Acct
		if err := rows.Scan(&acct.Id, &acct.Name, &acct.Abbrev, &acct.Liquidable, &acct.Created, &acct.Updated); err != nil {
			return nil, err
		}
		accts = append(accts, &acct)
	}
	return accts, nil
}

func search(db *sql.DB, term string) ([]*Acct, error) {
	fmt.Println("term", term)
	const query = `
select id
, name
, abbrev
, liquidable
, created
, updated
from acct
where lower(name) like $1
or lower(abbrev) like $1
`
	rows, err := db.Query(query, "%"+strings.ToLower(term)+"%")

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	accts := make([]*Acct, 0)
	for rows.Next() {
		var acct Acct
		if err := rows.Scan(&acct.Id, &acct.Name, &acct.Abbrev, &acct.Liquidable, &acct.Created, &acct.Updated); err != nil {
			return nil, err
		}
		fmt.Printf("acct %+v", acct)
		accts = append(accts, &acct)
	}

	fmt.Printf("array of accts %+v", accts)
	return accts, nil
}

package acct

import (
	"database/sql"
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

package cat

import (
	"database/sql"
)

func findAll(db *sql.DB) ([]*Cat, error) {
	const query = `
select id
, name
, abbrev
, description
, type
, created
, updated
from cat
`
	rows, err := db.Query(query)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	cats := make([]*Cat, 0)
	for rows.Next() {
		var cat Cat
		if err := rows.Scan(&cat.Id, &cat.Name, &cat.Abbrev, &cat.Description, &cat.Type, &cat.Created, &cat.Updated); err != nil {
			return nil, err
		}
		cats = append(cats, &cat)
	}
	return cats, nil
}

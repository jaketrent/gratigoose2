package expected

import (
	"database/sql"
	"time"
)

func insert(db *sql.DB, expected *Expected) (*Expected, error) {
	const query = `
 insert into expected
( cat_id
, amt
, year
, month
, date
) values
( $1
, $2
, $3
, $4
, $5
) returning id
, created
, updated
`
	date := time.Date(expected.Year, time.Month(expected.Month), 1, 0, 0, 0, 0, time.UTC)
	err := db.QueryRow(query, expected.CatId, expected.Amt, expected.Year, expected.Month, date).Scan(&expected.Id, &expected.Created, &expected.Updated)
	return expected, err
}

func update(db *sql.DB, expected *Expected) (*Expected, error) {
	const query = `
update expected
set amt = $1
, updated = $2
where id = $3
returning cat_id
, year
, month
, date
, created
, updated
`
	err := db.QueryRow(query, expected.Amt, time.Now(), expected.Id).Scan(&expected.CatId, &expected.Year, &expected.Month, &expected.Date, &expected.Created, &expected.Updated)
	return expected, err
}

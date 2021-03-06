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
, notes
, year
, month
, date
) values
( $1
, $2
, $3
, $4
, $5
, $6
) returning id
, created
, updated
`
	date := time.Date(expected.Year, time.Month(expected.Month), 1, 0, 0, 0, 0, time.UTC)
	err := db.QueryRow(query, expected.CatId, expected.Amt, expected.Notes, expected.Year, expected.Month, date).Scan(&expected.Id, &expected.Created, &expected.Updated)
	return expected, err
}

func update(db *sql.DB, expected *Expected) (*Expected, error) {
	const query = `
update expected
set amt = $1
, notes = $2
, updated = $3
where id = $4
returning cat_id
, year
, month
, date
, created
, updated
`
	err := db.QueryRow(query, expected.Amt, expected.Notes, time.Now(), expected.Id).Scan(&expected.CatId, &expected.Year, &expected.Month, &expected.Date, &expected.Created, &expected.Updated)
	return expected, err
}

func FindInYearMonth(db *sql.DB, year int, month int) ([]*Expected, error) {
	const query = `
select id
, cat_id
, amt
, notes
, year
, month
, date
, created
, updated
from expected
where year = $1
and month = $2
`
	rows, err := db.Query(query, year, month)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	expecteds := make([]*Expected, 0)
	for rows.Next() {
		var expected Expected
		if err := rows.Scan(&expected.Id, &expected.CatId, &expected.Amt, &expected.Notes, &expected.Year, &expected.Month, &expected.Date, &expected.Created, &expected.Updated); err != nil {
			return nil, err
		}
		expecteds = append(expecteds, &expected)
	}
	return expecteds, nil
}

func FindInYearMonthCat(db *sql.DB, year int, month int, catId int) ([]*Expected, error) {
	const query = `
select id
, cat_id
, amt
, notes
, year
, month
, date
, created
, updated
from expected
where year = $1
and month = $2
and cat_id = $3
`
	rows, err := db.Query(query, year, month, catId)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	expecteds := make([]*Expected, 0)
	for rows.Next() {
		var expected Expected
		if err := rows.Scan(&expected.Id, &expected.CatId, &expected.Amt, &expected.Notes, &expected.Year, &expected.Month, &expected.Date, &expected.Created, &expected.Updated); err != nil {
			return nil, err
		}
		expecteds = append(expecteds, &expected)
	}
	return expecteds, nil
}

func CopyFrom(db *sql.DB, fromYear int, fromMonth int, toYear int, toMonth int) ([]*Expected, error) {
	const query = `
insert into expected
( cat_id
, amt
, notes
, year
, month
, date
) select cat_id
, amt
, notes
, $3
, $4
, $5
from expected
where year = $1
and month = $2
returning id
, cat_id
, amt
, notes
, year
, month
, date
, created
, updated
`
	toDate := time.Date(toYear, time.Month(toMonth), 1, 0, 0, 0, 0, time.UTC)
	rows, err := db.Query(query, fromYear, fromMonth, toYear, toMonth, toDate)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	expecteds := make([]*Expected, 0)
	for rows.Next() {
		var expected Expected
		if err := rows.Scan(&expected.Id, &expected.CatId, &expected.Amt, &expected.Notes, &expected.Year, &expected.Month, &expected.Date, &expected.Created, &expected.Updated); err != nil {
			return nil, err
		}
		expecteds = append(expecteds, &expected)
	}
	return expecteds, nil
}

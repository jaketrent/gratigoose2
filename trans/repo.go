package trans

import (
	"database/sql"
)

func findAll(db *sql.DB) ([]*Trans, error) {
	rows, err := db.Query("select id, trans_date, description, amt, created, updated, year, month, day from trans order by trans_date desc")

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	transs := make([]*Trans, 0)
	for rows.Next() {
		var trans Trans
		if err := rows.Scan(&trans.Id, &trans.Date, &trans.Description, &trans.Amt, &trans.Created, &trans.Updated, &trans.Year, &trans.Month, &trans.Day); err != nil {
			return nil, err
		}
		transs = append(transs, &trans)
	}
	return transs, nil
}

func findInYear(db *sql.DB, year int) ([]*Trans, error) {
	rows, err := db.Query("select id, trans_date, description, amt, created, updated, year, month, day from trans where year = $1 order by trans_date desc", year)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	transs := make([]*Trans, 0)
	for rows.Next() {
		var trans Trans
		if err := rows.Scan(&trans.Id, &trans.Date, &trans.Description, &trans.Amt, &trans.Created, &trans.Updated, &trans.Year, &trans.Month, &trans.Day); err != nil {
			return nil, err
		}
		transs = append(transs, &trans)
	}
	return transs, nil
}

func findInYearMonth(db *sql.DB, year int, month int) ([]*Trans, error) {
	rows, err := db.Query("select id, trans_date, description, amt, created, updated, year, month, day from trans where year = $1 and month = $2 order by trans_date desc", year, month)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	transs := make([]*Trans, 0)
	for rows.Next() {
		var trans Trans
		if err := rows.Scan(&trans.Id, &trans.Date, &trans.Description, &trans.Amt, &trans.Created, &trans.Updated, &trans.Year, &trans.Month, &trans.Day); err != nil {
			return nil, err
		}
		transs = append(transs, &trans)
	}
	return transs, nil
}

func insert(db *sql.DB, trans *Trans) (*Trans, error) {
	const query = `
insert into trans
( trans_date
, description
, amt
, acct_id
, cat_id
, year
, month
, day
) values
( $1
, $2
, $3
, $4
, $5
, $6
, $7
, $8
) returning id
, created
, updated
`
	err := db.QueryRow(query, trans.Date, trans.Description, trans.Amt,
		trans.AcctId, trans.CatId,
		trans.Date.Year(), trans.Date.Month(), trans.Date.Day()).Scan(&trans.Id, &trans.Created, &trans.Updated)
	return trans, err
}

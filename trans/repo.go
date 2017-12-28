// TODO: maybe package this as repo?  make imports nicer and naming easier
package trans

import (
	"database/sql"
	"errors"
	"fmt"
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
		if err := rows.Scan(&trans.Id, &trans.Date, &trans.Desc, &trans.Amt, &trans.Created, &trans.Updated, &trans.Year, &trans.Month, &trans.Day); err != nil {
			return nil, err
		}
		transs = append(transs, &trans)
	}
	return transs, nil
}

func findInYear(db *sql.DB, year int) ([]*Trans, error) {
	const query = `
select id
, trans_date
, description
, amt
, acct_id
, cat_id
, created
, updated
, year
, month
, day
from trans
where year = $1
order by trans_date desc
`
	rows, err := db.Query(query, year)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	transs := make([]*Trans, 0)
	for rows.Next() {
		var trans Trans
		if err := rows.Scan(&trans.Id, &trans.Date, &trans.Desc, &trans.Amt, &trans.AcctId, &trans.CatId, &trans.Created, &trans.Updated, &trans.Year, &trans.Month, &trans.Day); err != nil {
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
		if err := rows.Scan(&trans.Id, &trans.Date, &trans.Desc, &trans.Amt, &trans.Created, &trans.Updated, &trans.Year, &trans.Month, &trans.Day); err != nil {
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
	err := db.QueryRow(query, trans.Date, trans.Desc, trans.Amt,
		trans.AcctId, trans.CatId,
		trans.Date.Year(), trans.Date.Month(), trans.Date.Day()).Scan(&trans.Id, &trans.Created, &trans.Updated)
	return trans, err
}

func update(db *sql.DB, trans *Trans) (*Trans, error) {
	const query = `
update trans
set trans_date = $1
, description = $2
, amt = $3
, acct_id = $4
, cat_id = $5
, year = $6
, month = $7
, day = $8
where id = $9
`
	result, err := db.Exec(query, trans.Date, trans.Desc, trans.Amt,
		trans.AcctId, trans.CatId,
		trans.Date.Year(), trans.Date.Month(), trans.Date.Day(), trans.Id)

	count, err := result.RowsAffected()
	if count != 1 {
		return trans, errors.New(fmt.Sprintf("update trans modified inappropriate rows (count: %v)", count))
	}
	return trans, err
}

func delete(db *sql.DB, id int) error {
	const query = `
delete from trans
where id = $1
`
	result, err := db.Exec(query, id)

	count, err := result.RowsAffected()
	if count != 1 {
		return errors.New(fmt.Sprintf("delete trans modified inappropriate rows (count: %v)", count))
	}
	return err
}

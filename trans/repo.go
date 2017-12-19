package trans

import "database/sql"

func FindAll(db *sql.DB) ([]*Trans, error) {
	rows, err := db.Query("select id, trans_date, description, amt, created, updated, year, month, day from trans order by trans_date desc")

	if err != nil {
		return nil, err
	}

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

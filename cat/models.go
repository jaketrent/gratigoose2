package cat

import (
	"database/sql"
	"encoding/json"
	"time"
)

// TODO: make cat_type enum
// https://stackoverflow.com/questions/23917916/printable-enums-in-go

type Cat struct {
	Id          int        `json:"id"`
	Name        string     `json:"name"`
	Abbrev      string     `json:"abbrev"`
	Description NullString `json:"description"`
	Type        string     `json:"type"`
	Created     time.Time  `json:"created"`
	Updated     time.Time  `json:"updated"`
}

type NullString struct {
	sql.NullString
}

func (ns *NullString) MarshalJSON() ([]byte, error) {
	if !ns.Valid {
		return []byte("null"), nil
	}
	return json.Marshal(ns.String)
}

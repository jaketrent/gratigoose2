package trans

import (
	"encoding/json"
	"time"
)

type Trans struct {
	Id      int         `json:"id"`
	Date    time.Time   `json:"date"`
	Desc    string      `json:"desc"`
	Amt     json.Number `json:"amt"`
	AcctId  int         `json:"acctId"`
	CatId   int         `json:"catId"`
	Created time.Time   `json:"created"`
	Updated time.Time   `json:"updated"`
	Year    int         `json:"year"`
	Month   int         `json:"month"`
	Day     int         `json:"day"`
}

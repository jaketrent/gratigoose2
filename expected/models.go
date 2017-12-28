package expected

import (
	"encoding/json"
	"time"
)

type Expected struct {
	Id      int         `json:"id"`
	CatId   int         `json:"catId"`
	Amt     json.Number `json:"amt"`
	Year    int         `json:"year"`
	Month   int         `json:"month"`
	Date    time.Time   `json:"date"`
	Created time.Time   `json:"created"`
	Updated time.Time   `json:"updated"`
}

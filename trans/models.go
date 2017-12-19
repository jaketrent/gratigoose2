package trans

import "time"

type Trans struct {
	Id          int       `json:"id"`
	Date        time.Time `json:"date"`
	Description string    `json:"description"`
	Amt         float64   `json:"amt"`
	Created     time.Time `json:"created"`
	Updated     time.Time `json:"updated"`
	Year        int       `json:"year"`
	Month       int       `json:"month"`
	Day         int       `json:"day"`
}

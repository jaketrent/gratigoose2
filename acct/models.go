package acct

import (
	"time"
)

type Acct struct {
	Id         int       `json:"id"`
	Name       string    `json:"name"`
	Abbrev     string    `json:"abbrev"`
	Liquidable bool      `json:"liquidable"`
	Created    time.Time `json:"created"`
	Updated    time.Time `json:"updated"`
}

package trans

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"
)

const dateLayout = "2006-01-02"

type TransDate struct {
	time.Time
}

// per https://stackoverflow.com/questions/25087960/json-unmarshal-time-that-isnt-in-rfc-3339-format
func (td *TransDate) UnmarshalJSON(b []byte) (err error) {
	s := strings.Trim(string(b), "\"")
	if s == "null" {
		td.Time = time.Time{}
		return
	}
	td.Time, err = time.Parse(dateLayout, s)
	return
}

func (td *TransDate) MarshalJSON() ([]byte, error) {
	if td.Time.UnixNano() == nilTime {
		return []byte("null"), nil
	}
	return []byte(fmt.Sprintf("\"%s\"", td.Time.Format(dateLayout))), nil

}

var nilTime = (time.Time{}).UnixNano()

func (td *TransDate) IsSet() bool {
	return td.UnixNano() != nilTime
}

// per https://stackoverflow.com/questions/30277296/confused-about-custom-types-in-sql-when-sql-db-exec
func (td *TransDate) Value() (driver.Value, error) {
	return time.Date(td.Year(), td.Month(), td.Day(), 0, 0, 0, 0, time.UTC), nil
}

// per https://husobee.github.io/golang/database/2015/06/12/scanner-valuer.html
// per https://gist.github.com/jmoiron/6979540
func (td *TransDate) Scan(value interface{}) error {
	switch value.(type) {
	case time.Time:
		t := value.(time.Time)
		*td = TransDate{time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, time.UTC)}
	default:
		return errors.New("Incompatible type for TransDate")
	}
	return nil
}

type Trans struct {
	Id          int         `json:"id"`
	Date        TransDate   `json:"date"`
	Description string      `json:"description"`
	Amt         json.Number `json:"amt"`
	AcctId      int         `json:"acctId"`
	CatId       int         `json:"catId"`
	Created     time.Time   `json:"created"`
	Updated     time.Time   `json:"updated"`
	Year        int         `json:"year"`
	Month       int         `json:"month"`
	Day         int         `json:"day"`
}

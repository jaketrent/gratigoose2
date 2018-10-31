## To migrate database

```
createdb gratigoose_dev
govendor sync
go install
goose up
```

(uses [goose](https://bitbucket.org/liamstask/goose))

## To bootstrap required data

```
psql -d gratigoose_dev -f db/insert_test_data.sql
```

(In order to see UI locally)

## To create a user login

```
go run cmd/create_user.go <username> <password>
```

## To run server

```
go get -u github.com/kardianos/govendor
govendor sync
go install
heroku local # or go run server.go
```

## To run client

```
cd client
npm install
npm start
```

## Add new dependency

```
go get bitbucket.org/liamstask/goose/cmd/goose
govendor add bitbucket.org/liamstask/goose/cmd/goose
```
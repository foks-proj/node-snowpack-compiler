module ne43.pub/node-snowpack-compiler/go-examples

go 1.19

require ne43.pub/go-snowpack-rpc v0.0.0

replace (
	ne43.pub/go-snowpack-rpc => ../../go-snowpack-rpc
	ne43.pub/go-ctxlog => ../../go-ctxlog
)

require (
	github.com/keybase/backoff v1.0.1-0.20160517061000-726b63b835ec // indirect
	github.com/keybase/go-codec v0.0.0-20180928230036-164397562123 // indirect
	github.com/keybase/msgpackzip v0.0.0-20200218014524-5ef7f4879d9d // indirect
	golang.org/x/net v0.0.0-20200425230154-ff2c4b7c35a0 // indirect
	ne43.pub/go-ctxlog v0.0.0-00010101000000-000000000000 // indirect
)

// Auto-generated to Go types and interfaces using snowpack-compiler 1.0.0 (https://github.com/maxtaco/node-snowpack-compiler)
//  Input file: go-examples/2.snowp

package example

import (
	"context"
	"errors"
	"fmt"
	"ne43.pub/go-snowpack-rpc/rpc"
	"time"
)

// Bars are a very special form of bizzle, much like a baizzle,
// but unlike a boozle or a snoozle.
//
// In short, you'll love bars.
type Bar bool
type BarInternal__ bool

func (b Bar) Export() *BarInternal__ {
	tmp := ((bool)(b))
	return ((*BarInternal__)(&tmp))
}

func (b BarInternal__) Import() Bar {
	tmp := (bool)(b)
	return Bar((func(x *bool) (ret bool) {
		if x == nil {
			return ret
		}
		return *x
	})(&tmp))
}

func (b *Bar) Encode(enc rpc.Encoder) error {
	return enc.Encode(b.Export())
}

func (b *Bar) Decode(dec rpc.Decoder) error {
	var tmp BarInternal__
	err := dec.Decode(&tmp)
	if err != nil {
		return err
	}
	*b = tmp.Import()
	return nil
}

func (b Bar) Bytes() []byte {
	return nil
}

type Joe []byte
type JoeInternal__ []byte

func (j Joe) Export() *JoeInternal__ {
	tmp := (([]byte)(j))
	return ((*JoeInternal__)(&tmp))
}

func (j JoeInternal__) Import() Joe {
	tmp := ([]byte)(j)
	return Joe((func(x *[]byte) (ret []byte) {
		if x == nil {
			return ret
		}
		return *x
	})(&tmp))
}

func (j *Joe) Encode(enc rpc.Encoder) error {
	return enc.Encode(j.Export())
}

func (j *Joe) Decode(dec rpc.Decoder) error {
	var tmp JoeInternal__
	err := dec.Decode(&tmp)
	if err != nil {
		return err
	}
	*j = tmp.Import()
	return nil
}

func (j Joe) Bytes() []byte {
	return (j)[:]
}

type Bilzzle [100]byte
type BilzzleInternal__ [100]byte

func (b Bilzzle) Export() *BilzzleInternal__ {
	tmp := (([100]byte)(b))
	return ((*BilzzleInternal__)(&tmp))
}

func (b BilzzleInternal__) Import() Bilzzle {
	tmp := ([100]byte)(b)
	return Bilzzle((func(x *[100]byte) (ret [100]byte) {
		if x == nil {
			return ret
		}
		return *x
	})(&tmp))
}

func (b *Bilzzle) Encode(enc rpc.Encoder) error {
	return enc.Encode(b.Export())
}

func (b *Bilzzle) Decode(dec rpc.Decoder) error {
	var tmp BilzzleInternal__
	err := dec.Decode(&tmp)
	if err != nil {
		return err
	}
	*b = tmp.Import()
	return nil
}

func (b Bilzzle) Bytes() []byte {
	return (b)[:]
}

type Boomie [][400]byte
type BoomieInternal__ []([400]byte)

func (b Boomie) Export() *BoomieInternal__ {
	tmp := (([][400]byte)(b))
	return ((*BoomieInternal__)((func(x [][400]byte) *[]([400]byte) {
		if len(x) == 0 {
			return nil
		}
		ret := make([]([400]byte), len(x))
		for k, v := range x {
			ret[k] = v
		}
		return &ret
	})(tmp)))
}

func (b BoomieInternal__) Import() Boomie {
	tmp := ([]([400]byte))(b)
	return Boomie((func(x *[]([400]byte)) (ret [][400]byte) {
		if x == nil || len(*x) == 0 {
			return nil
		}
		ret = make([][400]byte, len(*x))
		for k, v := range *x {
			ret[k] = (func(x *[400]byte) (ret [400]byte) {
				if x == nil {
					return ret
				}
				return *x
			})(&v)
		}
		return ret
	})(&tmp))
}

func (b *Boomie) Encode(enc rpc.Encoder) error {
	return enc.Encode(b.Export())
}

func (b *Boomie) Decode(dec rpc.Decoder) error {
	var tmp BoomieInternal__
	err := dec.Decode(&tmp)
	if err != nil {
		return err
	}
	*b = tmp.Import()
	return nil
}

func (b Boomie) Bytes() []byte {
	return nil
}

type Jams []Joe
type JamsInternal__ [](*JoeInternal__)

func (j Jams) Export() *JamsInternal__ {
	tmp := (([]Joe)(j))
	return ((*JamsInternal__)((func(x []Joe) *[](*JoeInternal__) {
		if len(x) == 0 {
			return nil
		}
		ret := make([](*JoeInternal__), len(x))
		for k, v := range x {
			ret[k] = v.Export()
		}
		return &ret
	})(tmp)))
}

func (j JamsInternal__) Import() Jams {
	tmp := ([](*JoeInternal__))(j)
	return Jams((func(x *[](*JoeInternal__)) (ret []Joe) {
		if x == nil || len(*x) == 0 {
			return nil
		}
		ret = make([]Joe, len(*x))
		for k, v := range *x {
			if v == nil {
				continue
			}
			ret[k] = (func(x *JoeInternal__) (ret Joe) {
				if x == nil {
					return ret
				}
				return x.Import()
			})(v)
		}
		return ret
	})(&tmp))
}

func (j *Jams) Encode(enc rpc.Encoder) error {
	return enc.Encode(j.Export())
}

func (j *Jams) Decode(dec rpc.Decoder) error {
	var tmp JamsInternal__
	err := dec.Decode(&tmp)
	if err != nil {
		return err
	}
	*j = tmp.Import()
	return nil
}

func (j Jams) Bytes() []byte {
	return nil
}

type Evil uint64
type EvilInternal__ uint64

func (e Evil) Export() *EvilInternal__ {
	tmp := ((uint64)(e))
	return ((*EvilInternal__)(&tmp))
}

func (e EvilInternal__) Import() Evil {
	tmp := (uint64)(e)
	return Evil((func(x *uint64) (ret uint64) {
		if x == nil {
			return ret
		}
		return *x
	})(&tmp))
}

func (e *Evil) Encode(enc rpc.Encoder) error {
	return enc.Encode(e.Export())
}

func (e *Evil) Decode(dec rpc.Decoder) error {
	var tmp EvilInternal__
	err := dec.Decode(&tmp)
	if err != nil {
		return err
	}
	*e = tmp.Import()
	return nil
}

func (e Evil) Bytes() []byte {
	return nil
}

type Amy Joe
type AmyInternal__ JoeInternal__

func (a Amy) Export() *AmyInternal__ {
	tmp := ((Joe)(a))
	return ((*AmyInternal__)(tmp.Export()))
}

func (a AmyInternal__) Import() Amy {
	tmp := (JoeInternal__)(a)
	return Amy((func(x *JoeInternal__) (ret Joe) {
		if x == nil {
			return ret
		}
		return x.Import()
	})(&tmp))
}

func (a *Amy) Encode(enc rpc.Encoder) error {
	return enc.Encode(a.Export())
}

func (a *Amy) Decode(dec rpc.Decoder) error {
	var tmp AmyInternal__
	err := dec.Decode(&tmp)
	if err != nil {
		return err
	}
	*a = tmp.Import()
	return nil
}

func (a Amy) Bytes() []byte {
	return ((Joe)(a)).Bytes()
}

type Yoodle struct {
	Id      string
	Boomba  Boomba
	Boombas []Boomba
	Maybe   *Boomba
	Amy     Amy
	Evil    Evil
	Baz     []string
	Bop     *uint64
}

type YoodleInternal__ struct {
	_struct     struct{} `codec:",toarray"` //lint:ignore U1000 msgpack internal field
	Id          *string
	Boomba      *BoombaInternal__
	Boombas     *[](*BoombaInternal__)
	Deprecated3 *struct{}
	Maybe       *BoombaInternal__
	Amy         *AmyInternal__
	Evil        *EvilInternal__
	Baz         *[](string)
	Deprecated8 *struct{}
	Bop         *uint64
}

func (y YoodleInternal__) Import() Yoodle {
	return Yoodle{
		Id: (func(x *string) (ret string) {
			if x == nil {
				return ret
			}
			return *x
		})(y.Id),
		Boomba: (func(x *BoombaInternal__) (ret Boomba) {
			if x == nil {
				return ret
			}
			return x.Import()
		})(y.Boomba),
		Boombas: (func(x *[](*BoombaInternal__)) (ret []Boomba) {
			if x == nil || len(*x) == 0 {
				return nil
			}
			ret = make([]Boomba, len(*x))
			for k, v := range *x {
				if v == nil {
					continue
				}
				ret[k] = (func(x *BoombaInternal__) (ret Boomba) {
					if x == nil {
						return ret
					}
					return x.Import()
				})(v)
			}
			return ret
		})(y.Boombas),
		Maybe: (func(x *BoombaInternal__) *Boomba {
			if x == nil {
				return nil
			}
			tmp := (func(x *BoombaInternal__) (ret Boomba) {
				if x == nil {
					return ret
				}
				return x.Import()
			})(x)
			return &tmp
		})(y.Maybe),
		Amy: (func(x *AmyInternal__) (ret Amy) {
			if x == nil {
				return ret
			}
			return x.Import()
		})(y.Amy),
		Evil: (func(x *EvilInternal__) (ret Evil) {
			if x == nil {
				return ret
			}
			return x.Import()
		})(y.Evil),
		Baz: (func(x *[](string)) (ret []string) {
			if x == nil || len(*x) == 0 {
				return nil
			}
			ret = make([]string, len(*x))
			for k, v := range *x {
				ret[k] = (func(x *string) (ret string) {
					if x == nil {
						return ret
					}
					return *x
				})(&v)
			}
			return ret
		})(y.Baz),
		Bop: (func(x *uint64) *uint64 {
			if x == nil {
				return nil
			}
			tmp := (func(x *uint64) (ret uint64) {
				if x == nil {
					return ret
				}
				return *x
			})(x)
			return &tmp
		})(y.Bop),
	}
}

func (y Yoodle) Export() *YoodleInternal__ {
	return &YoodleInternal__{
		Id:     &y.Id,
		Boomba: y.Boomba.Export(),
		Boombas: (func(x []Boomba) *[](*BoombaInternal__) {
			if len(x) == 0 {
				return nil
			}
			ret := make([](*BoombaInternal__), len(x))
			for k, v := range x {
				ret[k] = v.Export()
			}
			return &ret
		})(y.Boombas),
		Maybe: (func(x *Boomba) *BoombaInternal__ {
			if x == nil {
				return nil
			}
			return (*x).Export()
		})(y.Maybe),
		Amy:  y.Amy.Export(),
		Evil: y.Evil.Export(),
		Baz: (func(x []string) *[](string) {
			if len(x) == 0 {
				return nil
			}
			ret := make([](string), len(x))
			for k, v := range x {
				ret[k] = v
			}
			return &ret
		})(y.Baz),
		Bop: y.Bop,
	}
}

func (y *Yoodle) Encode(enc rpc.Encoder) error {
	return enc.Encode(y.Export())
}

func (y *Yoodle) Decode(dec rpc.Decoder) error {
	var tmp YoodleInternal__
	err := dec.Decode(&tmp)
	if err != nil {
		return err
	}
	*y = tmp.Import()
	return nil
}

func (y *Yoodle) Bytes() []byte { return nil }

type Boomba struct {
	Id        uint64
	O         *string
	Oliver    []Bilzzle
	Auggie    [][43]byte
	Bambizzle *[][]byte
	Yoyo      string
	Bobo      [400]byte
	Noob      *Evil
}

type BoombaInternal__ struct {
	_struct      struct{} `codec:",toarray"` //lint:ignore U1000 msgpack internal field
	Id           *uint64
	O            *string
	Deprecated2  *struct{}
	Deprecated3  *struct{}
	Oliver       *[](*BilzzleInternal__)
	Deprecated5  *struct{}
	Auggie       *[]([43]byte)
	Bambizzle    *[]([]byte)
	Yoyo         *string
	Bobo         *[400]byte
	Deprecated10 *struct{}
	Deprecated11 *struct{}
	Deprecated12 *struct{}
	Noob         *EvilInternal__
}

func (b BoombaInternal__) Import() Boomba {
	return Boomba{
		Id: (func(x *uint64) (ret uint64) {
			if x == nil {
				return ret
			}
			return *x
		})(b.Id),
		O: (func(x *string) *string {
			if x == nil {
				return nil
			}
			tmp := (func(x *string) (ret string) {
				if x == nil {
					return ret
				}
				return *x
			})(x)
			return &tmp
		})(b.O),
		Oliver: (func(x *[](*BilzzleInternal__)) (ret []Bilzzle) {
			if x == nil || len(*x) == 0 {
				return nil
			}
			ret = make([]Bilzzle, len(*x))
			for k, v := range *x {
				if v == nil {
					continue
				}
				ret[k] = (func(x *BilzzleInternal__) (ret Bilzzle) {
					if x == nil {
						return ret
					}
					return x.Import()
				})(v)
			}
			return ret
		})(b.Oliver),
		Auggie: (func(x *[]([43]byte)) (ret [][43]byte) {
			if x == nil || len(*x) == 0 {
				return nil
			}
			ret = make([][43]byte, len(*x))
			for k, v := range *x {
				ret[k] = (func(x *[43]byte) (ret [43]byte) {
					if x == nil {
						return ret
					}
					return *x
				})(&v)
			}
			return ret
		})(b.Auggie),
		Bambizzle: (func(x *[]([]byte)) *[][]byte {
			if x == nil {
				return nil
			}
			tmp := (func(x *[]([]byte)) (ret [][]byte) {
				if x == nil || len(*x) == 0 {
					return nil
				}
				ret = make([][]byte, len(*x))
				for k, v := range *x {
					ret[k] = (func(x *[]byte) (ret []byte) {
						if x == nil {
							return ret
						}
						return *x
					})(&v)
				}
				return ret
			})(x)
			return &tmp
		})(b.Bambizzle),
		Yoyo: (func(x *string) (ret string) {
			if x == nil {
				return ret
			}
			return *x
		})(b.Yoyo),
		Bobo: (func(x *[400]byte) (ret [400]byte) {
			if x == nil {
				return ret
			}
			return *x
		})(b.Bobo),
		Noob: (func(x *EvilInternal__) *Evil {
			if x == nil {
				return nil
			}
			tmp := (func(x *EvilInternal__) (ret Evil) {
				if x == nil {
					return ret
				}
				return x.Import()
			})(x)
			return &tmp
		})(b.Noob),
	}
}

func (b Boomba) Export() *BoombaInternal__ {
	return &BoombaInternal__{
		Id: &b.Id,
		O:  b.O,
		Oliver: (func(x []Bilzzle) *[](*BilzzleInternal__) {
			if len(x) == 0 {
				return nil
			}
			ret := make([](*BilzzleInternal__), len(x))
			for k, v := range x {
				ret[k] = v.Export()
			}
			return &ret
		})(b.Oliver),
		Auggie: (func(x [][43]byte) *[]([43]byte) {
			if len(x) == 0 {
				return nil
			}
			ret := make([]([43]byte), len(x))
			for k, v := range x {
				ret[k] = v
			}
			return &ret
		})(b.Auggie),
		Bambizzle: (func(x *[][]byte) *[]([]byte) {
			if x == nil {
				return nil
			}
			return (func(x [][]byte) *[]([]byte) {
				if len(x) == 0 {
					return nil
				}
				ret := make([]([]byte), len(x))
				for k, v := range x {
					ret[k] = v
				}
				return &ret
			})((*x))
		})(b.Bambizzle),
		Yoyo: &b.Yoyo,
		Bobo: &b.Bobo,
		Noob: (func(x *Evil) *EvilInternal__ {
			if x == nil {
				return nil
			}
			return (*x).Export()
		})(b.Noob),
	}
}

func (b *Boomba) Encode(enc rpc.Encoder) error {
	return enc.Encode(b.Export())
}

func (b *Boomba) Decode(dec rpc.Decoder) error {
	var tmp BoombaInternal__
	err := dec.Decode(&tmp)
	if err != nil {
		return err
	}
	*b = tmp.Import()
	return nil
}

func (b *Boomba) Bytes() []byte { return nil }

// Zookies are a type of Azuki dog.
type Zookie int

const (
	Zookie_OK      Zookie = 1
	Zookie_BAD     Zookie = 2
	Zookie_VeryBad Zookie = 100
)

var ZookieMap = map[string]Zookie{
	"OK":      1,
	"BAD":     2,
	"VeryBad": 100,
}

var ZookieRevMap = map[Zookie]string{
	1:   "OK",
	2:   "BAD",
	100: "VeryBad",
}

type ZookieInternal__ Zookie

func (z ZookieInternal__) Import() Zookie {
	return Zookie(z)
}

func (z Zookie) Export() *ZookieInternal__ {
	return ((*ZookieInternal__)(&z))
}

type BlipType int

const (
	BlipType_NON_BINARY BlipType = 0
	BlipType_DUDE       BlipType = 1
	BlipType_GIRL       BlipType = 2
)

var BlipTypeMap = map[string]BlipType{
	"NON_BINARY": 0,
	"DUDE":       1,
	"GIRL":       2,
}

var BlipTypeRevMap = map[BlipType]string{
	0: "NON_BINARY",
	1: "DUDE",
	2: "GIRL",
}

type BlipTypeInternal__ BlipType

func (b BlipTypeInternal__) Import() BlipType {
	return BlipType(b)
}

func (b BlipType) Export() *BlipTypeInternal__ {
	return ((*BlipTypeInternal__)(&b))
}

type Blippi struct {
	Bt    BlipType
	F_0__ *Joe `json:"f0,omitempty"`
	F_1__ *Amy `json:"f1,omitempty"`
}

type BlippiInternal__ struct {
	_struct  struct{} `codec:",toarray"` //lint:ignore U1000 msgpack internal field
	Bt       BlipType
	Switch__ BlippiInternalSwitch__
}

type BlippiInternalSwitch__ struct {
	_struct struct{}       `codec:",omitempty"`
	F_0__   *JoeInternal__ `codec:"0"`
	F_1__   *AmyInternal__ `codec:"1"`
}

func (b Blippi) GetBt() (ret BlipType, err error) {
	switch b.Bt {
	case BlipType_DUDE:
		if b.F_0__ == nil {
			return ret, errors.New("unexpected nil case for F_0__")
		}
	case BlipType_GIRL:
		if b.F_1__ == nil {
			return ret, errors.New("unexpected nil case for F_1__")
		}
	default:
		break
	}
	return b.Bt, nil
}

func (b Blippi) Dude() Joe {
	if b.F_0__ == nil {
		panic("unexepected nil case; should have been checked")
	}
	if b.Bt != BlipType_DUDE {
		panic(fmt.Sprintf("unexpected switch value (%v) when Dude is called", b.Bt))
	}
	return *b.F_0__
}

func (b Blippi) Girl() Amy {
	if b.F_1__ == nil {
		panic("unexepected nil case; should have been checked")
	}
	if b.Bt != BlipType_GIRL {
		panic(fmt.Sprintf("unexpected switch value (%v) when Girl is called", b.Bt))
	}
	return *b.F_1__
}

func NewBlippiWithDude(v Joe) Blippi {
	return Blippi{
		Bt:    BlipType_DUDE,
		F_0__: &v,
	}
}

func NewBlippiWithGirl(v Amy) Blippi {
	return Blippi{
		Bt:    BlipType_GIRL,
		F_1__: &v,
	}
}

func NewBlippiDefault(s BlipType) Blippi {
	return Blippi{
		Bt: s,
	}
}

func (b BlippiInternal__) Import() Blippi {
	return Blippi{
		Bt: b.Bt,
		F_0__: (func(x *JoeInternal__) *Joe {
			if x == nil {
				return nil
			}
			tmp := (func(x *JoeInternal__) (ret Joe) {
				if x == nil {
					return ret
				}
				return x.Import()
			})(x)
			return &tmp
		})(b.Switch__.F_0__),
		F_1__: (func(x *AmyInternal__) *Amy {
			if x == nil {
				return nil
			}
			tmp := (func(x *AmyInternal__) (ret Amy) {
				if x == nil {
					return ret
				}
				return x.Import()
			})(x)
			return &tmp
		})(b.Switch__.F_1__),
	}
}

func (b Blippi) Export() *BlippiInternal__ {
	return &BlippiInternal__{
		Bt: b.Bt,
		Switch__: BlippiInternalSwitch__{
			F_0__: (func(x *Joe) *JoeInternal__ {
				if x == nil {
					return nil
				}
				return (*x).Export()
			})(b.F_0__),
			F_1__: (func(x *Amy) *AmyInternal__ {
				if x == nil {
					return nil
				}
				return (*x).Export()
			})(b.F_1__),
		},
	}
}

func (b *Blippi) Encode(enc rpc.Encoder) error {
	return enc.Encode(b.Export())
}

func (b *Blippi) Decode(dec rpc.Decoder) error {
	var tmp BlippiInternal__
	err := dec.Decode(&tmp)
	if err != nil {
		return err
	}
	*b = tmp.Import()
	return nil
}

var BlippiTypeUniqueID = rpc.TypeUniqueID(0xb1f62d29b2083855)

func (b *Blippi) GetTypeUniqueID() rpc.TypeUniqueID {
	return BlippiTypeUniqueID
}

func (b *Blippi) Bytes() []byte { return nil }

type StatusCode int

const (
	StatusCode_OK     StatusCode = 0
	StatusCode_EIO    StatusCode = 100
	StatusCode_EAGAIN StatusCode = 101
	StatusCode_EPERM  StatusCode = 200
	StatusCode_EINVAL StatusCode = 201
)

var StatusCodeMap = map[string]StatusCode{
	"OK":     0,
	"EIO":    100,
	"EAGAIN": 101,
	"EPERM":  200,
	"EINVAL": 201,
}

var StatusCodeRevMap = map[StatusCode]string{
	0:   "OK",
	100: "EIO",
	101: "EAGAIN",
	200: "EPERM",
	201: "EINVAL",
}

type StatusCodeInternal__ StatusCode

func (s StatusCodeInternal__) Import() StatusCode {
	return StatusCode(s)
}

func (s StatusCode) Export() *StatusCodeInternal__ {
	return ((*StatusCodeInternal__)(&s))
}

type Status struct {
	Sc     StatusCode
	F_0__  *int64  `json:"f0,omitempty"`
	F_20__ *Boomba `json:"f20,omitempty"`
	F_1__  *string `json:"f1,omitempty"`
}

type StatusInternal__ struct {
	_struct  struct{} `codec:",toarray"` //lint:ignore U1000 msgpack internal field
	Sc       StatusCode
	Switch__ StatusInternalSwitch__
}

type StatusInternalSwitch__ struct {
	_struct struct{}          `codec:",omitempty"`
	F_0__   *int64            `codec:"0"`
	F_20__  *BoombaInternal__ `codec:"k"`
	F_1__   *string           `codec:"1"`
}

func (s Status) GetSc() (ret StatusCode, err error) {
	switch s.Sc {
	case StatusCode_OK:
		break
	case StatusCode_EPERM, StatusCode_EAGAIN, StatusCode_EINVAL:
		if s.F_0__ == nil {
			return ret, errors.New("unexpected nil case for F_0__")
		}
	case StatusCode_EIO:
		if s.F_20__ == nil {
			return ret, errors.New("unexpected nil case for F_20__")
		}
	default:
		if s.F_1__ == nil {
			return ret, errors.New("unexpected nil case for F_1__")
		}
	}
	return s.Sc, nil
}

func (s Status) Eperm() int64 {
	if s.F_0__ == nil {
		panic("unexepected nil case; should have been checked")
	}
	if s.Sc != StatusCode_EPERM {
		panic(fmt.Sprintf("unexpected switch value (%v) when Eperm is called", s.Sc))
	}
	return *s.F_0__
}

func (s Status) Eagain() int64 {
	if s.F_0__ == nil {
		panic("unexepected nil case; should have been checked")
	}
	if s.Sc != StatusCode_EAGAIN {
		panic(fmt.Sprintf("unexpected switch value (%v) when Eagain is called", s.Sc))
	}
	return *s.F_0__
}

func (s Status) Einval() int64 {
	if s.F_0__ == nil {
		panic("unexepected nil case; should have been checked")
	}
	if s.Sc != StatusCode_EINVAL {
		panic(fmt.Sprintf("unexpected switch value (%v) when Einval is called", s.Sc))
	}
	return *s.F_0__
}

func (s Status) Eio() Boomba {
	if s.F_20__ == nil {
		panic("unexepected nil case; should have been checked")
	}
	if s.Sc != StatusCode_EIO {
		panic(fmt.Sprintf("unexpected switch value (%v) when Eio is called", s.Sc))
	}
	return *s.F_20__
}

func (s Status) Default() string {
	if s.F_1__ == nil {
		panic("unexepected nil case; should have been checked")
	}
	return *s.F_1__
}

func NewStatusWithOk() Status {
	return Status{
		Sc: StatusCode_OK,
	}
}

func NewStatusWithEperm(v int64) Status {
	return Status{
		Sc:    StatusCode_EPERM,
		F_0__: &v,
	}
}

func NewStatusWithEagain(v int64) Status {
	return Status{
		Sc:    StatusCode_EAGAIN,
		F_0__: &v,
	}
}

func NewStatusWithEinval(v int64) Status {
	return Status{
		Sc:    StatusCode_EINVAL,
		F_0__: &v,
	}
}

func NewStatusWithEio(v Boomba) Status {
	return Status{
		Sc:     StatusCode_EIO,
		F_20__: &v,
	}
}

func NewStatusDefault(s StatusCode, v string) Status {
	return Status{
		Sc:    s,
		F_1__: &v,
	}
}

func (s StatusInternal__) Import() Status {
	return Status{
		Sc:    s.Sc,
		F_0__: s.Switch__.F_0__,
		F_20__: (func(x *BoombaInternal__) *Boomba {
			if x == nil {
				return nil
			}
			tmp := (func(x *BoombaInternal__) (ret Boomba) {
				if x == nil {
					return ret
				}
				return x.Import()
			})(x)
			return &tmp
		})(s.Switch__.F_20__),
		F_1__: s.Switch__.F_1__,
	}
}

func (s Status) Export() *StatusInternal__ {
	return &StatusInternal__{
		Sc: s.Sc,
		Switch__: StatusInternalSwitch__{
			F_0__: s.F_0__,
			F_20__: (func(x *Boomba) *BoombaInternal__ {
				if x == nil {
					return nil
				}
				return (*x).Export()
			})(s.F_20__),
			F_1__: s.F_1__,
		},
	}
}

func (s *Status) Encode(enc rpc.Encoder) error {
	return enc.Encode(s.Export())
}

func (s *Status) Decode(dec rpc.Decoder) error {
	var tmp StatusInternal__
	err := dec.Decode(&tmp)
	if err != nil {
		return err
	}
	*s = tmp.Import()
	return nil
}

func (s *Status) Bytes() []byte { return nil }

var LoginProtocolID rpc.ProtocolUniqueID = rpc.ProtocolUniqueID(0x9ea8b3b7)

type LoginArg struct {
	Foo Boomba
	Bar uint64
	Bam Blippi
}

type LoginArgInternal__ struct {
	_struct     struct{} `codec:",toarray"` //lint:ignore U1000 msgpack internal field
	Foo         *BoombaInternal__
	Bar         *uint64
	Deprecated2 *struct{}
	Deprecated3 *struct{}
	Deprecated4 *struct{}
	Deprecated5 *struct{}
	Deprecated6 *struct{}
	Deprecated7 *struct{}
	Deprecated8 *struct{}
	Deprecated9 *struct{}
	Bam         *BlippiInternal__
}

func (l LoginArgInternal__) Import() LoginArg {
	return LoginArg{
		Foo: (func(x *BoombaInternal__) (ret Boomba) {
			if x == nil {
				return ret
			}
			return x.Import()
		})(l.Foo),
		Bar: (func(x *uint64) (ret uint64) {
			if x == nil {
				return ret
			}
			return *x
		})(l.Bar),
		Bam: (func(x *BlippiInternal__) (ret Blippi) {
			if x == nil {
				return ret
			}
			return x.Import()
		})(l.Bam),
	}
}

func (l LoginArg) Export() *LoginArgInternal__ {
	return &LoginArgInternal__{
		Foo: l.Foo.Export(),
		Bar: &l.Bar,
		Bam: l.Bam.Export(),
	}
}

func (l *LoginArg) Encode(enc rpc.Encoder) error {
	return enc.Encode(l.Export())
}

func (l *LoginArg) Decode(dec rpc.Decoder) error {
	var tmp LoginArgInternal__
	err := dec.Decode(&tmp)
	if err != nil {
		return err
	}
	*l = tmp.Import()
	return nil
}

func (l *LoginArg) Bytes() []byte { return nil }

type LogoutArg struct {
}

type LogoutArgInternal__ struct {
	_struct struct{} `codec:",toarray"` //lint:ignore U1000 msgpack internal field
}

func (l LogoutArgInternal__) Import() LogoutArg {
	return LogoutArg{}
}

func (l LogoutArg) Export() *LogoutArgInternal__ {
	return &LogoutArgInternal__{}
}

func (l *LogoutArg) Encode(enc rpc.Encoder) error {
	return enc.Encode(l.Export())
}

func (l *LogoutArg) Decode(dec rpc.Decoder) error {
	var tmp LogoutArgInternal__
	err := dec.Decode(&tmp)
	if err != nil {
		return err
	}
	*l = tmp.Import()
	return nil
}

func (l *LogoutArg) Bytes() []byte { return nil }

type BampleArg struct {
	I int64
}

type BampleArgInternal__ struct {
	_struct struct{} `codec:",toarray"` //lint:ignore U1000 msgpack internal field
	I       *int64
}

func (b BampleArgInternal__) Import() BampleArg {
	return BampleArg{
		I: (func(x *int64) (ret int64) {
			if x == nil {
				return ret
			}
			return *x
		})(b.I),
	}
}

func (b BampleArg) Export() *BampleArgInternal__ {
	return &BampleArgInternal__{
		I: &b.I,
	}
}

func (b *BampleArg) Encode(enc rpc.Encoder) error {
	return enc.Encode(b.Export())
}

func (b *BampleArg) Decode(dec rpc.Decoder) error {
	var tmp BampleArgInternal__
	err := dec.Decode(&tmp)
	if err != nil {
		return err
	}
	*b = tmp.Import()
	return nil
}

func (b *BampleArg) Bytes() []byte { return nil }

type BoobieArg struct {
	I Boomba
}

type BoobieArgInternal__ struct {
	_struct     struct{} `codec:",toarray"` //lint:ignore U1000 msgpack internal field
	Deprecated0 *struct{}
	Deprecated1 *struct{}
	I           *BoombaInternal__
}

func (b BoobieArgInternal__) Import() BoobieArg {
	return BoobieArg{
		I: (func(x *BoombaInternal__) (ret Boomba) {
			if x == nil {
				return ret
			}
			return x.Import()
		})(b.I),
	}
}

func (b BoobieArg) Export() *BoobieArgInternal__ {
	return &BoobieArgInternal__{
		I: b.I.Export(),
	}
}

func (b *BoobieArg) Encode(enc rpc.Encoder) error {
	return enc.Encode(b.Export())
}

func (b *BoobieArg) Decode(dec rpc.Decoder) error {
	var tmp BoobieArgInternal__
	err := dec.Decode(&tmp)
	if err != nil {
		return err
	}
	*b = tmp.Import()
	return nil
}

func (b *BoobieArg) Bytes() []byte { return nil }

// Login is a protocol that helps us login. That and lots of other
// truly amazing things!
type LoginInterface interface {
	//      Make an anonymous struct used for this RPC. Note that as with regular structs,
	//      we can deprecate certain fields to save bandwidth, but servers need to be able
	//      to handle such cases properly. This might be the case for a disused field
	Login(context.Context, LoginArg) (string, error)
	//      No return type aside from the Status which we have for everything
	Logout(context.Context) error
	//     Simple one-argument style. If there is one argument and that argument is position 0,
	//     then the client stub will take a single argument and won't require allocation
	//     of a argument structure. But on the wire it all looks the same.
	Bample(context.Context, int64) (int64, error)
	//     A wild bird call.
	Boobie(context.Context, BoobieArg) (ShowTime, error)
	ErrorWrapper() func(error) Status
}

func LoginMakeGenericErrorWrapper(f LoginErrorWrapper) rpc.WrapErrorFunc {
	return func(err error) interface{} {
		if err == nil {
			return err
		}
		return f(err).Export()
	}
}

type LoginErrorUnwrapper func(Status) error
type LoginErrorWrapper func(error) Status

type loginErrorUnwrapperAdapter struct {
	h LoginErrorUnwrapper
}

func (l loginErrorUnwrapperAdapter) MakeArg() interface{} {
	return &StatusInternal__{}
}

func (l loginErrorUnwrapperAdapter) UnwrapError(raw interface{}) (appError error, dispatchError error) {
	s, ok := raw.(*StatusInternal__)
	if !ok {
		return nil, errors.New("Error converting to internal type in UnwrapError")
	}
	if s == nil {
		return nil, nil
	}
	return l.h(s.Import()), nil
}

var _ rpc.ErrorUnwrapper = loginErrorUnwrapperAdapter{}

type LoginClient struct {
	Cli            rpc.GenericClient
	ErrorUnwrapper LoginErrorUnwrapper
}

func (c LoginClient) Login(ctx context.Context, arg LoginArg) (res string, err error) {
	warg := arg.Export()
	var tmp string
	err = c.Cli.Call2(ctx, rpc.NewMethodV2(LoginProtocolID, 0, "login.login"), warg, &tmp, 0*time.Millisecond, loginErrorUnwrapperAdapter{h: c.ErrorUnwrapper})
	if err != nil {
		return
	}
	res = tmp
	return
}

func (c LoginClient) Logout(ctx context.Context) (err error) {
	var arg LogoutArg
	warg := arg.Export()
	err = c.Cli.Call2(ctx, rpc.NewMethodV2(LoginProtocolID, 1, "login.logout"), warg, nil, 0*time.Millisecond, loginErrorUnwrapperAdapter{h: c.ErrorUnwrapper})
	if err != nil {
		return
	}
	return
}

func (c LoginClient) Bample(ctx context.Context, i int64) (res int64, err error) {
	arg := BampleArg{
		I: i,
	}
	warg := arg.Export()
	var tmp int64
	err = c.Cli.Call2(ctx, rpc.NewMethodV2(LoginProtocolID, 2, "login.bample"), warg, &tmp, 0*time.Millisecond, loginErrorUnwrapperAdapter{h: c.ErrorUnwrapper})
	if err != nil {
		return
	}
	res = tmp
	return
}

func (c LoginClient) Boobie(ctx context.Context, arg BoobieArg) (res ShowTime, err error) {
	warg := arg.Export()
	var tmp ShowTimeInternal__
	err = c.Cli.Call2(ctx, rpc.NewMethodV2(LoginProtocolID, 3, "login.boobie"), warg, &tmp, 0*time.Millisecond, loginErrorUnwrapperAdapter{h: c.ErrorUnwrapper})
	if err != nil {
		return
	}
	res = tmp.Import()
	return
}

func LoginProtocol(i LoginInterface) rpc.ProtocolV2 {
	return rpc.ProtocolV2{
		Name: "login",
		Id:   LoginProtocolID,
		Methods: map[rpc.Position]rpc.ServeHandlerDescriptionV2{
			0: {
				ServeHandlerDescription: rpc.ServeHandlerDescription{
					MakeArg: func() interface{} {
						var ret LoginArgInternal__
						return &ret
					},
					Handler: func(ctx context.Context, args interface{}) (interface{}, error) {
						typedArg, ok := args.(*LoginArgInternal__)
						if !ok {
							err := rpc.NewTypeError((*LoginArgInternal__)(nil), args)
							return nil, err
						}
						tmp, err := i.Login(ctx, (typedArg.Import()))
						if err != nil {
							return nil, err
						}
						return tmp, nil
					},
				},
				Name: "login",
			},
			1: {
				ServeHandlerDescription: rpc.ServeHandlerDescription{
					MakeArg: func() interface{} {
						var ret LogoutArgInternal__
						return &ret
					},
					Handler: func(ctx context.Context, args interface{}) (interface{}, error) {
						_, ok := args.(*LogoutArgInternal__)
						if !ok {
							err := rpc.NewTypeError((*LogoutArgInternal__)(nil), args)
							return nil, err
						}
						err := i.Logout(ctx)
						if err != nil {
							return nil, err
						}
						return nil, nil
					},
				},
				Name: "logout",
			},
			2: {
				ServeHandlerDescription: rpc.ServeHandlerDescription{
					MakeArg: func() interface{} {
						var ret BampleArgInternal__
						return &ret
					},
					Handler: func(ctx context.Context, args interface{}) (interface{}, error) {
						typedArg, ok := args.(*BampleArgInternal__)
						if !ok {
							err := rpc.NewTypeError((*BampleArgInternal__)(nil), args)
							return nil, err
						}
						tmp, err := i.Bample(ctx, (typedArg.Import()).I)
						if err != nil {
							return nil, err
						}
						return tmp, nil
					},
				},
				Name: "bample",
			},
			3: {
				ServeHandlerDescription: rpc.ServeHandlerDescription{
					MakeArg: func() interface{} {
						var ret BoobieArgInternal__
						return &ret
					},
					Handler: func(ctx context.Context, args interface{}) (interface{}, error) {
						typedArg, ok := args.(*BoobieArgInternal__)
						if !ok {
							err := rpc.NewTypeError((*BoobieArgInternal__)(nil), args)
							return nil, err
						}
						tmp, err := i.Boobie(ctx, (typedArg.Import()))
						if err != nil {
							return nil, err
						}
						return tmp.Export(), nil
					},
				},
				Name: "boobie",
			},
		},
		WrapError: LoginMakeGenericErrorWrapper(i.ErrorWrapper()),
	}
}

type ShowTime struct {
	B     bool
	F_1__ *int64  `json:"f1,omitempty"`
	F_0__ *string `json:"f0,omitempty"`
}

type ShowTimeInternal__ struct {
	_struct  struct{} `codec:",toarray"` //lint:ignore U1000 msgpack internal field
	B        bool
	Switch__ ShowTimeInternalSwitch__
}

type ShowTimeInternalSwitch__ struct {
	_struct struct{} `codec:",omitempty"`
	F_1__   *int64   `codec:"1"`
	F_0__   *string  `codec:"0"`
}

func (s ShowTime) GetB() (ret bool, err error) {
	switch s.B {
	case true:
		if s.F_1__ == nil {
			return ret, errors.New("unexpected nil case for F_1__")
		}
	case false:
		if s.F_0__ == nil {
			return ret, errors.New("unexpected nil case for F_0__")
		}
	}
	return s.B, nil
}

func (s ShowTime) True() int64 {
	if s.F_1__ == nil {
		panic("unexepected nil case; should have been checked")
	}
	if s.B != true {
		panic(fmt.Sprintf("unexpected switch value (%v) when True is called", s.B))
	}
	return *s.F_1__
}

func (s ShowTime) False() string {
	if s.F_0__ == nil {
		panic("unexepected nil case; should have been checked")
	}
	if s.B != false {
		panic(fmt.Sprintf("unexpected switch value (%v) when False is called", s.B))
	}
	return *s.F_0__
}

func NewShowTimeWithTrue(v int64) ShowTime {
	return ShowTime{
		B:     true,
		F_1__: &v,
	}
}

func NewShowTimeWithFalse(v string) ShowTime {
	return ShowTime{
		B:     false,
		F_0__: &v,
	}
}

func (s ShowTimeInternal__) Import() ShowTime {
	return ShowTime{
		B:     s.B,
		F_1__: s.Switch__.F_1__,
		F_0__: s.Switch__.F_0__,
	}
}

func (s ShowTime) Export() *ShowTimeInternal__ {
	return &ShowTimeInternal__{
		B: s.B,
		Switch__: ShowTimeInternalSwitch__{
			F_1__: s.F_1__,
			F_0__: s.F_0__,
		},
	}
}

func (s *ShowTime) Encode(enc rpc.Encoder) error {
	return enc.Encode(s.Export())
}

func (s *ShowTime) Decode(dec rpc.Decoder) error {
	var tmp ShowTimeInternal__
	err := dec.Decode(&tmp)
	if err != nil {
		return err
	}
	*s = tmp.Import()
	return nil
}

func (s *ShowTime) Bytes() []byte { return nil }

type Circus struct {
	I         int
	F_1__     *uint64 `json:"f1,omitempty"`
	F_2__     *bool   `json:"f2,omitempty"`
	F_69999__ *string `json:"f69999,omitempty"`
	F_30__    *int64  `json:"f30,omitempty"`
}

type CircusInternal__ struct {
	_struct  struct{} `codec:",toarray"` //lint:ignore U1000 msgpack internal field
	I        int
	Switch__ CircusInternalSwitch__
}

type CircusInternalSwitch__ struct {
	_struct   struct{} `codec:",omitempty"`
	F_1__     *uint64  `codec:"1"`
	F_2__     *bool    `codec:"2"`
	F_69999__ *string  `codec:"h5L"`
	F_30__    *int64   `codec:"u"`
}

func (c Circus) GetI() (ret int, err error) {
	switch c.I {
	case 10:
		if c.F_1__ == nil {
			return ret, errors.New("unexpected nil case for F_1__")
		}
	case 200:
		if c.F_2__ == nil {
			return ret, errors.New("unexpected nil case for F_2__")
		}
	case 2000:
		if c.F_69999__ == nil {
			return ret, errors.New("unexpected nil case for F_69999__")
		}
	case -1:
		if c.F_30__ == nil {
			return ret, errors.New("unexpected nil case for F_30__")
		}
	default:
		break
	}
	return c.I, nil
}

func (c Circus) P10() uint64 {
	if c.F_1__ == nil {
		panic("unexepected nil case; should have been checked")
	}
	if c.I != 10 {
		panic(fmt.Sprintf("unexpected switch value (%v) when P10 is called", c.I))
	}
	return *c.F_1__
}

func (c Circus) P200() bool {
	if c.F_2__ == nil {
		panic("unexepected nil case; should have been checked")
	}
	if c.I != 200 {
		panic(fmt.Sprintf("unexpected switch value (%v) when P200 is called", c.I))
	}
	return *c.F_2__
}

func (c Circus) P2000() string {
	if c.F_69999__ == nil {
		panic("unexepected nil case; should have been checked")
	}
	if c.I != 2000 {
		panic(fmt.Sprintf("unexpected switch value (%v) when P2000 is called", c.I))
	}
	return *c.F_69999__
}

func (c Circus) N1() int64 {
	if c.F_30__ == nil {
		panic("unexepected nil case; should have been checked")
	}
	if c.I != -1 {
		panic(fmt.Sprintf("unexpected switch value (%v) when N1 is called", c.I))
	}
	return *c.F_30__
}

func NewCircusWithP10(v uint64) Circus {
	return Circus{
		I:     10,
		F_1__: &v,
	}
}

func NewCircusWithP200(v bool) Circus {
	return Circus{
		I:     200,
		F_2__: &v,
	}
}

func NewCircusWithP2000(v string) Circus {
	return Circus{
		I:         2000,
		F_69999__: &v,
	}
}

func NewCircusWithN1(v int64) Circus {
	return Circus{
		I:      -1,
		F_30__: &v,
	}
}

func NewCircusDefault(s int) Circus {
	return Circus{
		I: s,
	}
}

func (c CircusInternal__) Import() Circus {
	return Circus{
		I:         c.I,
		F_1__:     c.Switch__.F_1__,
		F_2__:     c.Switch__.F_2__,
		F_69999__: c.Switch__.F_69999__,
		F_30__:    c.Switch__.F_30__,
	}
}

func (c Circus) Export() *CircusInternal__ {
	return &CircusInternal__{
		I: c.I,
		Switch__: CircusInternalSwitch__{
			F_1__:     c.F_1__,
			F_2__:     c.F_2__,
			F_69999__: c.F_69999__,
			F_30__:    c.F_30__,
		},
	}
}

func (c *Circus) Encode(enc rpc.Encoder) error {
	return enc.Encode(c.Export())
}

func (c *Circus) Decode(dec rpc.Decoder) error {
	var tmp CircusInternal__
	err := dec.Decode(&tmp)
	if err != nil {
		return err
	}
	*c = tmp.Import()
	return nil
}

func (c *Circus) Bytes() []byte { return nil }

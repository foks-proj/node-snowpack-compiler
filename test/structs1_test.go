package test

import (
	"encoding/base64"
	"testing"

	"github.com/keybase/go-codec/codec"
	"github.com/stretchr/testify/assert"
	"ne43.pub/go-snowpack-rpc/rpc"
)

type Codecable interface {
	Encode(rpc.Encoder) error
	Decode(rpc.Decoder) error
}

func roundTrip[T Codecable](t *testing.T, input T, output T) string {
	var mh codec.MsgpackHandle
	mh.WriteExt = true
	var b []byte
	enc := codec.NewEncoderBytes(&b, &mh)
	err := input.Encode(enc)
	assert.NoError(t, err)
	encoding := base64.StdEncoding.EncodeToString(b)
	dec := codec.NewDecoderBytes(b, &mh)
	err = output.Decode(dec)
	assert.NoError(t, err)
	return encoding
}

func TestApple(t *testing.T) {

	bb := "bb"
	a := Apple{
		Id:     "aa",
		Opt:    &bb,
		Lst:    []string{"cc", "dd"},
		LstOpt: &[]string{"ee", "ff"},
		I:      -10,
		U:      20,
		Skip:   true,
	}
	var a2 Apple

	encoding := roundTrip(t, &a, &a2)
	assert.Equal(t, "m6JhYaJiYpKiY2OiZGSSomVlomZm9hTAwMPAoA==", encoding)

	assert.Equal(t, "", a2.TextEmpty)
	assert.Equal(t, uint64(20), a2.U)
	assert.Equal(t, int64(-10), a2.I)
	assert.NotNil(t, a2.LstOpt)
	assert.Equal(t, "ff", (*a2.LstOpt)[1])
	assert.Equal(t, a, a2)
	assert.Equal(t, AppleTypeUniqueID, rpc.TypeUniqueID(0x9ed0d8bf5dd9cb36))
	assert.Equal(t, AppleTypeUniqueID, a.GetTypeUniqueID())
}

func TestBlobl(t *testing.T) {
	b := Blobs{
		B:   []byte{10, 11, 12},
		Ob:  &[]byte{100, 101, 102},
		Obf: &[3]byte{20, 21, 22},
	}
	b.Bf[1] = 50
	var b2 Blobs
	encoding := roundTrip(t, &b, &b2)
	assert.Equal(t, "lcQDCgsMxAMAMgDEA2RlZsQDFBUWwA==", encoding)
	assert.Equal(t, b, b2)
}

func TestFruits(t *testing.T) {
	b := Blobs{}
	b.Bf[1] = 16
	f := NewFruitWithBanana(b)
	var f2 Fruit
	encoding := roundTrip(t, &f, &f2)
	assert.Equal(t, "kgKBozdhepXAxAMAEADAwMA=", encoding)
	assert.Equal(t, f, f2)

	// Test the accessor pattern
	typ, err := f2.GetFt()
	assert.NoError(t, err)
	assert.Equal(t, typ, FruitType_BANANA)
	b2 := f2.Banana()
	assert.Equal(t, b, b2)
}

func TestBundle(t *testing.T) {
	b := Bundle{
		Source: "Keyna",
	}
	b.Fruits = append(b.Fruits,
		NewFruitWithApple(Apple{
			Id:   "Granny Smith",
			I:    100,
			U:    1000,
			Skip: true,
		}),
		NewFruitWithBanana(Blobs{
			Be: []byte{'a', 'b', 'c'},
		}),
		NewFruitDefault(FruitType_ORANGE, "naval"),
	)

	var b2 Bundle
	encoding := roundTrip(t, &b, &b2)
	assert.Equal(t, "kpOSAIGhMJusR3Jhbm55IFNtaXRowMDAZM0D6MDAw8CgkgKBozdhepXAxAMAAADAwMQDYWJjkgGBoTGlbmF2YWylS2V5bmE=", encoding)
	assert.Equal(t, b, b2)
	typ, err := b2.Fruits[0].GetFt()
	assert.NoError(t, err)
	assert.Equal(t, FruitType_APPLE, typ)
	apple := b2.Fruits[0].Apple()
	assert.Equal(t, "", apple.TextEmpty)
	assert.Equal(t, uint64(1000), apple.U)
}

func TestBadVariant(t *testing.T) {
	f1 := NewFruitWithApple(Apple{})
	f0 := NewFruitWithBanana(Blobs{})
	f1.F_0__ = nil
	f1.F_29347__ = f0.F_29347__
	var f2 Fruit
	roundTrip(t, &f1, &f2)
	assert.Equal(t, f1, f2)
	_, err := f2.GetFt()
	assert.Error(t, err)
	assert.Equal(t, "unexpected nil case for F_0__", err.Error())
}

func encodeToBytes[T Codecable](t T) ([]byte, error) {
	var mh codec.MsgpackHandle
	mh.WriteExt = true
	var b []byte
	enc := codec.NewEncoderBytes(&b, &mh)
	err := t.Encode(enc)
	return b, err
}

func decodeFromBytes[T Codecable](t T, b []byte) error {
	var mh codec.MsgpackHandle
	mh.WriteExt = true
	dec := codec.NewDecoderBytes(b, &mh)
	err := t.Decode(dec)
	return err
}

func TestFuture(t *testing.T) {
	// FooV2 is a future version of V1. Let's check that we can decode a V2 into a V1,
	// which just essentially ignoring thhew new fields.
	v2 := FooV2{
		I1: 100,
		S3: "three",
		I4: 400,
		S5: "five",
	}
	b, err := encodeToBytes(&v2)
	assert.NoError(t, err)

	var v1 FooV1
	err = decodeFromBytes(&v1, b)
	assert.NoError(t, err)
	assert.Equal(t, FooV1{I0: 0, I1: 100, S2: "", S3: "three"}, v1)

}

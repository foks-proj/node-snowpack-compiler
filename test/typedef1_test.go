package test

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestTypedef1(t *testing.T) {
	var c1 C
	c1[2] = 0x77

	b1, err := encodeToBytes(&c1)
	require.NoError(t, err)
	var c2 C
	err = decodeFromBytes(&c2, b1)
	require.NoError(t, err)
	require.Equal(t, c2, c1)

	raw := c1.Bytes()
	bytesExpected := make([]byte, 33)
	bytesExpected[2] = 0x77
	require.Equal(t, bytesExpected, raw)
}

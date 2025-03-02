package test

import (
	"context"
	"errors"
	"fmt"
	"io"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"ne43.pub/go-snowpack-rpc/rpc"
)

type ErrString string
type ErrInt int64

func (e ErrString) Error() string {
	return fmt.Sprintf("string error: %s", string(e))
}

func (e ErrString) toString() string { return string(e) }

func (i ErrInt) Error() string {
	return fmt.Sprintf("int error: %d", int64(i))
}

func (i ErrInt) toInt() int64 { return int64(i) }

func errorToStatus(e error) Status {
	if e == nil {
		return NewStatusWithOk()
	}
	switch te := e.(type) {
	case ErrString:
		return NewStatusWithEstring(te.toString())
	case ErrInt:
		return NewStatusWithEint(te.toInt())
	case rpc.ProtocolV2NotFoundError:
		return NewStatusWithEprotonotfound(uint64(te.U))
	case rpc.MethodV2NotFoundError:
		return NewStatusWithEmethodnotfound(MethodV2{
			Proto:  uint64(te.ProtID),
			Method: uint64(te.Method),
			Name:   te.ProtName,
		})
	default:
		return NewStatusWithEgeneric(te.Error())
	}
}

func errorUnwrapper(status Status) error {
	sc, err := status.GetSc()
	if err != nil {
		return err
	}
	switch sc {
	case StatusCode_OK:
		return nil
	case StatusCode_EINT:
		return ErrInt(status.Eint())
	case StatusCode_ESTRING:
		return ErrString(status.Estring())
	case StatusCode_EGENERIC:
		return errors.New(status.Egeneric())
	case StatusCode_EPROTONOTFOUND:
		return rpc.NewProtocolV2NotFoundError(rpc.ProtocolUniqueID(status.Eprotonotfound()))
	case StatusCode_EMETHODNOTFOUND:
		m := status.Emethodnotfound()
		return rpc.NewMethodV2NotFoundError(rpc.ProtocolUniqueID(m.Proto), rpc.Position(m.Method), m.Name)
	default:
		return fmt.Errorf("generic error %d", int(sc))
	}
}

type PingServer struct {
}

func (p PingServer) PingUint(ctx context.Context, u uint64) (ret uint64, err error) {
	return u + 10, nil
}

func (p PingServer) PingText(ctx context.Context, s string) (ret string, err error) {
	return s + "_yo", nil
}

func (p PingServer) PingSmoosh(ctx context.Context, arg PingSmooshArg) (ret Smoosh, err error) {
	return Smoosh{
		I: arg.I + 3,
		T: fmt.Sprintf("%s%d", arg.T, arg.I),
	}, nil
}

func (p PingServer) PingPuke(ctx context.Context, arg PingPukeArg) (err error) {
	if arg.I != nil {
		return ErrInt(*arg.I)
	}
	if arg.T != nil {
		return ErrString(*arg.T)
	}
	return errors.New("generic error")
}

func (p PingServer) BlobTorture(ctx context.Context, arg [][]byte) ([][]byte, error) {
	for i, j := 0, len(arg)-1; i < j; i, j = i+1, j-1 {
		arg[i], arg[j] = arg[j], arg[i]
	}
	return arg, nil
}

func (p PingServer) PingSmooshes(ctx context.Context, arg []Smoosh) ([]Smoosh, error) {
	for i, j := 0, len(arg)-1; i < j; i, j = i+1, j-1 {
		arg[i], arg[j] = arg[j], arg[i]
	}
	return arg, nil
}

func (p PingServer) GetNow(ctx context.Context) (ret UnixTime, err error) {
	return UnixTime(time.Now().UnixMilli()), nil
}

func (p PingServer) ArgRename(ctx context.Context, a MyArg) (string, error) {
	return "", nil
}

func (p PingServer) ErrorWrapper() func(error) Status {
	return errorToStatus
}

func (p PingServer) CheckArgHeader(ctx context.Context, h Header) error {
	if h.Vers != 2 {
		return errors.New("bad version; can only handle v2")
	}
	return nil
}

func (p PingServer) MakeResHeader() Header {
	return Header{
		Vers: 3,
	}
}

var _ PingInterface = &PingServer{}

func TestPing1(t *testing.T) {

	// Turn debugging on for now
	dbgHook := func(s string, args ...interface{}) {}
	lf := rpc.NewSimpleLogFactory(rpc.NilLogOutput{}, nil)

	loopack := rpc.NewLoopbackListener(dbgHook)

	// Fork a listener in the background
	serverExitCh := make(chan struct{})

	maxSz := int32(0x10000)

	wrapErrorFunc := PingMakeGenericErrorWrapper(errorToStatus)

	go (func() {
		conn, err := loopack.Accept()
		require.NoError(t, err)
		xp := rpc.NewTransport(context.Background(), conn, lf, nil, wrapErrorFunc, maxSz)
		srv := rpc.NewServer(xp, wrapErrorFunc)
		var ps PingServer
		srv.RegisterV2(PingProtocol(ps))
		ch := srv.Run()
		<-ch
		err = srv.Err()
		require.Error(t, err)
		require.Equal(t, io.EOF, err)
		close(serverExitCh)
	})()

	ctx := context.Background()
	conn, err := loopack.Dial(ctx)
	require.NoError(t, err)

	xp := rpc.NewTransport(context.Background(), conn, lf, nil, wrapErrorFunc, maxSz)
	gcli := rpc.NewClient(xp, nil, nil)
	cli := PingClient{
		Cli:            gcli,
		ErrorUnwrapper: errorUnwrapper,
		MakeArgHeader: func() Header {
			return Header{
				Vers: 2,
			}
		},
		CheckResHeader: func(ctx context.Context, h Header) error {
			if h.Vers != 3 {
				return errors.New("bad version; can only handle v3")
			}
			return nil
		},
	}

	ret, err := cli.PingUint(context.Background(), 5)
	require.NoError(t, err)
	require.Equal(t, uint64(15), ret)

	s, err := cli.PingText(context.Background(), "blipper")
	require.NoError(t, err)
	require.Equal(t, "blipper_yo", s)

	sm, err := cli.PingSmoosh(context.Background(), PingSmooshArg{I: -10, T: "lucky"})
	require.NoError(t, err)
	require.Equal(t, Smoosh{I: -7, T: "lucky-10"}, sm)

	i := int64(10)
	err = cli.PingPuke(context.Background(), PingPukeArg{I: &i})
	require.Equal(t, ErrInt(i), err)

	s = "bingo"
	err = cli.PingPuke(context.Background(), PingPukeArg{T: &s})
	require.Equal(t, ErrString(s), err)

	err = cli.PingPuke(context.Background(), PingPukeArg{})
	require.Equal(t, errors.New("generic error"), err)

	res, err := cli.BlobTorture(context.Background(), [][]byte{
		[]byte("all"),
		[]byte("dogs"),
		[]byte("have"),
		[]byte("fleas"),
	})
	require.NoError(t, err)
	require.Equal(t, []byte("have"), res[1])
	require.Equal(t, []byte("all"), res[3])

	smooshesRes, err := cli.PingSmooshes(context.Background(), []Smoosh{
		{I: 1, T: "one"},
		{I: 2, T: "two"},
		{I: 3, T: "three"},
	})
	require.NoError(t, err)
	require.Equal(t, []Smoosh{
		{I: 3, T: "three"},
		{I: 2, T: "two"},
		{I: 1, T: "one"},
	}, smooshesRes)

	poogCli := PoogClient{Cli: gcli, ErrorUnwrapper: errorUnwrapper}
	err = poogCli.PoogUint(context.Background())
	require.Equal(t, rpc.NewProtocolV2NotFoundError(PoogProtocolID), err)

	pingV2Cli := PingV2Client{Cli: gcli, ErrorUnwrapper: errorUnwrapper}
	err = pingV2Cli.PingPike(context.Background())
	require.Equal(t, rpc.NewMethodV2NotFoundError(PingProtocolID, 50, "ping"), err)

	cli.MakeArgHeader = func() Header {
		return Header{
			Vers: 1,
		}
	}
	_, err = cli.PingUint(context.Background(), 5)
	require.Error(t, err)
	require.Equal(t, errors.New("bad version; can only handle v2"), err)

	cli.CheckResHeader = func(ctx context.Context, h Header) error {
		if h.Vers != 2 {
			return errors.New("bad version; can only handle v2")
		}
		return nil
	}
	_, err = cli.PingUint(context.Background(), 5)
	require.Error(t, err)
	require.Equal(t, errors.New("bad version; can only handle v2"), err)

	conn.Close()
	<-serverExitCh

}

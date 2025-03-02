import { UnixTime } from './common'
import {
    MethodV2,
    MyArg,
    pingClient,
    pingV2Client,
    pingV2ProtocolID,
    poogProtocolID,
    pingInterface,
    pingProtocol,
    pingPukeArg,
    pingSmooshArg,
    Smoosh,
    Status,
    StatusCode,
    poogClient,
} from './rpc1'

import {
    NetConnOpts,
    Client,
    Handler,
    Server,
    ErrMethodNotFound,
    ErrProtocolNotFound,
    newProtocolUniqueID,
} from 'snowpack'
const suppressLogging = true

class ErrInt extends Error {
    i: bigint
    constructor(i: bigint) {
        super(`ErrInt: ${i}`)
        this.i = i
    }
}

class ErrString extends Error {
    s: string
    constructor(s: string) {
        super(`ErrString: ${s}`)
        this.s = s
    }
}

function errorToStatus(e: Error | null): Status {
    if (e === null) {
        return Status.newWithOK()
    }
    if (e instanceof ErrInt) {
        return Status.newWithEINT(e.i)
    } else if (e instanceof ErrString) {
        return Status.newWithESTRING(e.s)
    } else if (e instanceof ErrMethodNotFound) {
        const ret = Status.newWithEMETHODNOTFOUND(
            new MethodV2(e.protocol.value, BigInt(e.method), 'n/a')
        )
        return ret
    } else if (e instanceof ErrProtocolNotFound) {
        const ret = Status.newWithEPROTONOTFOUND(e.protocol.value)
        return ret
    } else {
        return Status.newWithEGENERIC(e.message)
    }
}

function statusToError(s: Status): Error | null {
    const tag = s.sc
    switch (s.sc.value) {
        case StatusCode.values.OK:
            return null
        case StatusCode.values.EINT:
            return new ErrInt(s.EINT)
        case StatusCode.values.ESTRING:
            return new ErrString(s.ESTRING)
        case StatusCode.values.EPROTONOTFOUND:
            return new ErrProtocolNotFound(
                newProtocolUniqueID(s.EPROTONOTFOUND)
            )
        case StatusCode.values.EMETHODNOTFOUND:
            return new ErrMethodNotFound(
                newProtocolUniqueID(s.EMETHODNOTFOUND.proto),
                Number(s.EMETHODNOTFOUND.method)
            )
        default:
            return new Error(s.EGENERIC)
    }
}

class PingServer extends Handler implements pingInterface {
    async pingUint(arg: bigint): Promise<bigint> {
        return arg + 10n
    }
    async pingText(arg: string): Promise<string> {
        return arg + '_yo'
    }
    async pingSmoosh(arg: pingSmooshArg): Promise<Smoosh> {
        return new Smoosh(arg.i + 3n, `${arg.t}${arg.i}`)
    }
    async pingPuke(arg: pingPukeArg): Promise<void> {
        if (arg.i !== undefined && arg.i !== null) {
            throw new ErrInt(arg.i)
        }
        if (arg.t !== undefined && arg.t !== null) {
            throw new ErrString(arg.t)
        }
        throw new Error('generic')
    }
    async blobTorture(arg: Uint8Array[]): Promise<Uint8Array[]> {
        return arg.reverse()
    }
    async pingSmooshes(arg: Smoosh[]): Promise<Smoosh[]> {
        return arg.reverse()
    }
    async argRename(arg: MyArg): Promise<string> {
        return arg.a.toString(10)
    }
    async getNow(): Promise<UnixTime> {
        return UnixTime.import(Date.now())
    }
    errorWrapper(arg: Error | null): Status {
        return errorToStatus(arg)
    }
}
var port: number | undefined
var srv: Server<PingServer> | undefined

async function gConnect(): Promise<Client> {
    if (!port) {
        throw new Error('expected port to be non-null')
    }
    const nco = new NetConnOpts('localhost', port, {
        nullLog: suppressLogging,
    })
    const gcli = new Client(nco)
    await gcli.connect()
    return gcli
}

async function connect(): Promise<[pingClient, Client]> {
    const gcli = await gConnect()
    const cli = new pingClient(gcli, statusToError)
    return [cli, gcli]
}

describe('rpc1', () => {
    beforeAll(async () => {
        srv = new Server(
            {
                port: 0,
                host: 'localhost',
                path: undefined,
                nullLog: suppressLogging,
            },
            [pingProtocol],
            PingServer
        )
        await srv.listen()
        port = srv.port
    })

    it('should handle simple successful RPC calls', async () => {
        const [cli, gcli] = await connect()

        const res = await cli.pingUint(11n)
        expect(res).toBe(21n)

        const res2 = await cli.pingText('blippy')
        expect(res2).toBe('blippy_yo')

        const res3 = await cli.pingSmoosh(new pingSmooshArg(11n, 'blippy'))
        expect(res3).toEqual(new Smoosh(14n, 'blippy11'))

        const arg4 = 0x1234567890abcdefn
        const res4 = await cli.pingUint(arg4)
        expect(res4).toBe(arg4 + 10n)

        const arg5 = ['all', 'dogs', 'have', 'fleas'].map((s) => Buffer.from(s))
        const res5 = await cli.blobTorture(arg5)
        expect(res5).toEqual(arg5.reverse())

        gcli.close()
    })
    it('should handle RPCs with arrays of objects', async () => {
        const [cli, gcli] = await connect()

        const arg = [
            new Smoosh(1n, 'a'),
            new Smoosh(2n, 'b'),
            new Smoosh(3n, 'c'),
        ]
        const res = await cli.pingSmooshes(arg)
        expect(res).toEqual(arg.reverse())

        gcli.close()
    })
    it('should tell time', async () => {
        const [cli, gcli] = await connect()

        const now = Date.now()
        const res = await cli.getNow()
        const then = Number(res.export())
        expect(Math.abs(now - then)).toBeLessThan(10000)

        gcli.close()
    })

    it('should handle simple unsuccessful RPC calls with error import/export', async () => {
        const [cli, gcli] = await connect()

        try {
            await cli.pingPuke(new pingPukeArg(11n, null))
            throw new Error('expected pingPuke to throw')
        } catch (e) {
            expect(e).toBeInstanceOf(ErrInt)
            const ei = e as ErrInt
            expect(ei.i).toBe(11n)
        }

        try {
            await cli.pingPuke(new pingPukeArg(null, 'bluey'))
            throw new Error('expected pingPuke to throw')
        } catch (e) {
            expect(e).toBeInstanceOf(ErrString)
            const es = e as ErrString
            expect(es.s).toBe('bluey')
        }
        gcli.close()
    })

    it('should handle method not found', async () => {
        const gcli = await gConnect()
        const cli = new pingV2Client(gcli, statusToError)
        try {
            await cli.pingPike()
            throw new Error('expected pingPike to throw')
        } catch (e) {
            expect(e).toBeInstanceOf(ErrMethodNotFound)
            const es = e as ErrMethodNotFound
            expect(es.protocol.value).toBe(pingV2ProtocolID.value)
            expect(es.method).toBe(50)
        } finally {
            gcli.close()
        }
    })

    it('should handle protocol not found', async () => {
        const gcli = await gConnect()
        const cli = new poogClient(gcli, statusToError)
        try {
            await cli.poogUint()
            throw new Error('expected poogUint to throw')
        } catch (e) {
            expect(e).toBeInstanceOf(ErrProtocolNotFound)
            const es = e as ErrProtocolNotFound
            expect(es.protocol.value).toBe(poogProtocolID.value)
        } finally {
            gcli.close()
        }
    })

    afterAll(async () => {
        if (srv) {
            await srv.stop()
        }
    })
})

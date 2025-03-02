// Auto-generated to TypeScript types and interfaces using snowpack-compiler 1.0.0 (https://github.com/maxtaco/node-snowpack-compiler)
//  Input file: rpc1.snowp

import * as rpc from 'snowpack'

import * as common from "./common"
enum StatusCodeValues {
	OK = 0, 
	EINT = 1, 
	ESTRING = 2, 
	EGENERIC = 3, 
	EPROTONOTFOUND = 4, 
	EMETHODNOTFOUND = 5, 
}

const u0 = Symbol()
export class StatusCode implements rpc.Exportable {
	[u0] = true
	value : number
	static values = StatusCodeValues
	static o = {
		OK : new StatusCode(StatusCode.values.OK),
		EINT : new StatusCode(StatusCode.values.EINT),
		ESTRING : new StatusCode(StatusCode.values.ESTRING),
		EGENERIC : new StatusCode(StatusCode.values.EGENERIC),
		EPROTONOTFOUND : new StatusCode(StatusCode.values.EPROTONOTFOUND),
		EMETHODNOTFOUND : new StatusCode(StatusCode.values.EMETHODNOTFOUND),
	}
	constructor(v : number) {
		this.value = v
	}
	valueOf() : number {
		return this.value
	}
	static import(a : any) : StatusCode {
		const v = rpc.importers.enum(a, this.values)
		return new StatusCode(v)
	}
	export() : any {
		return this.value
	}
}

const u1 = Symbol()
export class MethodV2 implements rpc.Exportable{
	proto: bigint
	method: bigint
	name: string
	[u1] = true
	constructor(proto: bigint, method: bigint, name: string) {
		this.proto = proto
		this.method = method
		this.name = name
	}
	export() : any[] {
		return [
			rpc.exporters.uint(this.proto),
			rpc.exporters.uint(this.method),
			this.name
		]
	}
	static import(obj: any[]) : MethodV2 {
		obj = rpc.extend(obj, 3)
		const proto = rpc.importers.uint(obj[0])
		const method = rpc.importers.uint(obj[1])
		const name = rpc.importers.string(obj[2])
		return new MethodV2(
			proto,
			method,
			name
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : MethodV2 {
		return MethodV2.import(dec(a))
	}
}

export class Status implements rpc.Exportable {
	_sc : StatusCode
	F_0__ : bigint | undefined
	F_1__ : string | undefined
	F_2__ : bigint | undefined
	F_3__ : MethodV2 | undefined
	constructor(sc : StatusCode) {
		this._sc = sc
	}
	get sc() : StatusCode {
		switch (this._sc.valueOf()) {
			case StatusCode.values.OK:
				break
			case StatusCode.values.EINT:
				if (this.F_0__ === undefined) {
					throw new rpc.VariantError('unexpected nil case for F_0__')
				}
				break
			case StatusCode.values.ESTRING:
			case StatusCode.values.EGENERIC:
				if (this.F_1__ === undefined) {
					throw new rpc.VariantError('unexpected nil case for F_1__')
				}
				break
			case StatusCode.values.EPROTONOTFOUND:
				if (this.F_2__ === undefined) {
					throw new rpc.VariantError('unexpected nil case for F_2__')
				}
				break
			case StatusCode.values.EMETHODNOTFOUND:
				if (this.F_3__ === undefined) {
					throw new rpc.VariantError('unexpected nil case for F_3__')
				}
				break
		}
		return this._sc
	}
	get EINT() : bigint {
		if (this.F_0__ === undefined) {
			throw new rpc.VariantError("EINT case not set")
		}
		return this.F_0__
	}
	get ESTRING() : string {
		if (this.F_1__ === undefined) {
			throw new rpc.VariantError("ESTRING case not set")
		}
		return this.F_1__
	}
	get EGENERIC() : string {
		if (this.F_1__ === undefined) {
			throw new rpc.VariantError("EGENERIC case not set")
		}
		return this.F_1__
	}
	get EPROTONOTFOUND() : bigint {
		if (this.F_2__ === undefined) {
			throw new rpc.VariantError("EPROTONOTFOUND case not set")
		}
		return this.F_2__
	}
	get EMETHODNOTFOUND() : MethodV2 {
		if (this.F_3__ === undefined) {
			throw new rpc.VariantError("EMETHODNOTFOUND case not set")
		}
		return this.F_3__
	}
	export() : any {
		const tmp : { [k: string]: any }  = {}
		if (!!this.F_0__) { tmp["0"] = rpc.exporters.int(this.F_0__) }
		if (!!this.F_1__) { tmp["1"] = this.F_1__ }
		if (!!this.F_2__) { tmp["2"] = rpc.exporters.uint(this.F_2__) }
		if (!!this.F_3__) { tmp["3"] = this.F_3__.export() }
		return [ this._sc.export(), tmp ]
	}
	static import(obj: any) : Status {
		if (typeof(obj) !== 'object' || !Array.isArray(obj) || obj.length !== 2) {
			throw new rpc.VariantError('invalid variant')
		}
		const [ rawTag, data ] = obj
		const tag = StatusCode.import(rawTag)
		const ret = new Status(tag)
		ret.F_0__ = data["0"] ? rpc.importers.int(data["0"]) : undefined
		ret.F_1__ = data["1"] ? rpc.importers.string(data["1"]) : undefined
		ret.F_2__ = data["2"] ? rpc.importers.uint(data["2"]) : undefined
		ret.F_3__ = data["3"] ? MethodV2.import(data["3"]) : undefined
		return ret
	}
	static newWithOK() : Status {
		const ret = new Status(new StatusCode(StatusCode.values.OK))
		return ret
	}
	static newWithEINT(data: bigint) : Status {
		const ret = new Status(new StatusCode(StatusCode.values.EINT))
		ret.F_0__ = data
		return ret
	}
	static newWithESTRING(data: string) : Status {
		const ret = new Status(new StatusCode(StatusCode.values.ESTRING))
		ret.F_1__ = data
		return ret
	}
	static newWithEGENERIC(data: string) : Status {
		const ret = new Status(new StatusCode(StatusCode.values.EGENERIC))
		ret.F_1__ = data
		return ret
	}
	static newWithEPROTONOTFOUND(data: bigint) : Status {
		const ret = new Status(new StatusCode(StatusCode.values.EPROTONOTFOUND))
		ret.F_2__ = data
		return ret
	}
	static newWithEMETHODNOTFOUND(data: MethodV2) : Status {
		const ret = new Status(new StatusCode(StatusCode.values.EMETHODNOTFOUND))
		ret.F_3__ = data
		return ret
	}
}

const u2 = Symbol()
export class Smoosh implements rpc.Exportable{
	i: bigint
	t: string
	[u2] = true
	constructor(i: bigint, t: string) {
		this.i = i
		this.t = t
	}
	export() : any[] {
		return [
			rpc.exporters.int(this.i),
			this.t
		]
	}
	static import(obj: any[]) : Smoosh {
		obj = rpc.extend(obj, 2)
		const i = rpc.importers.int(obj[0])
		const t = rpc.importers.string(obj[1])
		return new Smoosh(
			i,
			t
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : Smoosh {
		return Smoosh.import(dec(a))
	}
}

const u3 = Symbol()
export class Boomer implements rpc.Cryptoable{
	ok: bigint
	nogo: string
	[u3] = true
	constructor(ok: bigint, nogo: string) {
		this.ok = ok
		this.nogo = nogo
	}
	export() : any[] {
		return [
			rpc.exporters.int(this.ok),
			this.nogo
		]
	}
	static import(obj: any[]) : Boomer {
		obj = rpc.extend(obj, 2)
		const ok = rpc.importers.int(obj[0])
		const nogo = rpc.importers.string(obj[1])
		return new Boomer(
			ok,
			nogo
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : Boomer {
		return Boomer.import(dec(a))
	}
	static id() : rpc.TypeUniqueID {
		return new rpc.Uint64("0xa839d6185e8209a7") as rpc.TypeUniqueID
	}
	id() : rpc.TypeUniqueID {
		return Boomer.id()
	}
}

const u4 = Symbol()
export class BoomerBlob implements rpc.Exportable {
	value : Uint8Array
	[u4] = true
	constructor(v : Uint8Array) {
		this.value = v
	}
	export() : any {
		return this.value
	}
	static import(a : any) : BoomerBlob {
		return new BoomerBlob(rpc.importers.blob(a))
	}
	valueOf() : Uint8Array {
		return this.value
	}
}

const u5 = Symbol()
export class Header implements rpc.Exportable{
	vers: bigint
	[u5] = true
	constructor(vers: bigint) {
		this.vers = vers
	}
	export() : any[] {
		return [
			rpc.exporters.uint(this.vers)
		]
	}
	static import(obj: any[]) : Header {
		obj = rpc.extend(obj, 1)
		const vers = rpc.importers.uint(obj[0])
		return new Header(
			vers
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : Header {
		return Header.import(dec(a))
	}
}

export const pingProtocolID = rpc.newProtocolUniqueID("0xae1f1d4f")
const u6 = Symbol()
export class pingUintArg implements rpc.Exportable{
	u: bigint
	[u6] = true
	constructor(u: bigint) {
		this.u = u
	}
	export() : any[] {
		return [
			rpc.exporters.uint(this.u)
		]
	}
	static import(obj: any[]) : pingUintArg {
		obj = rpc.extend(obj, 1)
		const u = rpc.importers.uint(obj[0])
		return new pingUintArg(
			u
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : pingUintArg {
		return pingUintArg.import(dec(a))
	}
}

const u7 = Symbol()
export class pingTextArg implements rpc.Exportable{
	t: string
	[u7] = true
	constructor(t: string) {
		this.t = t
	}
	export() : any[] {
		return [
			this.t
		]
	}
	static import(obj: any[]) : pingTextArg {
		obj = rpc.extend(obj, 1)
		const t = rpc.importers.string(obj[0])
		return new pingTextArg(
			t
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : pingTextArg {
		return pingTextArg.import(dec(a))
	}
}

const u8 = Symbol()
export class pingSmooshArg implements rpc.Exportable{
	i: bigint
	t: string
	[u8] = true
	constructor(i: bigint, t: string) {
		this.i = i
		this.t = t
	}
	export() : any[] {
		return [
			rpc.exporters.int(this.i),
			this.t
		]
	}
	static import(obj: any[]) : pingSmooshArg {
		obj = rpc.extend(obj, 2)
		const i = rpc.importers.int(obj[0])
		const t = rpc.importers.string(obj[1])
		return new pingSmooshArg(
			i,
			t
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : pingSmooshArg {
		return pingSmooshArg.import(dec(a))
	}
}

const u9 = Symbol()
export class pingPukeArg implements rpc.Exportable{
	i: bigint | null
	t: string | null
	[u9] = true
	constructor(i: bigint | null, t: string | null) {
		this.i = i
		this.t = t
	}
	export() : any[] {
		return [
			(this.i ? (rpc.exporters.int(this.i)) : null),
			(this.t ? (this.t) : null)
		]
	}
	static import(obj: any[]) : pingPukeArg {
		obj = rpc.extend(obj, 2)
		const i = obj[0]
		const t = obj[1]
		return new pingPukeArg(
			i,
			t
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : pingPukeArg {
		return pingPukeArg.import(dec(a))
	}
}

const u10 = Symbol()
export class blobTortureArg implements rpc.Exportable{
	a: Uint8Array[]
	[u10] = true
	constructor(a: Uint8Array[]) {
		this.a = a
	}
	export() : any[] {
		return [
			this.a.map((x0) => (x0))
		]
	}
	static import(obj: any[]) : blobTortureArg {
		obj = rpc.extend(obj, 1)
		const a = obj[0].map((x1 : any) => (rpc.importers.blob(x1)))
		return new blobTortureArg(
			a
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : blobTortureArg {
		return blobTortureArg.import(dec(a))
	}
}

const u11 = Symbol()
export class pingSmooshesArg implements rpc.Exportable{
	a: Smoosh[]
	[u11] = true
	constructor(a: Smoosh[]) {
		this.a = a
	}
	export() : any[] {
		return [
			this.a.map((x2) => (x2.export()))
		]
	}
	static import(obj: any[]) : pingSmooshesArg {
		obj = rpc.extend(obj, 1)
		const a = obj[0].map((x3 : any) => (Smoosh.import(x3)))
		return new pingSmooshesArg(
			a
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : pingSmooshesArg {
		return pingSmooshesArg.import(dec(a))
	}
}

const u12 = Symbol()
export class MyArg implements rpc.Exportable{
	a: bigint
	b: bigint[]
	[u12] = true
	constructor(a: bigint, b: bigint[]) {
		this.a = a
		this.b = b
	}
	export() : any[] {
		return [
			rpc.exporters.int(this.a),
			this.b.map((x4) => (rpc.exporters.int(x4)))
		]
	}
	static import(obj: any[]) : MyArg {
		obj = rpc.extend(obj, 2)
		const a = rpc.importers.int(obj[0])
		const b = obj[1].map((x5 : any) => (rpc.importers.int(x5)))
		return new MyArg(
			a,
			b
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : MyArg {
		return MyArg.import(dec(a))
	}
}

const u13 = Symbol()
export class getNowArg implements rpc.Exportable{
	[u13] = true
	constructor() {
	}
	export() : any[] {
		return [
		]
	}
	static import(obj: any[]) : getNowArg {
		obj = rpc.extend(obj, 0)
		return new getNowArg(
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : getNowArg {
		return getNowArg.import(dec(a))
	}
}

export interface pingInterface {
	pingUint(arg: bigint) : Promise<bigint>
	pingText(arg: string) : Promise<string>
	pingSmoosh(arg: pingSmooshArg) : Promise<Smoosh>
	pingPuke(arg: pingPukeArg) : Promise<void>
	blobTorture(arg: Uint8Array[]) : Promise<Uint8Array[]>
	pingSmooshes(arg: Smoosh[]) : Promise<Smoosh[]>
	argRename(arg: MyArg) : Promise<string>
	getNow() : Promise<common.UnixTime>
	errorWrapper(arg: Error | null) : Status
}

export type pingErrorWrapper = (e : Error | null) => Status
export type pingErroUnWrapper = (s : Status) => Error | null

export function pingMakeGenericErrorWrapper(f : pingErrorWrapper) : (e : Error | null) => any {
	return (e: Error | null) => (e ? f(e).export(): null)
}

export class pingClient {
	private cli: rpc.ClientInterface
	private eu: rpc.ErrorUnwrapper
	constructor(cli: rpc.ClientInterface, eu: rpc.ErrorUnwrapper) {
		this.cli = cli
		this.eu = eu
	}
	makeErrorUnwrapper() : (a : any) => Error | null {
		return (a : any) => this.eu(Status.import(a))
	}
	async pingUint(s : bigint) : Promise<bigint> {
		const exportedArg = [rpc.exporters.uint(s)]
		const ret = await this.cli.call(
			rpc.newProtocolUniqueID("0xae1f1d4f"),
			rpc.newMethodID(0),
			exportedArg,
			this.makeErrorUnwrapper()
		)
		return rpc.importers.uint(ret)
	}
	async pingText(s : string) : Promise<string> {
		const exportedArg = [s]
		const ret = await this.cli.call(
			rpc.newProtocolUniqueID("0xae1f1d4f"),
			rpc.newMethodID(1),
			exportedArg,
			this.makeErrorUnwrapper()
		)
		return rpc.importers.string(ret)
	}
	async pingSmoosh(arg : pingSmooshArg) : Promise<Smoosh> {
		const exportedArg = arg.export()
		const ret = await this.cli.call(
			rpc.newProtocolUniqueID("0xae1f1d4f"),
			rpc.newMethodID(2),
			exportedArg,
			this.makeErrorUnwrapper()
		)
		return Smoosh.import(ret)
	}
	async pingPuke(arg : pingPukeArg) : Promise<void> {
		const exportedArg = arg.export()
		const ret = await this.cli.call(
			rpc.newProtocolUniqueID("0xae1f1d4f"),
			rpc.newMethodID(3),
			exportedArg,
			this.makeErrorUnwrapper()
		)
		return 
	}
	async blobTorture(s : Uint8Array[]) : Promise<Uint8Array[]> {
		const exportedArg = [s.map((x6) => (x6))]
		const ret = await this.cli.call(
			rpc.newProtocolUniqueID("0xae1f1d4f"),
			rpc.newMethodID(4),
			exportedArg,
			this.makeErrorUnwrapper()
		)
		return ret.map((x7 : any) => (rpc.importers.blob(x7)))
	}
	async pingSmooshes(s : Smoosh[]) : Promise<Smoosh[]> {
		const exportedArg = [s.map((x8) => (x8.export()))]
		const ret = await this.cli.call(
			rpc.newProtocolUniqueID("0xae1f1d4f"),
			rpc.newMethodID(5),
			exportedArg,
			this.makeErrorUnwrapper()
		)
		return ret.map((x9 : any) => (Smoosh.import(x9)))
	}
	async argRename(arg : MyArg) : Promise<string> {
		const exportedArg = arg.export()
		const ret = await this.cli.call(
			rpc.newProtocolUniqueID("0xae1f1d4f"),
			rpc.newMethodID(6),
			exportedArg,
			this.makeErrorUnwrapper()
		)
		return rpc.importers.string(ret)
	}
	async getNow() : Promise<common.UnixTime> {
		const exportedArg : any[] = []
		const ret = await this.cli.call(
			rpc.newProtocolUniqueID("0xae1f1d4f"),
			rpc.newMethodID(7),
			exportedArg,
			this.makeErrorUnwrapper()
		)
		return common.UnixTime.import(ret)
	}
}

export function pingProtocol(i : pingInterface) : rpc.Protocol {
	const ret = {
		methods: new Map<rpc.MethodID, rpc.MethodDescription>(),
		id : pingProtocolID,
		name : 'ping',
		errorWrapper : i.errorWrapper,
	}
	ret.methods.set(rpc.newMethodID(0), {
		name : 'pingUint',
		handler : async (varg : any[]) => {
			varg = rpc.extend(varg, 1)
			const [ arg ] = varg
			const iarg = rpc.importers.uint(arg)
			const ret = await i.pingUint(iarg)
			return rpc.exporters.uint(ret)
		},
	})
	ret.methods.set(rpc.newMethodID(1), {
		name : 'pingText',
		handler : async (varg : any[]) => {
			varg = rpc.extend(varg, 1)
			const [ arg ] = varg
			const iarg = rpc.importers.string(arg)
			const ret = await i.pingText(iarg)
			return ret
		},
	})
	ret.methods.set(rpc.newMethodID(2), {
		name : 'pingSmoosh',
		handler : async (varg : any[]) => {
			const iarg = pingSmooshArg.import(varg)
			const ret = await i.pingSmoosh(iarg)
			return ret.export()
		},
	})
	ret.methods.set(rpc.newMethodID(3), {
		name : 'pingPuke',
		handler : async (varg : any[]) => {
			const iarg = pingPukeArg.import(varg)
			await i.pingPuke(iarg)
			return
		},
	})
	ret.methods.set(rpc.newMethodID(4), {
		name : 'blobTorture',
		handler : async (varg : any[]) => {
			varg = rpc.extend(varg, 1)
			const [ arg ] = varg
			const iarg = arg.map((x10 : any) => (rpc.importers.blob(x10)))
			const ret = await i.blobTorture(iarg)
			return ret.map((x11) => (x11))
		},
	})
	ret.methods.set(rpc.newMethodID(5), {
		name : 'pingSmooshes',
		handler : async (varg : any[]) => {
			varg = rpc.extend(varg, 1)
			const [ arg ] = varg
			const iarg = arg.map((x12 : any) => (Smoosh.import(x12)))
			const ret = await i.pingSmooshes(iarg)
			return ret.map((x13) => (x13.export()))
		},
	})
	ret.methods.set(rpc.newMethodID(6), {
		name : 'argRename',
		handler : async (varg : any[]) => {
			const iarg = MyArg.import(varg)
			const ret = await i.argRename(iarg)
			return ret
		},
	})
	ret.methods.set(rpc.newMethodID(7), {
		name : 'getNow',
		handler : async (varg : any[]) => {
			const ret = await i.getNow()
			return ret.export()
		},
	})
	return ret
}

export const poogProtocolID = rpc.newProtocolUniqueID("0x853d5ea0")
const u14 = Symbol()
export class poogUintArg implements rpc.Exportable{
	[u14] = true
	constructor() {
	}
	export() : any[] {
		return [
		]
	}
	static import(obj: any[]) : poogUintArg {
		obj = rpc.extend(obj, 0)
		return new poogUintArg(
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : poogUintArg {
		return poogUintArg.import(dec(a))
	}
}

export interface poogInterface {
	poogUint() : Promise<void>
	errorWrapper(arg: Error | null) : Status
}

export type poogErrorWrapper = (e : Error | null) => Status
export type poogErroUnWrapper = (s : Status) => Error | null

export function poogMakeGenericErrorWrapper(f : poogErrorWrapper) : (e : Error | null) => any {
	return (e: Error | null) => (e ? f(e).export(): null)
}

export class poogClient {
	private cli: rpc.ClientInterface
	private eu: rpc.ErrorUnwrapper
	constructor(cli: rpc.ClientInterface, eu: rpc.ErrorUnwrapper) {
		this.cli = cli
		this.eu = eu
	}
	makeErrorUnwrapper() : (a : any) => Error | null {
		return (a : any) => this.eu(Status.import(a))
	}
	async poogUint() : Promise<void> {
		const exportedArg : any[] = []
		const ret = await this.cli.call(
			rpc.newProtocolUniqueID("0x853d5ea0"),
			rpc.newMethodID(0),
			exportedArg,
			this.makeErrorUnwrapper()
		)
		return 
	}
}

export function poogProtocol(i : poogInterface) : rpc.Protocol {
	const ret = {
		methods: new Map<rpc.MethodID, rpc.MethodDescription>(),
		id : poogProtocolID,
		name : 'poog',
		errorWrapper : i.errorWrapper,
	}
	ret.methods.set(rpc.newMethodID(0), {
		name : 'poogUint',
		handler : async (varg : any[]) => {
			await i.poogUint()
			return
		},
	})
	return ret
}

export const pingV2ProtocolID = rpc.newProtocolUniqueID("0xae1f1d4f")
const u15 = Symbol()
export class pingPikeArg implements rpc.Exportable{
	[u15] = true
	constructor() {
	}
	export() : any[] {
		return [
		]
	}
	static import(obj: any[]) : pingPikeArg {
		obj = rpc.extend(obj, 0)
		return new pingPikeArg(
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : pingPikeArg {
		return pingPikeArg.import(dec(a))
	}
}

export interface pingV2Interface {
	pingPike() : Promise<void>
	errorWrapper(arg: Error | null) : Status
}

export type pingV2ErrorWrapper = (e : Error | null) => Status
export type pingV2ErroUnWrapper = (s : Status) => Error | null

export function pingV2MakeGenericErrorWrapper(f : pingV2ErrorWrapper) : (e : Error | null) => any {
	return (e: Error | null) => (e ? f(e).export(): null)
}

export class pingV2Client {
	private cli: rpc.ClientInterface
	private eu: rpc.ErrorUnwrapper
	constructor(cli: rpc.ClientInterface, eu: rpc.ErrorUnwrapper) {
		this.cli = cli
		this.eu = eu
	}
	makeErrorUnwrapper() : (a : any) => Error | null {
		return (a : any) => this.eu(Status.import(a))
	}
	async pingPike() : Promise<void> {
		const exportedArg : any[] = []
		const ret = await this.cli.call(
			rpc.newProtocolUniqueID("0xae1f1d4f"),
			rpc.newMethodID(50),
			exportedArg,
			this.makeErrorUnwrapper()
		)
		return 
	}
}

export function pingV2Protocol(i : pingV2Interface) : rpc.Protocol {
	const ret = {
		methods: new Map<rpc.MethodID, rpc.MethodDescription>(),
		id : pingV2ProtocolID,
		name : 'pingV2',
		errorWrapper : i.errorWrapper,
	}
	ret.methods.set(rpc.newMethodID(50), {
		name : 'pingPike',
		handler : async (varg : any[]) => {
			await i.pingPike()
			return
		},
	})
	return ret
}


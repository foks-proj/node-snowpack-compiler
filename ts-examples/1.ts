// Auto-generated to TypeScript types and interfaces using snowpack-compiler 1.0.0 (https://github.com/maxtaco/node-snowpack-compiler)
//  Input file: ts-examples/1.snowp

import * as rpc from 'snowpack'

const u0 = Symbol()
export class foobar implements rpc.Cryptoable{
	i: bigint
	t: string
	l: bigint[]
	lf: foobar[]
	llf: foobar[][]
	lof: foobar[] | null
	bf: rpc.FixedBuffer
	b: Uint8Array
	u: bigint
	z: bozo
	p: Blipper
	o: Booper
	[u0] = true
	constructor(i: bigint, t: string, l: bigint[], lf: foobar[], llf: foobar[][], lof: foobar[] | null, bf: rpc.FixedBuffer, b: Uint8Array, u: bigint, z: bozo, p: Blipper, o: Booper) {
		this.i = i
		this.t = t
		this.l = l
		this.lf = lf
		this.llf = llf
		this.lof = lof
		this.bf = bf
		this.b = b
		this.u = u
		this.z = z
		this.p = p
		this.o = o
	}
	export() : any[] {
		return [
			rpc.exporters.int(this.i),
			null,
			this.t,
			this.l.map((x0) => (rpc.exporters.int(x0))),
			this.lf.map((x1) => (x1.export())),
			this.llf.map((x2) => (x2.map((x3) => (x3.export())))),
			(this.lof ? (this.lof.map((x4) => (x4.export()))) : null),
			this.bf.export(),
			this.b,
			null,
			null,
			null,
			null,
			null,
			rpc.exporters.uint(this.u),
			this.z.export(),
			this.p.export(),
			this.o.export()
		]
	}
	static import(obj: any[]) : foobar {
		obj = rpc.extend(obj, 18)
		const i = rpc.importers.int(obj[0])
		const t = rpc.importers.string(obj[2])
		const l = obj[3].map((x5 : any) => (rpc.importers.int(x5)))
		const lf = obj[4].map((x6 : any) => (foobar.import(x6)))
		const llf = obj[5].map((x7 : any) => (x7.map((x8 : any) => (foobar.import(x8)))))
		const lof = (obj[6] ? (obj[6].map((x9 : any) => (foobar.import(x9)))) : null)
		const bf = rpc.FixedBuffer.import(obj[7], 23)
		const b = rpc.importers.blob(obj[8])
		const u = rpc.importers.uint(obj[14])
		const z = bozo.import(obj[15])
		const p = Blipper.import(obj[16])
		const o = Booper.import(obj[17])
		return new foobar(
			i,
			t,
			l,
			lf,
			llf,
			lof,
			bf,
			b,
			u,
			z,
			p,
			o
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : foobar {
		return foobar.import(dec(a))
	}
	static id() : rpc.TypeUniqueID {
		return new rpc.Uint64("0x9ad7a1559dd660d3") as rpc.TypeUniqueID
	}
	id() : rpc.TypeUniqueID {
		return foobar.id()
	}
}

enum bozoValues {
	jeff = 1, 
	max = 2, 
	bobby = 10, 
	boobie = 1001, 
}

const u1 = Symbol()
export class bozo implements rpc.Exportable {
	[u1] = true
	value : number
	static values = bozoValues
	static o = {
		jeff : new bozo(bozo.values.jeff),
		max : new bozo(bozo.values.max),
		bobby : new bozo(bozo.values.bobby),
		boobie : new bozo(bozo.values.boobie),
	}
	constructor(v : number) {
		this.value = v
	}
	valueOf() : number {
		return this.value
	}
	static import(a : any) : bozo {
		const v = rpc.importers.enum(a, this.values)
		return new bozo(v)
	}
	export() : any {
		return this.value
	}
}

export class boops implements rpc.Cryptoable {
	_b : bozo
	F_0__ : bigint | undefined
	F_255__ : foobar[] | undefined
	F_1__ : string | undefined
	constructor(b : bozo) {
		this._b = b
	}
	get b() : bozo {
		switch (this._b.valueOf()) {
			case bozo.values.jeff:
				if (this.F_0__ === undefined) {
					throw new rpc.VariantError('unexpected nil case for F_0__')
				}
				break
			case bozo.values.boobie:
				if (this.F_255__ === undefined) {
					throw new rpc.VariantError('unexpected nil case for F_255__')
				}
				break
			default:
				if (this.F_1__ === undefined) {
					throw new rpc.VariantError('unexpected nil case for F_1__')
				}
				break
		}
		return this._b
	}
	get jeff() : bigint {
		if (this.F_0__ === undefined) {
			throw new rpc.VariantError("jeff case not set")
		}
		return this.F_0__
	}
	get boobie() : foobar[] {
		if (this.F_255__ === undefined) {
			throw new rpc.VariantError("boobie case not set")
		}
		return this.F_255__
	}
	get def() : string {
		if (this.F_1__ === undefined) {
			throw new rpc.VariantError("default case not set")
		}
		return this.F_1__
	}
	export() : any {
		const tmp : { [k: string]: any }  = {}
		if (!!this.F_0__) { tmp["0"] = rpc.exporters.uint(this.F_0__) }
		if (!!this.F_255__) { tmp["3_"] = this.F_255__.map((x10) => (x10.export())) }
		if (!!this.F_1__) { tmp["1"] = this.F_1__ }
		return [ this._b.export(), tmp ]
	}
	static import(obj: any) : boops {
		if (typeof(obj) !== 'object' || !Array.isArray(obj) || obj.length !== 2) {
			throw new rpc.VariantError('invalid variant')
		}
		const [ rawTag, data ] = obj
		const tag = bozo.import(rawTag)
		const ret = new boops(tag)
		ret.F_0__ = data["0"] ? rpc.importers.uint(data["0"]) : undefined
		ret.F_255__ = data["3_"] ? data["3_"].map((x11 : any) => (foobar.import(x11))) : undefined
		ret.F_1__ = data["1"] ? rpc.importers.string(data["1"]) : undefined
		return ret
	}
	static newWithJeff(data: bigint) : boops {
		const ret = new boops(new bozo(bozo.values.jeff))
		ret.F_0__ = data
		return ret
	}
	static newWithBoobie(data: foobar[]) : boops {
		const ret = new boops(new bozo(bozo.values.boobie))
		ret.F_255__ = data
		return ret
	}
	static newWithDefault(b: bozo, data: string) : boops {
		const ret = new boops(b)
		ret.F_1__ = data
		return ret
	}
	static id() : rpc.TypeUniqueID {
		return new rpc.Uint64("0x9f49b68f2c6a08ef") as rpc.TypeUniqueID
	}
	id() : rpc.TypeUniqueID {
		return boops.id()
	}
}

export class yogo implements rpc.Exportable {
	_b : boolean
	F_1__ : bigint | undefined
	F_0__ : string | undefined
	constructor(b : boolean) {
		this._b = b
	}
	get b() : boolean {
		switch (this._b.valueOf()) {
			case true:
				if (this.F_1__ === undefined) {
					throw new rpc.VariantError('unexpected nil case for F_1__')
				}
				break
			case false:
				if (this.F_0__ === undefined) {
					throw new rpc.VariantError('unexpected nil case for F_0__')
				}
				break
		}
		return this._b
	}
	get bTtrue() : bigint {
		if (this.F_1__ === undefined) {
			throw new rpc.VariantError("bTtrue case not set")
		}
		return this.F_1__
	}
	get bFalse() : string {
		if (this.F_0__ === undefined) {
			throw new rpc.VariantError("bFalse case not set")
		}
		return this.F_0__
	}
	export() : any {
		const tmp : { [k: string]: any }  = {}
		if (!!this.F_1__) { tmp["1"] = rpc.exporters.int(this.F_1__) }
		if (!!this.F_0__) { tmp["0"] = this.F_0__ }
		return [ this._b, tmp ]
	}
	static import(obj: any) : yogo {
		if (typeof(obj) !== 'object' || !Array.isArray(obj) || obj.length !== 2) {
			throw new rpc.VariantError('invalid variant')
		}
		const [ rawTag, data ] = obj
		const tag = rpc.importers.bool(rawTag)
		const ret = new yogo(tag)
		ret.F_1__ = data["1"] ? rpc.importers.int(data["1"]) : undefined
		ret.F_0__ = data["0"] ? rpc.importers.string(data["0"]) : undefined
		return ret
	}
	static newWithTrue(data: bigint) : yogo {
		const ret = new yogo(true)
		ret.F_1__ = data
		return ret
	}
	static newWithFalse(data: string) : yogo {
		const ret = new yogo(false)
		ret.F_0__ = data
		return ret
	}
}

export class sogo implements rpc.Exportable {
	_i : bigint
	F_0__ : boops | undefined
	F_1__ : yogo | undefined
	F_2__ : bozo | undefined
	constructor(i : bigint) {
		this._i = i
	}
	get i() : bigint {
		switch (this._i.valueOf()) {
			case -1:
				if (this.F_0__ === undefined) {
					throw new rpc.VariantError('unexpected nil case for F_0__')
				}
				break
			case 10:
				if (this.F_1__ === undefined) {
					throw new rpc.VariantError('unexpected nil case for F_1__')
				}
				break
			case 100:
				if (this.F_2__ === undefined) {
					throw new rpc.VariantError('unexpected nil case for F_2__')
				}
				break
		}
		return bigint(this._i)
	}
	get n1() : boops {
		if (this.F_0__ === undefined) {
			throw new rpc.VariantError("n1 case not set")
		}
		return this.F_0__
	}
	get p10() : yogo {
		if (this.F_1__ === undefined) {
			throw new rpc.VariantError("p10 case not set")
		}
		return this.F_1__
	}
	get p100() : bozo {
		if (this.F_2__ === undefined) {
			throw new rpc.VariantError("p100 case not set")
		}
		return this.F_2__
	}
	export() : any {
		const tmp : { [k: string]: any }  = {}
		if (!!this.F_0__) { tmp["0"] = this.F_0__.export() }
		if (!!this.F_1__) { tmp["1"] = this.F_1__.export() }
		if (!!this.F_2__) { tmp["2"] = this.F_2__.export() }
		return [ rpc.exporters.int(this._i), tmp ]
	}
	static import(obj: any) : sogo {
		if (typeof(obj) !== 'object' || !Array.isArray(obj) || obj.length !== 2) {
			throw new rpc.VariantError('invalid variant')
		}
		const [ rawTag, data ] = obj
		const tag = rpc.importers.int(rawTag)
		const ret = new sogo(tag)
		ret.F_0__ = data["0"] ? boops.import(data["0"]) : undefined
		ret.F_1__ = data["1"] ? yogo.import(data["1"]) : undefined
		ret.F_2__ = data["2"] ? bozo.import(data["2"]) : undefined
		return ret
	}
	static newWithN1(data: boops) : sogo {
		const ret = new sogo(-1)
		ret.F_0__ = data
		return ret
	}
	static newWithP10(data: yogo) : sogo {
		const ret = new sogo(10)
		ret.F_1__ = data
		return ret
	}
	static newWithP100(data: bozo) : sogo {
		const ret = new sogo(100)
		ret.F_2__ = data
		return ret
	}
}

const u2 = Symbol()
export class Blipper implements rpc.Exportable {
	value : bigint
	[u2] = true
	constructor(v : bigint) {
		this.value = v
	}
	export() : any {
		return rpc.exporters.uint(this.value)
	}
	static import(a : any) : Blipper {
		return new Blipper(rpc.importers.uint(a))
	}
	valueOf() : bigint {
		return this.value
	}
}

const u3 = Symbol()
export class Booper implements rpc.Exportable {
	value : Blipper[]
	[u3] = true
	constructor(v : Blipper[]) {
		this.value = v
	}
	export() : any {
		return this.value.map((x12) => (x12.export()))
	}
	static import(a : any) : Booper {
		return new Booper(a.map((x13 : any) => (Blipper.import(x13))))
	}
	valueOf() : Blipper[] {
		return this.value
	}
}

const u4 = Symbol()
export class AuthorID implements rpc.Exportable {
	value : string
	[u4] = true
	constructor(v : string) {
		this.value = v
	}
	export() : any {
		return this.value
	}
	static import(a : any) : AuthorID {
		return new AuthorID(rpc.importers.string(a))
	}
	valueOf() : string {
		return this.value
	}
}

const u5 = Symbol()
export class WorkID implements rpc.Exportable {
	value : string
	[u5] = true
	constructor(v : string) {
		this.value = v
	}
	export() : any {
		return this.value
	}
	static import(a : any) : WorkID {
		return new WorkID(rpc.importers.string(a))
	}
	valueOf() : string {
		return this.value
	}
}

const u6 = Symbol()
export class SectionID implements rpc.Exportable {
	value : string
	[u6] = true
	constructor(v : string) {
		this.value = v
	}
	export() : any {
		return this.value
	}
	static import(a : any) : SectionID {
		return new SectionID(rpc.importers.string(a))
	}
	valueOf() : string {
		return this.value
	}
}

const u7 = Symbol()
export class Summary implements rpc.Exportable{
	nWords: bigint
	summary: string
	i: bigint
	[u7] = true
	constructor(nWords: bigint, summary: string, i: bigint) {
		this.nWords = nWords
		this.summary = summary
		this.i = i
	}
	export() : any[] {
		return [
			rpc.exporters.uint(this.nWords),
			this.summary,
			rpc.exporters.int(this.i)
		]
	}
	static import(obj: any[]) : Summary {
		obj = rpc.extend(obj, 3)
		const nWords = rpc.importers.uint(obj[0])
		const summary = rpc.importers.string(obj[1])
		const i = rpc.importers.int(obj[2])
		return new Summary(
			nWords,
			summary,
			i
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : Summary {
		return Summary.import(dec(a))
	}
}

const u8 = Symbol()
export class Summaries implements rpc.Exportable{
	section: SectionID
	summaries: Summary[]
	[u8] = true
	constructor(section: SectionID, summaries: Summary[]) {
		this.section = section
		this.summaries = summaries
	}
	export() : any[] {
		return [
			this.section.export(),
			this.summaries.map((x14) => (x14.export()))
		]
	}
	static import(obj: any[]) : Summaries {
		obj = rpc.extend(obj, 2)
		const section = SectionID.import(obj[0])
		const summaries = obj[1].map((x15 : any) => (Summary.import(x15)))
		return new Summaries(
			section,
			summaries
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : Summaries {
		return Summaries.import(dec(a))
	}
}

const u9 = Symbol()
export class Work implements rpc.Exportable{
	work: WorkID
	author: AuthorID
	summaries: Summaries
	[u9] = true
	constructor(work: WorkID, author: AuthorID, summaries: Summaries) {
		this.work = work
		this.author = author
		this.summaries = summaries
	}
	export() : any[] {
		return [
			this.work.export(),
			this.author.export(),
			this.summaries.export()
		]
	}
	static import(obj: any[]) : Work {
		obj = rpc.extend(obj, 3)
		const work = WorkID.import(obj[0])
		const author = AuthorID.import(obj[1])
		const summaries = Summaries.import(obj[2])
		return new Work(
			work,
			author,
			summaries
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : Work {
		return Work.import(dec(a))
	}
}


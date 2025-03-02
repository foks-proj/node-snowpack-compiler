// Auto-generated to TypeScript types and interfaces using snowpack-compiler 1.0.0 (https://github.com/maxtaco/node-snowpack-compiler)
//  Input file: structs1.snowp

import * as rpc from 'snowpack'

const u0 = Symbol()
export class Blobs implements rpc.Exportable{
	b: Uint8Array
	bf: rpc.FixedBuffer
	ob: Uint8Array | null
	obf: rpc.FixedBuffer | null
	be: Uint8Array
	[u0] = true
	constructor(b: Uint8Array, bf: rpc.FixedBuffer, ob: Uint8Array | null, obf: rpc.FixedBuffer | null, be: Uint8Array) {
		this.b = b
		this.bf = bf
		this.ob = ob
		this.obf = obf
		this.be = be
	}
	export() : any[] {
		return [
			this.b,
			this.bf.export(),
			(this.ob ? (this.ob) : null),
			(this.obf ? (this.obf.export()) : null),
			this.be
		]
	}
	static import(obj: any[]) : Blobs {
		obj = rpc.extend(obj, 5)
		const b = rpc.importers.blob(obj[0])
		const bf = rpc.FixedBuffer.import(obj[1], 3)
		const ob = obj[2]
		const obf = obj[3]
		const be = rpc.importers.blob(obj[4])
		return new Blobs(
			b,
			bf,
			ob,
			obf,
			be
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : Blobs {
		return Blobs.import(dec(a))
	}
}

const u1 = Symbol()
export class Apple implements rpc.Cryptoable{
	id: string
	opt: string | null
	lst: string[]
	lstOpt: string[] | null
	i: bigint
	u: bigint
	skip: boolean
	lstEmpty: string[]
	textEmpty: string
	[u1] = true
	constructor(id: string, opt: string | null, lst: string[], lstOpt: string[] | null, i: bigint, u: bigint, skip: boolean, lstEmpty: string[], textEmpty: string) {
		this.id = id
		this.opt = opt
		this.lst = lst
		this.lstOpt = lstOpt
		this.i = i
		this.u = u
		this.skip = skip
		this.lstEmpty = lstEmpty
		this.textEmpty = textEmpty
	}
	export() : any[] {
		return [
			this.id,
			(this.opt ? (this.opt) : null),
			this.lst.map((x0) => (x0)),
			(this.lstOpt ? (this.lstOpt.map((x1) => (x1))) : null),
			rpc.exporters.int(this.i),
			rpc.exporters.uint(this.u),
			null,
			null,
			this.skip,
			this.lstEmpty.map((x2) => (x2)),
			this.textEmpty
		]
	}
	static import(obj: any[]) : Apple {
		obj = rpc.extend(obj, 11)
		const id = rpc.importers.string(obj[0])
		const opt = obj[1]
		const lst = obj[2].map((x3 : any) => (rpc.importers.string(x3)))
		const lstOpt = (obj[3] ? (obj[3].map((x4 : any) => (rpc.importers.string(x4)))) : null)
		const i = rpc.importers.int(obj[4])
		const u = rpc.importers.uint(obj[5])
		const skip = rpc.importers.bool(obj[8])
		const lstEmpty = obj[9].map((x5 : any) => (rpc.importers.string(x5)))
		const textEmpty = rpc.importers.string(obj[10])
		return new Apple(
			id,
			opt,
			lst,
			lstOpt,
			i,
			u,
			skip,
			lstEmpty,
			textEmpty
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : Apple {
		return Apple.import(dec(a))
	}
	static id() : rpc.TypeUniqueID {
		return new rpc.Uint64("0x9ed0d8bf5dd9cb36") as rpc.TypeUniqueID
	}
	id() : rpc.TypeUniqueID {
		return Apple.id()
	}
}

enum FruitTypeValues {
	APPLE = 0, 
	ORANGE = 1, 
	BANANA = 2, 
}

const u2 = Symbol()
export class FruitType implements rpc.Exportable {
	[u2] = true
	value : number
	static values = FruitTypeValues
	static o = {
		APPLE : new FruitType(FruitType.values.APPLE),
		ORANGE : new FruitType(FruitType.values.ORANGE),
		BANANA : new FruitType(FruitType.values.BANANA),
	}
	constructor(v : number) {
		this.value = v
	}
	valueOf() : number {
		return this.value
	}
	static import(a : any) : FruitType {
		const v = rpc.importers.enum(a, this.values)
		return new FruitType(v)
	}
	export() : any {
		return this.value
	}
}

export class Fruit implements rpc.Exportable {
	_ft : FruitType
	F_0__ : Apple | undefined
	F_29347__ : Blobs | undefined
	F_1__ : string | undefined
	constructor(ft : FruitType) {
		this._ft = ft
	}
	get ft() : FruitType {
		switch (this._ft.valueOf()) {
			case FruitType.values.APPLE:
				if (this.F_0__ === undefined) {
					throw new rpc.VariantError('unexpected nil case for F_0__')
				}
				break
			case FruitType.values.BANANA:
				if (this.F_29347__ === undefined) {
					throw new rpc.VariantError('unexpected nil case for F_29347__')
				}
				break
			default:
				if (this.F_1__ === undefined) {
					throw new rpc.VariantError('unexpected nil case for F_1__')
				}
				break
		}
		return this._ft
	}
	get APPLE() : Apple {
		if (this.F_0__ === undefined) {
			throw new rpc.VariantError("APPLE case not set")
		}
		return this.F_0__
	}
	get BANANA() : Blobs {
		if (this.F_29347__ === undefined) {
			throw new rpc.VariantError("BANANA case not set")
		}
		return this.F_29347__
	}
	get def() : string {
		if (this.F_1__ === undefined) {
			throw new rpc.VariantError("default case not set")
		}
		return this.F_1__
	}
	export() : any {
		const tmp : { [k: string]: any }  = {}
		if (!!this.F_0__) { tmp["0"] = this.F_0__.export() }
		if (!!this.F_29347__) { tmp["7az"] = this.F_29347__.export() }
		if (!!this.F_1__) { tmp["1"] = this.F_1__ }
		return [ this._ft.export(), tmp ]
	}
	static import(obj: any) : Fruit {
		if (typeof(obj) !== 'object' || !Array.isArray(obj) || obj.length !== 2) {
			throw new rpc.VariantError('invalid variant')
		}
		const [ rawTag, data ] = obj
		const tag = FruitType.import(rawTag)
		const ret = new Fruit(tag)
		ret.F_0__ = data["0"] ? Apple.import(data["0"]) : undefined
		ret.F_29347__ = data["7az"] ? Blobs.import(data["7az"]) : undefined
		ret.F_1__ = data["1"] ? rpc.importers.string(data["1"]) : undefined
		return ret
	}
	static newWithAPPLE(data: Apple) : Fruit {
		const ret = new Fruit(new FruitType(FruitType.values.APPLE))
		ret.F_0__ = data
		return ret
	}
	static newWithBANANA(data: Blobs) : Fruit {
		const ret = new Fruit(new FruitType(FruitType.values.BANANA))
		ret.F_29347__ = data
		return ret
	}
	static newWithDefault(ft: FruitType, data: string) : Fruit {
		const ret = new Fruit(ft)
		ret.F_1__ = data
		return ret
	}
}

const u3 = Symbol()
export class Bundle implements rpc.Exportable{
	fruits: Fruit[]
	source: string
	[u3] = true
	constructor(fruits: Fruit[], source: string) {
		this.fruits = fruits
		this.source = source
	}
	export() : any[] {
		return [
			this.fruits.map((x6) => (x6.export())),
			this.source
		]
	}
	static import(obj: any[]) : Bundle {
		obj = rpc.extend(obj, 2)
		const fruits = obj[0].map((x7 : any) => (Fruit.import(x7)))
		const source = rpc.importers.string(obj[1])
		return new Bundle(
			fruits,
			source
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : Bundle {
		return Bundle.import(dec(a))
	}
}

const u4 = Symbol()
export class FooV1 implements rpc.Exportable{
	i0: bigint
	i1: bigint
	s2: string
	s3: string
	[u4] = true
	constructor(i0: bigint, i1: bigint, s2: string, s3: string) {
		this.i0 = i0
		this.i1 = i1
		this.s2 = s2
		this.s3 = s3
	}
	export() : any[] {
		return [
			rpc.exporters.int(this.i0),
			rpc.exporters.int(this.i1),
			this.s2,
			this.s3
		]
	}
	static import(obj: any[]) : FooV1 {
		obj = rpc.extend(obj, 4)
		const i0 = rpc.importers.int(obj[0])
		const i1 = rpc.importers.int(obj[1])
		const s2 = rpc.importers.string(obj[2])
		const s3 = rpc.importers.string(obj[3])
		return new FooV1(
			i0,
			i1,
			s2,
			s3
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : FooV1 {
		return FooV1.import(dec(a))
	}
}

const u5 = Symbol()
export class FooV2 implements rpc.Exportable{
	i1: bigint
	s3: string
	i4: bigint
	s5: string
	[u5] = true
	constructor(i1: bigint, s3: string, i4: bigint, s5: string) {
		this.i1 = i1
		this.s3 = s3
		this.i4 = i4
		this.s5 = s5
	}
	export() : any[] {
		return [
			null,
			rpc.exporters.int(this.i1),
			null,
			this.s3,
			rpc.exporters.int(this.i4),
			this.s5
		]
	}
	static import(obj: any[]) : FooV2 {
		obj = rpc.extend(obj, 6)
		const i1 = rpc.importers.int(obj[1])
		const s3 = rpc.importers.string(obj[3])
		const i4 = rpc.importers.int(obj[4])
		const s5 = rpc.importers.string(obj[5])
		return new FooV2(
			i1,
			s3,
			i4,
			s5
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : FooV2 {
		return FooV2.import(dec(a))
	}
}

const u6 = Symbol()
export class BloblTorture implements rpc.Exportable{
	bl: Uint8Array[]
	[u6] = true
	constructor(bl: Uint8Array[]) {
		this.bl = bl
	}
	export() : any[] {
		return [
			null,
			this.bl.map((x8) => (x8))
		]
	}
	static import(obj: any[]) : BloblTorture {
		obj = rpc.extend(obj, 2)
		const bl = obj[1].map((x9 : any) => (rpc.importers.blob(x9)))
		return new BloblTorture(
			bl
		)
	}
	encode(enc : rpc.encoder) : Uint8Array {
		return enc(this.export())
	}
	static decode(dec : rpc.decoder, a : Uint8Array) : BloblTorture {
		return BloblTorture.import(dec(a))
	}
}


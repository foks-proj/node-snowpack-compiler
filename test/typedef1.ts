// Auto-generated to TypeScript types and interfaces using snowpack-compiler 1.0.0 (https://github.com/maxtaco/node-snowpack-compiler)
//  Input file: typedef1.snowp

import * as rpc from 'snowpack'

const u0 = Symbol()
export class A implements rpc.Exportable {
	value : rpc.FixedBuffer
	[u0] = true
	static size = 33
	constructor(v : rpc.FixedBuffer) {
		this.value = v
	}
	export() : any {
		return this.value.export()
	}
	static import(a : any) : A {
		return new A(rpc.FixedBuffer.import(a, 33))
	}
	valueOf() : rpc.FixedBuffer {
		return this.value
	}
}

const u1 = Symbol()
export class B implements rpc.Exportable {
	value : A
	[u1] = true
	constructor(v : A) {
		this.value = v
	}
	export() : any {
		return this.value.export()
	}
	static import(a : any) : B {
		return new B(A.import(a))
	}
	valueOf() : A {
		return this.value
	}
}

const u2 = Symbol()
export class C implements rpc.Exportable {
	value : B
	[u2] = true
	constructor(v : B) {
		this.value = v
	}
	export() : any {
		return this.value.export()
	}
	static import(a : any) : C {
		return new C(B.import(a))
	}
	valueOf() : B {
		return this.value
	}
}

const u3 = Symbol()
export class Bozo implements rpc.Exportable {
	value : rpc.FixedBuffer
	[u3] = true
	static size = 32
	constructor(v : rpc.FixedBuffer) {
		this.value = v
	}
	export() : any {
		return this.value.export()
	}
	static import(a : any) : Bozo {
		return new Bozo(rpc.FixedBuffer.import(a, 32))
	}
	valueOf() : rpc.FixedBuffer {
		return this.value
	}
}


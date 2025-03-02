// Auto-generated to TypeScript types and interfaces using snowpack-compiler 1.0.0 (https://github.com/maxtaco/node-snowpack-compiler)
//  Input file: common.snowp

import * as rpc from 'snowpack'

const u0 = Symbol()
export class UnixTime implements rpc.Exportable {
	value : bigint
	[u0] = true
	constructor(v : bigint) {
		this.value = v
	}
	export() : any {
		return rpc.exporters.uint(this.value)
	}
	static import(a : any) : UnixTime {
		return new UnixTime(rpc.importers.uint(a))
	}
	valueOf() : bigint {
		return this.value
	}
}


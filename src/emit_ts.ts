import { Emitter } from './emit'
import { Metadata } from './main'

import {
    Blob,
    Bool,
    Enum,
    Int,
    Root,
    Text,
    Typedef,
    Uint,
    Void,
    DerivedType,
    List,
    Type,
    Struct,
    Field,
    Option,
    Variant,
    VariantCase,
    Protocol,
    Method,
    PrimitiveType,
    UniqueId,
    BaseImport,
} from './ast'

import { be64encode } from './b64'

export class TypeScriptEmitter extends Emitter {
    xCounter: number
    xSymbol: number

    emitPreamble(r: Root): void {
        const md = this.md
        this.output(
            `// Auto-generated to TypeScript types and interfaces using ` +
                `${md.pjson.name} ${md.pjson.version} (${md.pjson.repository})`
        )
        this.output(`//  Input file: ${md.infile.name}`)
        this.emptyLine()
        this.output(`import * as rpc from 'snowpack'`)
        this.emptyLine()
    }

    emitPostamble(): void {}

    emitEnum(e: Enum): void {
        this.emitStatementPremable(e)
        this.emitEnumValues(e)
        const s = this.emitUniqueSymbol()
        this.emitEnumOpen(e, s)
        this.emitEnumEnums(e)
        this.emitEnumConstructor(e)
        this.emitEnumValueOf(e)
        this.emitEnumImport(e)
        this.emitEnumExport(e)
        this.emitEnumClose(e)
    }

    emitTypedefValueOf(t: Typedef) {
        this.outputFrag(`valueOf() : `)
        t.typ.emit(this)
        this.output(` {`)
        this.tab()
        this.output('return this.value')
        this.untab()
        this.output('}')
    }

    emitEnumValueOf(e: Enum) {
        this.output(`valueOf() : number {`)
        this.tab()
        this.output('return this.value')
        this.untab()
        this.output('}')
    }

    emitEnumExport(e: Enum) {
        this.output(`export() : any {`)
        this.tab()
        this.output('return this.value')
        this.untab()
        this.output('}')
    }

    emitEnumImport(e: Enum) {
        this.output(`static import(a : any) : ${e.name} {`)
        this.tab()
        this.output(`const v = rpc.importers.enum(a, this.values)`)
        this.output(`return new ${e.name}(v)`)
        this.untab()
        this.output('}')
    }

    emitEnumConstructor(e: Enum) {
        this.output(`constructor(v : number) {`)
        this.tab()
        this.output('this.value = v')
        this.untab()
        this.output('}')
    }

    emitEnumOpen(e: Enum, unique: string) {
        this.output(`export class ${e.name} implements rpc.Exportable {`)
        this.tab()
        this.output(`[${unique}] = true`)
        this.output(`value : number`)
        this.output(`static values = ${e.name}Values`)
    }

    emitEnumEnums(e: Enum) {
        this.output(`static o = {`)
        this.tab()
        for (const f of e.values) {
            this.output(
                `${f.name} : new ${e.name}(${e.name}.values.${f.name}),`
            )
        }
        this.untab()
        this.output('}')
    }

    emitEnumClose(e: Enum) {
        this.untab()
        this.output('}')
    }

    emitEnumValues(e: Enum) {
        this.output(`enum ${e.name}Values {`)
        this.tab()
        for (const f of e.values) {
            this.output(`${f.name} = ${f.value}, `)
        }
        this.untab()
        this.output('}')
    }

    emitUniqueSymbol(): string {
        const s = this.nextUnique()
        this.output(`const ${s} = Symbol()`)
        return s
    }

    emitTypedef(t: Typedef): void {
        const s = this.emitUniqueSymbol()
        this.emitStatementPremable(t)
        this.emitTypedefOpen(t, s)
        this.emitTypedefConstructor(t)
        this.emitTypedefExport(t)
        this.emitTypedefImport(t)
        this.emitTypedefValueOf(t)
        this.emitTypedefClose(t)
    }

    emitTypedefImport(t: Typedef) {
        this.output(`static import(a : any) : ${t.name} {`)
        this.tab()
        this.outputFrag(`return new ${t.name}(`)
        t.typ.emitImport(this, 'a')
        this.output(`)`)
        this.untab()
        this.output('}')
    }

    emitTypedefExport(t: Typedef) {
        this.output(`export() : any {`)
        this.tab()
        this.outputFrag(`return `)
        t.typ.emitExport(this, 'this.value')
        this.emptyLine()
        this.untab()
        this.output('}')
    }

    emitTypedefOpen(t: Typedef, unique: string) {
        this.output(`export class ${t.name} implements rpc.Exportable {`)
        this.tab()
        this.outputFrag('value : ')
        t.typ.emit(this)
        this.emptyLine()
        this.output(`[${unique}] = true`)
        t.typ.emitSize(this)
    }

    emitTypedefConstructor(t: Typedef) {
        this.outputFrag(`constructor(v : `)
        t.typ.emit(this)
        this.output(`) {`)
        this.tab()
        this.output(`this.value = v`)
        this.untab()
        this.output('}')
    }

    emitTypedefClose(t: Typedef) {
        this.untab()
        this.output('}')
    }

    emitStruct(s: Struct): void {
        const u = this.emitUniqueSymbol()
        this.emitStatementPremable(s)
        this.emitStructOpen(s)
        this.emitStructFields(s, u)
        this.emitStructConstructor(s)
        this.emitStructExport(s)
        this.emitStructImport(s)
        this.emitStructCodec(s)
        this.emitTypeId(s.id, s.name)
        this.emitStructClose(s)
    }

    emitTypeId(i: UniqueId | null, className: string): void {
        if (!i) {
            return
        }
        this.output('static id() : rpc.TypeUniqueID {')
        this.tab()
        this.output(`return new rpc.Uint64("${i.id}") as rpc.TypeUniqueID`)
        this.untab()
        this.output('}')
        this.output('id() : rpc.TypeUniqueID {')
        this.tab()
        this.output(`return ${className}.id()`)
        this.untab()
        this.output('}')
    }

    emitStructCodec(s: Struct): void {
        this.output('encode(enc : rpc.encoder) : Uint8Array {')
        this.tab()
        this.output('return enc(this.export())')
        this.untab()
        this.output('}')
        this.output(
            `static decode(dec : rpc.decoder, a : Uint8Array) : ${s.name} {`
        )
        this.tab()
        this.output(`return ${s.name}.import(dec(a))`)
        this.untab()
        this.output('}')
    }

    emitStructImport(s: Struct): void {
        this.output(`static import(obj: any[]) : ${s.name} {`)
        this.tab()
        this.output(`obj = rpc.extend(obj, ${s.maxPosition() + 1})`)
        for (const f of s.fields) {
            this.outputFrag(`const ${f.name} = `)
            f.type.emitImport(this, `obj[${f.position}]`)
            this.emptyLine()
        }
        this.output(`return new ${s.name}(`)
        this.tab()
        for (const f of s.fields) {
            const last = f === s.fields[s.fields.length - 1]
            this.output(`${f.name}${last ? '' : ','}`)
        }
        this.untab()
        this.output(')')
        this.untab()
        this.output('}')
    }

    emitStructExport(s: Struct): void {
        this.output('export() : any[] {')
        this.tab()
        this.output('return [')
        this.tab()
        let i = 0
        let j = 0
        for (const f of s.fields) {
            while (i < f.position) {
                this.output('null,')
                i++
            }
            f.type.emitExport(this, `this.${f.name}`)
            if (j < s.fields.length - 1) {
                this.outputFrag(',')
            }
            this.emptyLine()
            i++
            j++
        }
        this.untab()
        this.output(']')
        this.untab()
        this.output('}')
    }

    emitStructConstructor(s: Struct): void {
        this.outputFrag(`constructor(`)
        this.emitStructConstructorArgs(s)
        this.output(`) {`)
        this.tab()
        for (const f of s.fields) {
            this.output(`this.${f.name} = ${f.name}`)
        }
        this.untab()
        this.output(`}`)
    }

    emitStructConstructorArgs(s: Struct): void {
        let first = true
        for (const f of s.fields) {
            if (!first) {
                this.outputFrag(', ')
            }
            first = false
            this.outputFrag(`${f.name}: `)
            f.type.emit(this)
        }
    }

    emitStructVisibleField(f: Field): void {
        this.outputFrag(`${f.name}: `)
        f.type.emit(this)
        this.emptyLine()
    }

    emitStructOpen(s: Struct): void {
        this.output(
            `export class ${s.name} implements rpc.${
                s.id ? 'Cryptoable' : 'Exportable'
            }{`
        )
        this.tab()
    }

    emitStructClose(s: Struct): void {
        this.untab()
        this.output('}')
    }

    emitStructFields(s: Struct, u: string): void {
        for (const f of s.fields) {
            this.emitStructVisibleField(f)
        }
        this.output(`[${u}] = true`)
    }

    exportSymbol(s: string): string {
        return s
    }

    emitVariant(v: Variant): void {
        this.emitStatementPremable(v)
        this.emitVariantOpen(v)
        this.emitVariantFields(v)
        this.emitVariantConstructor(v)
        this.emitVariantSwitchGetter(v)
        this.emitVariantDataGetter(v)
        this.emitVariantExport(v)
        this.emitVariantImport(v)
        this.emitVariantConstructors(v)
        this.emitTypeId(v.id, v.name)
        this.emitVariantClose(v)
    }

    emitVariantDataGetter(v: Variant): void {
        v.cases.forEach((c) => {
            if (typeof c.position != 'number') {
                return
            }
            const dat = this.variantCasePositionToVariable(c.position)
            if (c.labels.length === 0) {
                this.outputFrag(`get def() : `)
                c.type.emit(this)
                this.output(' {')
                this.tab()
                this.output(`if (this.${dat} === undefined) {`)
                this.tab()
                this.output(
                    `throw new rpc.VariantError("default case not set")`
                )
                this.untab()
                this.output('}')
                this.output(`return this.${dat}`)
                this.untab()
                this.output('}')
            } else {
                c.labels.forEach((l) => {
                    const mn = l.getterMethodName(this)
                    this.outputFrag(`get ${mn}() : `)
                    c.type.emit(this)
                    this.output(' {')
                    this.tab()
                    this.output(`if (this.${dat} === undefined) {`)
                    this.tab()
                    this.output(
                        `throw new rpc.VariantError("${mn} case not set")`
                    )
                    this.untab()
                    this.output('}')
                    this.output(`return this.${dat}`)
                    this.untab()
                    this.output('}')
                })
            }
        })
    }

    emitVariantSwitchGetter(v: Variant): void {
        this.outputFrag(`get ${v.switchVariable}() : `)
        v.switchType.emit(this)
        this.output(' {')
        this.tab()
        this.output(`switch (this._${v.switchVariable}.valueOf()) {`)
        this.tab()
        for (const c of v.cases) {
            if (c.labels.length === 0) {
                this.output(`default:`)
            } else {
                for (const l of c.labels) {
                    this.output(`case ${l.caseLabel(this, v.switchType)}:`)
                }
            }
            this.tab()
            if (typeof c.position === 'number') {
                const f = this.variantCasePositionToVariable(c.position)
                this.output(`if (this.${f} === undefined) {`)
                this.tab()
                this.output(
                    `throw new rpc.VariantError('unexpected nil case for ${f}')`
                )
                this.untab()
                this.output('}')
            }
            this.output('break')
            this.untab()
        }
        this.untab()
        this.output('}')
        this.output(`return this._${v.switchVariable}`)
        this.untab()
        this.output('}')
    }

    emitVariantConstructors(v: Variant) {
        for (const c of v.cases) {
            this.emitVariantConstructorCase(v, c)
        }
    }

    emitVariantConstructorCase(v: Variant, c: VariantCase) {
        const labels: { constructorName: string; caseLabel: string }[] =
            c.labels.length === 0
                ? [
                      {
                          constructorName: 'newWithDefault',
                          caseLabel: v.switchVariable,
                      },
                  ]
                : c.labels.map((x) => ({
                      constructorName: x.constructorName(this, v.name),
                      caseLabel: x.instanceConstructor(this, v.switchType),
                  }))

        labels.forEach(({ constructorName, caseLabel }) => {
            this.outputFrag(`static ${constructorName}(`)
            let didOutput = false
            if (c.labels.length === 0) {
                this.outputFrag(`${v.switchVariable}: `)
                v.switchType.emit(this)
                didOutput = true
            }
            if (c.hasData()) {
                if (didOutput) {
                    this.outputFrag(', ')
                }
                this.outputFrag('data: ')
                c.type.emit(this)
            }
            this.output(`) : ${v.name} {`)
            this.tab()
            this.output(`const ret = new ${v.name}(${caseLabel})`)
            if (typeof c.position === 'number') {
                this.output(
                    `ret.${this.variantCasePositionToVariable(
                        c.position
                    )} = data`
                )
            }
            this.output('return ret')
            this.untab()
            this.output('}')
        })
    }

    emitVariantImport(v: Variant): void {
        this.output(`static import(obj: any) : ${v.name} {`)
        this.tab()
        this.output(
            `if (typeof(obj) !== 'object' || !Array.isArray(obj) || obj.length !== 2) {`
        )
        this.tab()
        this.output(`throw new rpc.VariantError('invalid variant')`)
        this.untab()
        this.output(`}`)
        this.output(`const [ rawTag, data ] = obj`)
        this.outputFrag(`const tag = `)
        v.switchType.emitImport(this, 'rawTag')
        this.emptyLine()
        this.output(`const ret = new ${v.name}(tag)`)
        v.cases.forEach((c) => {
            if (c.position != null && c.position != undefined) {
                const k = be64encode(c.position)
                this.outputFrag(
                    `ret.${this.variantCasePositionToVariable(
                        c.position
                    )} = data["${k}"] ? `
                )
                c.type.emitImport(this, `data["${k}"]`)
                this.output(' : undefined')
            }
        })
        this.output(`return ret`)
        this.untab()
        this.output('}')
    }

    emitVariantExport(v: Variant): void {
        this.output('export() : any {')
        this.tab()
        this.output('const tmp : { [k: string]: any }  = {}')
        v.cases.forEach((c) => {
            if (c.position != null && c.position != undefined) {
                const k = be64encode(c.position)
                const pos = this.variantCasePositionToVariable(c.position)
                this.outputFrag(`if (!!this.${pos}) { tmp["${k}"] = `)
                c.type.emitExport(this, `this.${pos}`)
                this.output(' }')
            }
        })
        this.outputFrag(`return [ `)
        v.switchType.emitExport(this, `this._${v.switchVariable}`)
        this.output(`, tmp ]`)
        this.untab()
        this.output('}')
    }

    emitVariantOpen(v: Variant) {
        this.output(
            `export class ${v.name} implements rpc.${
                v.id ? 'Cryptoable' : 'Exportable'
            } {`
        )
        this.tab()
    }

    emitVariantFields(v: Variant) {
        this.outputFrag(`_${v.switchVariable} : `)
        v.switchType.emit(this)
        this.emptyLine()
        v.cases.forEach((c) => {
            this.emitVariantCase(v, c)
        })
    }

    emitVariantConstructor(v: Variant) {
        this.outputFrag(`constructor(${v.switchVariable} : `)
        v.switchType.emit(this)
        this.output(`) {`)
        this.tab()
        this.output(`this._${v.switchVariable} = ${v.switchVariable}`)
        this.untab()
        this.output(`}`)
    }

    emitVariantCase(v: Variant, c: VariantCase) {
        if (c.position === undefined || c.position === null) {
            return
        }
        this.outputFrag(`${this.variantCasePositionToVariable(c.position)} : `)
        c.type.emit(this)
        this.outputFrag(` | undefined`)
        this.emptyLine()
    }

    emitVariantClose(v: Variant) {
        this.untab()
        this.output('}')
    }

    emitProtocol(p: Protocol): void {
        this.emitProtocolId(p)
        this.emitMethodsArgs(p)
        this.emitServerInterface(p)
        this.emitErrorWrapperType(p)
        this.emitErrorUnwrapperType(p)
        this.emitServerWrapError(p)
        this.emitClient(p)
        this.emitServerProtocol(p)
    }

    emitServerProtocol(p: Protocol): void {
        this.output(
            `export function ${p.name}Protocol(i : ${p.name}Interface) : rpc.Protocol {`
        )
        this.tab()
        this.output(`const ret = {`)
        this.tab()
        this.output(`methods: new Map<rpc.MethodID, rpc.MethodDescription>(),`)
        this.output(`id : ${p.name}ProtocolID,`)
        this.output(`name : '${p.name}',`)
        this.output(`errorWrapper : i.errorWrapper,`)
        this.untab()
        this.output(`}`)
        p.methods.forEach((m) => {
            this.emitServerProtocolMethod(p, m)
        })
        this.output('return ret')
        this.untab()
        this.output(`}`)
    }

    emitServerProtocolMethod(p: Protocol, m: Method): void {
        this.output(`ret.methods.set(rpc.newMethodID(${m.position}), {`)
        this.tab()
        this.output(`name : '${m.name}',`)
        this.output(`handler : async (varg : any[]) => {`)
        this.tab()
        let voidArg = false
        if (m.arg.length === 0) {
            voidArg = true
        } else if (m.singleArg()) {
            this.output(`varg = rpc.extend(varg, 1)`)
            this.output(`const [ arg ] = varg`)
            this.outputFrag(`const iarg = `)
            m.arg[0].type.emitImport(this, 'arg')
            this.emptyLine()
        } else {
            this.output(`const iarg = ${m.makeArgName(this)}.import(varg)`)
        }
        if (!m.res.isVoid()) {
            this.outputFrag(`const ret = `)
        }
        this.outputFrag(`await i.${m.name}(`)
        if (!voidArg) {
            this.outputFrag(`iarg`)
        }
        this.output(')')
        if (m.res.isVoid()) {
            this.output('return')
        } else {
            this.outputFrag(`return `)
            m.res.emitExport(this, 'ret')
            this.emptyLine()
        }
        this.untab()
        this.output('},')
        this.untab()
        this.output('})')
    }

    emitClientMakeErrorUnwrapper(p: Protocol): void {
        this.output(`makeErrorUnwrapper() : (a : any) => Error | null {`)
        this.tab()
        this.outputFrag(`return (a : any) => this.eu(`)
        p.pm.etype.emit(this)
        this.output('.import(a))')
        this.untab()
        this.output(`}`)
    }

    emitClient(p: Protocol): void {
        this.output(`export class ${p.name}Client {`)
        this.tab()
        this.output(`private cli: rpc.ClientInterface`)
        this.output('private eu: rpc.ErrorUnwrapper')
        this.output(
            `constructor(cli: rpc.ClientInterface, eu: rpc.ErrorUnwrapper) {`
        )
        this.tab()
        this.output(`this.cli = cli`)
        this.output(`this.eu = eu`)
        this.untab()
        this.output(`}`)
        this.emitClientMakeErrorUnwrapper(p)
        p.methods.forEach((m) => {
            this.emitClientMethod(p, m)
        })
        this.untab()
        this.output(`}`)
    }

    emitClientMethodArg(m: Method): void {
        if (m.arg.length === 0) {
            return
        }
        if (m.singleArg()) {
            this.outputFrag(`s : `)
            m.arg[0].type.emit(this)
            return
        }
        this.outputFrag(`arg : ${m.makeArgName(this)}`)
    }

    emitClientMethod(p: Protocol, m: Method): void {
        this.outputFrag(`async ${m.name}(`)
        this.emitClientMethodArg(m)
        this.outputFrag(`) : Promise<`)
        m.res.emit(this)
        this.output(`> {`)
        this.tab()
        if (m.arg.length === 0) {
            this.output(`const exportedArg : any[] = []`)
        } else if (m.singleArg()) {
            this.outputFrag(`const exportedArg = [`)
            m.arg[0].type.emitExport(this, 's')
            this.output(`]`)
        } else {
            this.output(`const exportedArg = arg.export()`)
        }
        this.output(`const ret = await this.cli.call(`)
        this.tab()
        this.output(`rpc.newProtocolUniqueID("${p.id.id}"),`)
        this.output(`rpc.newMethodID(${m.position}),`)
        this.output(`exportedArg,`)
        this.output('this.makeErrorUnwrapper()')
        this.untab()
        this.output(')')
        this.outputFrag(`return `)
        m.res.emitImport(this, 'ret')
        this.emptyLine()
        this.untab()
        this.output(`}`)
    }

    emitErrorWrapperType(p: Protocol): void {
        this.outputFrag(
            `export type ${p.name}ErrorWrapper = (e : Error | null) => `
        )
        p.pm.etype.emit(this)
        this.emptyLine()
    }
    emitErrorUnwrapperType(p: Protocol): void {
        this.outputFrag(`export type ${p.name}ErroUnWrapper = (s : `)
        p.pm.etype.emit(this)
        this.output(`) => Error | null`)
        this.emptyLine()
    }

    emitServerWrapError(p: Protocol): void {
        this.output(
            `export function ${p.name}MakeGenericErrorWrapper(f : ${p.name}ErrorWrapper) : (e : Error | null) => any {`
        )
        this.tab()
        this.output(
            `return (e: Error | null) => (e ? f(e)${
                p.pm.etype.isPrimitiveType() ? '' : '.export()'
            }: null)`
        )
        this.untab()
        this.output('}')
    }

    emitServerInterfaceMethod(p: Protocol, m: Method): void {
        this.emitDecorators(m.decorators)
        this.outputFrag(`${m.name}(`)
        if (m.arg.length > 0) {
            this.outputFrag(`arg: `)
            if (m.arg.length === 1 && m.arg[0].position === 0) {
                m.arg[0].type.emit(this)
            } else {
                this.outputFrag(m.makeArgName(this))
            }
        }
        this.outputFrag(`) : Promise<`)
        m.res.emit(this)
        this.output('>')
    }

    emitServerInterface(p: Protocol): void {
        this.emitStatementPremable(p)
        this.output(`export interface ${p.name}Interface {`)
        this.tab()
        p.methods.forEach((m) => {
            this.emitServerInterfaceMethod(p, m)
        })
        this.outputFrag('errorWrapper(arg: Error | null) : ')
        p.pm.etype.emit(this)
        this.emptyLine()
        this.untab()
        this.output('}')
    }

    protocolId(p: Protocol): string {
        return p.name + 'ProtocolID'
    }

    emitProtocolId(p: Protocol): void {
        this.output(
            `export const ${this.protocolId(p)} = rpc.newProtocolUniqueID("${
                p.id.id
            }")`
        )
    }

    getterMethodNameForConstant(name: string): string {
        return name
    }
    getterMethodNameForBool(b: boolean): string {
        return b ? 'bTtrue' : 'bFalse'
    }
    getterMethodNameForInt(i: number): string {
        return i < 0 ? `n${-i}` : `p${i}`
    }
    constructorNameForConstant(variantName: string, caseName: string): string {
        const firstUpper = (s: string) => s[0].toUpperCase() + s.slice(1)
        return 'newWith' + firstUpper(caseName)
    }
    constructorNameForBool(variantName: string, caseName: boolean): string {
        return this.constructorNameForConstant(
            variantName,
            caseName ? 'true' : 'false'
        )
    }
    constructorNameForInt(variantName: string, caseName: number): string {
        return this.constructorNameForConstant(
            variantName,
            this.getterMethodNameForInt(caseName)
        )
    }
    emitExportPrimitiveType(p: PrimitiveType, params: string | null): void {
        this.outputFrag(params || 'null')
    }
    emitExportUint(u: Uint, params: string | null): void {
        this.outputFrag(params ? `rpc.exporters.uint(${params})` : 'null')
    }
    emitExportInt(u: Uint, params: string | null): void {
        this.outputFrag(params ? `rpc.exporters.int(${params})` : 'null')
    }
    emitExportDerivedType(p: PrimitiveType, params: string | null): void {
        this.outputFrag(params ? `${params}.export()` : 'null')
    }
    nextX(): string {
        return `x${this.xCounter++}`
    }
    nextUnique(): string {
        return `u${this.xSymbol++}`
    }
    emitExportList(l: List, params: string | null): void {
        if (!params) {
            this.outputFrag('[]')
        } else {
            const x = this.nextX()
            this.outputFrag(`${params}.map((${x}) => (`)
            l.typ.emitExport(this, x)
            this.outputFrag(`))`)
        }
    }

    emitExportBlob(b: Blob, params: string | null): void {
        if (!params) {
            this.outputFrag('null')
        } else if (b.count === undefined || b.count === null) {
            this.outputFrag(params)
        } else {
            this.outputFrag(`${params}.export()`)
        }
    }

    emitExportOption(t: Type, params: string | null): void {
        if (!params) {
            this.outputFrag('null')
        } else {
            this.outputFrag(`(${params} ? (`)
            t.emitExport(this, params)
            this.outputFrag(`) : null)`)
        }
    }
    emitImportOption(t: Type, params: string | null): void {
        if (!params) {
            this.outputFrag('null')
        } else if (t.isPrimitiveType()) {
            this.outputFrag(params)
        } else {
            this.outputFrag(`(${params} ? (`)
            t.emitImport(this, params)
            this.outputFrag(`) : null)`)
        }
    }
    emitImportPrimitiveType(p: PrimitiveType, params: string | null): void {
        this.outputFrag(params || 'null')
    }
    emitImportUint(u: Uint, params: string | null): void {
        this.outputFrag(`rpc.importers.uint(${params || 'null'})`)
    }
    emitImportInt(u: Uint, params: string | null): void {
        this.outputFrag(`rpc.importers.int(${params || 'null'})`)
    }
    emitImportText(u: Uint, params: string | null): void {
        this.outputFrag(`rpc.importers.string(${params || 'null'})`)
    }
    emitImportBool(b: Bool, params: string | null): void {
        this.outputFrag(`rpc.importers.bool(${params || 'null'})`)
    }
    emitImportBlob(b: Blob, params: string | null): void {
        if (b.count === undefined || b.count == null) {
            this.outputFrag(`rpc.importers.blob(${params || 'null'})`)
        } else {
            this.outputFrag(
                `rpc.FixedBuffer.import(${params || 'null'}, ${b.count})`
            )
        }
    }
    emitImportList(l: List, params: string | null): void {
        if (!params) {
            this.outputFrag('[]')
        } else {
            const x = this.nextX()
            this.outputFrag(`${params}.map((${x} : any) => (`)
            l.typ.emitImport(this, x)
            this.outputFrag(`))`)
        }
    }
    emitImportDerivedType(d: DerivedType, params: string | null): void {
        if (!params) {
            this.outputFrag('null')
        } else {
            d.emit(this)
            this.outputFrag(`.import(${params})`)
        }
    }
    methodArgName(methodName: string, argName: string | null): string {
        return argName ? argName : methodName + 'Arg'
    }
    emitVoid(v: Void): void {
        this.outputFrag('void')
    }
    emitUint(u: Uint): void {
        this.outputFrag('bigint')
    }
    emitInt(i: Int): void {
        this.outputFrag('bigint')
    }
    emitText(t: Text): void {
        this.outputFrag('string')
    }
    emitBlob(b: Blob): void {
        if (b.count) {
            this.outputFrag(`rpc.FixedBuffer`)
        } else {
            this.outputFrag('Uint8Array')
        }
    }
    emitBool(b: Bool): void {
        this.outputFrag('boolean')
    }
    emitDerivedType(t: DerivedType): void {
        if (t.importedFrom) {
            this.outputFrag(`${t.importedFrom}.`)
        }
        this.outputFrag(t.name)
    }
    emitDerivedTypeInternal(t: DerivedType): void {
        this.outputFrag('any[]')
    }
    emitList(l: List): void {
        l.typ.emit(this)
        this.outputFrag('[]')
    }
    emitListInternal(l: List): void {
        throw new Error('Method not implemented.')
    }
    emitOption(o: Option): void {
        o.type.emit(this)
        this.outputFrag(' | null')
    }
    emitOptionInternal(o: Option): void {
        throw new Error('Method not implemented.')
    }
    emitNil(): void {
        this.output('null')
    }
    emitBlobToBytes(nm: string): void {
        this.outputFrag(nm)
    }
    emitBytesDowncast(klass: string, varName: string): void {
        this.outputFrag('super.Bytes()')
    }

    toEnumConstant(t: Type, name: string): string {
        const tn = t.enumPrefix()
        return `${tn}.values.${name}`
    }

    toEnumConstructor(t: Type, name: string): string {
        const tn = t.enumPrefix()
        return `new ${tn}(${tn}.values.${name})`
    }

    emitImportLibrary(i: BaseImport): void {
        super.storeImport(i)
        if (i.isGeneric() || i.isTs()) {
            this.output(`import * as ${i.name} from ${i.path}`)
        }
    }

    emitTypedefBlobSize(b: Blob): void {
        if (b.count) {
            this.output(`static size = ${b.count}`)
        }
    }

    emitFutureLink(parent: Type, child: string): void {
        return
    }

    constructor(o: Metadata) {
        super(o)
        this.xCounter = 0
        this.xSymbol = 0
    }
}

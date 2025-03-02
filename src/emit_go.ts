import { Emitter } from './emit'
import { Metadata } from './main'
import { Language } from './constants'

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
    Inventory,
    UniqueId,
    BaseImport,
} from './ast'

import { be64encode } from './b64'

export class GoEmitter extends Emitter {
    constructor(o: Metadata) {
        super(o)
    }

    emitPreamble(r: Root): void {
        const md = this.md
        this.output(
            `// Auto-generated to Go types and interfaces using ` +
                `${md.pjson.name} ${md.pjson.version} (${md.pjson.repository})`
        )
        this.output(`//  Input file: ${md.infile.name}`)
        this.emptyLine()
        this.output(`package ${md.package}`)
        this.emptyLine()
        this.output(`import (`)
        this.tab()
        const inventory = new Inventory()
        r.doInventory(inventory)

        if (inventory.rpc || inventory.variant) {
            this.output('"errors"')
        }
        if (inventory.variant) {
            this.output('"fmt"')
        }
        if (inventory.rpc) {
            this.output('"context"')
            this.output('"time"')
        }

        if (
            inventory.rpc ||
            inventory.strct ||
            inventory.variant ||
            inventory.typedef
        ) {
            this.output('"ne43.pub/go-snowpack-rpc/rpc"')
        }
        this.untab()
        this.output(')')
        this.emptyLine()
    }

    exportSymbol(s: string): string {
        if (s.length === 0) {
            return s
        }
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    emitNil(): void {
        this.outputFrag('nil')
    }

    emitBlobToBytes(nm: string): void {
        this.outputFrag(`(${nm})[:]`)
    }

    emitBytesDowncast(klass: string, varName: string): void {
        this.outputFrag(`((${klass})(${varName})).Bytes()`)
    }

    privateSymbol(s: string): string {
        if (s.length === 0) {
            return s
        }
        return s.charAt(0).toLowerCase() + s.slice(1)
    }

    thisVariableName(s: string): string {
        return s.charAt(0).toLowerCase()
    }

    internalStructName(n: string): string {
        return n + 'Internal__'
    }

    switchInternalStructType(n: string): string {
        return n + 'InternalSwitch__'
    }

    emitEnumConstants(e: Enum): void {
        const t = this.exportSymbol(e.name)
        this.output('const (')
        this.tab()
        for (const v of e.values) {
            this.output(`${t}_${v.name} ${t} = ${v.value}`)
        }
        this.untab()
        this.output(')')
    }

    getterMethodNameForConstant(name: string): string {
        return this.exportSymbol(this.snakeToCamelCase(name))
    }

    constructorNameForConstant(variantName: string, caseName: string): string {
        return ['New', variantName, 'With', this.snakeToCamelCase(caseName)]
            .map((s) => this.exportSymbol(s))
            .join('')
    }

    constructorNameForInt(variantName: string, caseName: number): string {
        return this.constructorNameForConstant(
            variantName,
            this.getterMethodNameForInt(caseName)
        )
    }
    constructorNameForBool(variantName: string, caseName: boolean): string {
        return this.constructorNameForConstant(variantName, caseName.toString())
    }

    getterMethodNameForBool(b: boolean): string {
        return b ? 'True' : 'False'
    }
    getterMethodNameForInt(n: number): string {
        return n >= 0 ? `P${n}` : `N${-n}`
    }
    snakeToCamelCase(s: string): string {
        return s
            .toLowerCase()
            .split('_')
            .map((x) => this.exportSymbol(x))
            .join('')
    }

    emitEnumMap(e: Enum): void {
        const t = this.exportSymbol(e.name)
        this.output(`var ${t}Map = map[string]${t}{`)
        this.tab()
        for (const v of e.values) {
            this.output(`"${v.name}": ${v.value},`)
        }
        this.untab()
        this.output('}')
    }

    emitEnumRevMap(e: Enum): void {
        const t = this.exportSymbol(e.name)
        this.output(`var ${t}RevMap = map[${t}]string{`)
        this.tab()
        for (const v of e.values) {
            this.output(`${v.value}: "${v.name}",`)
        }
        this.untab()
        this.output('}')
    }

    emitEnumTypedef(e: Enum): void {
        this.output(
            `type ${this.internalStructName(e.name)} ${this.exportSymbol(
                e.name
            )}`
        )
    }
    emitEnumImport(e: Enum): void {
        const tv = this.thisVariableName(e.name)
        const es = this.exportSymbol(e.name)
        const isn = this.internalStructName(e.name)
        this.output(`func (${tv} ${isn}) Import() ${es} {`)
        this.tab()
        this.output(`return ${es}(${tv})`)
        this.untab()
        this.output('}')
    }

    emitEnumExport(e: Enum): void {
        const tv = this.thisVariableName(e.name)
        const es = this.exportSymbol(e.name)
        const isn = this.internalStructName(e.name)
        this.output(`func (${tv} ${es}) Export() *${isn} {`)
        this.tab()
        this.output(`return ((*${isn})(&${tv}))`)
        this.untab()
        this.output('}')
    }

    emitEnum(e: Enum): void {
        const t = this.exportSymbol(e.name)
        this.emitStatementPremable(e)
        this.output(`type ${t} int`)
        this.emptyLine()
        this.emitEnumConstants(e)
        this.emitEnumMap(e)
        this.emitEnumRevMap(e)
        this.emitEnumTypedef(e)
        this.emitEnumImport(e)
        this.emitEnumExport(e)
    }

    emitType(t: Type): void {
        t.emit(this)
    }
    emitTypeInternal(t: Type): void {
        t.emitInternal(this)
    }

    emitTypedefExport(t: Typedef): void {
        const nm = this.exportSymbol(t.name)
        const tv = this.thisVariableName(t.name)
        const inm = this.internalStructName(t.name)
        this.output(`func (${tv} ${nm}) Export() *${inm} {`)
        this.tab()
        this.outputFrag('tmp := ((')
        t.typ.emit(this)
        this.output(`)(${tv}))`)
        this.outputFrag(`return ((*${inm})(`)
        t.typ.emitExport(this, 'tmp')
        this.output('))')
        this.untab()
        this.output('}')
    }

    emitTypedefImport(t: Typedef): void {
        const nm = this.exportSymbol(t.name)
        const tv = this.thisVariableName(t.name)
        const inm = this.internalStructName(t.name)
        this.output(`func (${tv} ${inm}) Import() ${nm} {`)
        this.tab()
        this.outputFrag(`tmp := (`)
        t.typ.emitInternal(this)
        this.output(`)(${tv})`)
        this.outputFrag(`return ${nm}(`)
        t.typ.emitImport(this, '&tmp')
        this.output(')')
        this.untab()
        this.output('}')
    }

    emitTypedefInternal(t: Typedef): void {
        this.outputFrag(`type ${this.internalStructName(t.name)} `)
        t.typ.emitInternal(this)
        this.emptyLine()
    }

    emitBytesTypedef(t: Typedef): void {
        const nm = this.exportSymbol(t.name)
        const tv = this.thisVariableName(t.name)
        this.output(`func (${tv} ${nm}) Bytes() []byte {`)
        this.tab()
        this.outputFrag('return ')
        t.typ.emitBytes(this, tv)
        this.emptyLine()
        this.untab()
        this.output('}')
    }

    emitTypedef(t: Typedef): void {
        const nm = this.exportSymbol(t.name)
        this.emitStatementPremable(t)
        this.outputFrag(`type ${nm} `)
        this.emitType(t.typ)
        this.emptyLine()
        this.emitTypedefInternal(t)
        this.emitTypedefExport(t)
        this.emitTypedefImport(t)
        this.emptyLine()
        this.emitCodec(t.name)
        this.emitId(t.name, t.id)
        this.emitBytesTypedef(t)

        // If we've typedef'ed to a Future(Foo) type, then we need to link
        // the Unique IDs of this child object to the parent's.
        t.typ.emitFutureLink(this, t.name)
    }

    emitBool(_: Bool): void {
        this.outputFrag('bool')
    }
    emitInt(_: Int): void {
        this.outputFrag('int64')
    }
    emitUint(_: Uint): void {
        this.outputFrag('uint64')
    }
    emitBlob(b: Blob): void {
        const cnt = typeof b.count === 'number' ? b.count.toString() : ''
        this.outputFrag(`[${cnt}]byte`)
    }
    emitText(_: Text): void {
        this.outputFrag('string')
    }
    derivedPrefix(t: DerivedType): string | null {
        if (
            t.importedFrom &&
            this.imports.get(t.importedFrom)?.m.has(Language.Go)
        ) {
            return t.importedFrom + '.'
        }
        return null
    }
    emitDerivedPrefix(t: DerivedType): void {
        const prfx = this.derivedPrefix(t)
        if (prfx) {
            this.outputFrag(prfx)
        }
    }
    emitDerivedType(t: DerivedType): void {
        this.emitDerivedPrefix(t)
        this.outputFrag(t.name)
    }
    emitDerivedTypeInternal(t: DerivedType): void {
        this.emitDerivedPrefix(t)
        this.outputFrag(this.internalStructName(t.name))
    }
    emitVoid(_: Void): void {}
    emitList(l: List): void {
        this.outputFrag(`[]`)
        this.emitType(l.typ)
    }
    emitListInternal(l: List): void {
        this.outputFrag(`[](`)
        if (!l.typ.isPrimitiveType()) {
            this.outputFrag('*')
        }
        this.emitTypeInternal(l.typ)
        this.outputFrag(')')
    }
    emitStructVisibleField(f: Field): void {
        const typ = this.exportSymbol(f.name)
        this.outputFrag(typ + ' ')
        f.type.emit(this)
        this.emptyLine()
    }
    emitStructInternalField(f: Field): void {
        const typ = this.exportSymbol(f.name)
        this.outputFrag(typ + ' ')
        f.type.makeOptional().emitInternal(this)
        this.emptyLine()
    }

    emitStructVisible(s: Struct): void {
        const t = this.exportSymbol(s.name)
        this.output(`type ${t} struct {`)
        this.tab()
        for (const f of s.fields) {
            this.emitStructVisibleField(f)
        }
        this.untab()
        this.output('}')
    }
    emitStructInternal(s: Struct): void {
        const t = this.internalStructName(s.name)
        this.output(`type ${t} struct {`)
        this.tab()
        this.emitMsgpackStructOpts()
        let i = 0
        for (const f of s.fields) {
            while (i < f.position) {
                this.output(`Deprecated${i} *struct{}`)
                i++
            }
            this.emitStructInternalField(f)
            i++
        }
        this.untab()
        this.output('}')
    }

    emitStructImport(s: Struct): void {
        const i = this.internalStructName(s.name)
        const o = this.exportSymbol(s.name)
        const v = this.thisVariableName(s.name)
        this.output(`func (${v} ${i}) Import() ${o} {`)
        this.tab()
        this.output(`return ${o} {`)
        this.tab()
        for (const f of s.fields) {
            const fn = this.exportSymbol(f.name)
            this.outputFrag(`${fn}: `)
            f.type.emitImport(this, `${v}.${fn}`)
            this.output(',')
        }
        this.untab()
        this.output('}')
        this.untab()
        this.output('}')
    }

    emitExportUint(u: Uint, params: string | null): void {
        this.emitExportPrimitiveType(u, params)
    }
    emitExportInt(u: Uint, params: string | null): void {
        this.emitExportPrimitiveType(u, params)
    }

    emitExportPrimitiveType(p: PrimitiveType, params: string | null): void {
        // optimization
        if (params != null) {
            this.outputFrag(`&${params}`)
            return
        }
        this.outputFrag('(func (x ')
        p.emitInternal(this)
        this.outputFrag(') *')
        p.emit(this)
        this.output(' {')
        this.tab()
        this.output('return &x')
        this.untab()
        this.outputFrag('})')
    }

    outputParamsMaybe(params: string | null): void {
        if (params !== null) {
            this.outputFrag(`(${params})`)
        }
    }

    emitImportPrimitiveType(p: PrimitiveType, params: string | null) {
        this.emitImportPreamble(p)
        this.output('return *x')
        this.untab()
        this.outputFrag('})')
        this.outputParamsMaybe(params)
    }

    emitExportDerivedType(d: DerivedType, params: string | null): void {
        // Optimization
        if (params !== null) {
            this.outputFrag(`${params}.Export()`)
            return
        }
        this.outputFrag('(func (x ')
        d.emit(this)
        this.outputFrag(') *')
        d.emitInternal(this)
        this.output(' {')
        this.tab()
        this.output('return x.Export()')
        this.untab()
        this.outputFrag('})')
    }

    emitImportPreamble(t: Type): void {
        this.emitImportSignature(t)
        this.output('if x == nil {')
        this.tab()
        this.output('return ret')
        this.untab()
        this.output('}')
    }

    emitImportSignature(t: Type): void {
        this.outputFrag('(func (x *')
        t.emitInternal(this)
        this.outputFrag(') (ret ')
        t.emit(this)
        this.output(') {')
        this.tab()
    }

    emitImportDerivedType(d: DerivedType, params: string | null): void {
        this.emitImportPreamble(d)
        this.output('return x.Import()')
        this.untab()
        this.outputFrag('})')
        this.outputParamsMaybe(params)
    }

    emitExportList(l: List, params: string | null): void {
        this.outputFrag('(func (x ')
        l.emit(this)
        this.outputFrag(') *')
        l.emitInternal(this)
        this.output(' {')
        this.tab()
        this.output('if len(x) == 0 {')
        this.tab()
        this.output('return nil')
        this.untab()
        this.output('}')
        this.outputFrag('ret := make(')
        l.emitInternal(this)
        this.output(', len(x))')
        this.output('for k,v := range x {')
        this.tab()
        this.outputFrag('ret[k] = ')
        if (l.typ.isPrimitiveType()) {
            this.outputFrag('v')
        } else {
            l.typ.emitExport(this, 'v')
        }
        this.emptyLine()
        this.untab()
        this.output('}')
        this.output('return &ret')
        this.untab()
        this.outputFrag('})')
        this.outputParamsMaybe(params)
    }

    emitImportUint(u: Uint, params: string | null): void {
        this.emitImportPrimitiveType(u, params)
    }
    emitImportInt(i: Int, params: string | null): void {
        this.emitImportPrimitiveType(i, params)
    }
    emitImportText(t: Text, params: string | null): void {
        this.emitImportPrimitiveType(t, params)
    }
    emitImportBool(b: Bool, params: string | null): void {
        this.emitImportPrimitiveType(b, params)
    }
    emitImportBlob(b: Blob, params: string | null): void {
        this.emitImportPrimitiveType(b, params)
    }
    emitImportList(l: List, params: string | null): void {
        this.emitImportSignature(l)
        this.output('if x == nil || len(*x) == 0 {')
        this.tab()
        this.output('return nil')
        this.untab()
        this.output('}')
        this.outputFrag('ret = make(')
        l.emit(this)
        this.output(', len(*x))')
        this.output('for k,v := range *x {')
        this.tab()
        if (!l.typ.isPrimitiveType()) {
            this.output('if v == nil {')
            this.tab()
            this.output('continue')
            this.untab()
            this.output('}')
        }
        this.outputFrag('ret[k] = ')
        const deref = l.typ.isPrimitiveType() ? '&' : ''
        l.typ.emitImport(this, deref + 'v')
        this.untab()
        this.output('}')
        this.output('return ret')
        this.untab()
        this.outputFrag('})')
        this.outputParamsMaybe(params)
    }

    emitExportBlob(t: Type, params: string | null): void {
        this.emitExportPrimitiveType(t, params)
    }

    emitExportOption(t: Type, params: string | null): void {
        // optimization, just copy primitives straight through
        if (t.isPrimitiveType() && params != null) {
            this.outputFrag(params)
            return
        }

        this.outputFrag('(func (x *')
        t.emit(this)
        this.outputFrag(') *')
        t.emitInternal(this)
        this.outputFrag(' {')
        this.tab()
        this.output('if x == nil {')
        this.tab()
        this.output('return nil')
        this.untab()
        this.output('}')
        this.untab()
        this.outputFrag('return ')
        t.emitExport(this, '(*x)')
        this.outputFrag('})')
        this.outputParamsMaybe(params)
    }

    emitImportOption(t: Type, params: string | null): void {
        this.outputFrag('(func (x *')
        t.emitInternal(this)
        this.outputFrag(') *')
        t.emit(this)
        this.output(' {')
        this.tab()
        this.output('if x == nil {')
        this.tab()
        this.output('return nil')
        this.untab()
        this.output('}')
        this.outputFrag('tmp := ')
        t.emitImport(this, 'x')
        this.emptyLine()
        this.output('return &tmp')
        this.untab()
        this.outputFrag('})')
        this.outputParamsMaybe(params)
    }

    emitStructExport(s: Struct): void {
        const o = this.internalStructName(s.name)
        const i = this.exportSymbol(s.name)
        const v = this.thisVariableName(s.name)
        this.output(`func (${v} ${i}) Export() *${o} {`)
        this.tab()
        this.output(`return &${o} {`)
        this.tab()
        for (const f of s.fields) {
            const ef = this.exportSymbol(f.name)
            this.outputFrag(`${ef}: `)
            f.type.emitExport(this, `${v}.${ef}`)
            this.output(',')
        }
        this.untab()
        this.output('}')
        this.untab()
        this.output('}')
    }

    emitId(n: string, i: UniqueId | null) {
        if (!i) {
            return
        }
        const tv = this.thisVariableName(n)
        const es = this.exportSymbol(n)
        const tuid = 'TypeUniqueID'
        this.output(`var ${es}${tuid} = rpc.${tuid}(${i.id})`)
        this.output(`func (${tv} *${es}) Get${tuid}() rpc.${tuid}{`)
        this.tab()
        this.output(`return ${es}${tuid}`)
        this.untab()
        this.output('}')
    }

    emitStruct(s: Struct): void {
        this.emitStatementPremable(s)
        this.emitStructVisible(s)
        this.emitStructInternal(s)
        this.emitStructImport(s)
        this.emitStructExport(s)
        this.emitCodec(s.name)
        this.emitId(s.name, s.id)
        this.emitBytesNil(s.name)
    }

    emitOption(o: Option): void {
        this.outputFrag('*')
        o.type.emit(this)
    }
    emitOptionInternal(o: Option): void {
        this.outputFrag('*')
        o.type.emitInternal(this)
    }

    emitMsgpackStructOpts(): void {
        this.output(
            '_struct struct{} `codec:",toarray"` //lint:ignore U1000 msgpack internal field'
        )
    }

    emitVariantInternalStruct(v: Variant): void {
        this.output(`type ${this.internalStructName(v.name)} struct {`)
        this.tab()
        this.emitMsgpackStructOpts()
        this.outputFrag(this.exportSymbol(v.switchVariable) + ' ')
        v.switchType.emit(this)
        this.emptyLine()
        this.output(
            `${this.switchStructName()} ${this.switchInternalStructType(
                v.name
            )}`
        )
        this.untab()
        this.output('}')
    }

    emitVariantTopStruct(v: Variant): void {
        this.output(`type ${this.exportSymbol(v.name)} struct {`)
        this.tab()
        this.outputFrag(this.exportSymbol(v.switchVariable) + ' ')
        v.switchType.emit(this)
        this.emptyLine()
        v.cases.forEach((c) => {
            this.emitVariantStructCase(v, c, false)
        })
        this.untab()
        this.output('}')
    }

    emitBytesNil(name: string): void {
        const enm = this.exportSymbol(name)
        const tv = this.thisVariableName(name)
        this.output(`func (${tv} *${enm}) Bytes() []byte { return nil }`)
    }

    emitCodec(name: string): void {
        const enm = this.exportSymbol(name)
        const inm = this.internalStructName(name)
        const tv = this.thisVariableName(name)

        this.output(`func (${tv} *${enm}) Encode(enc rpc.Encoder) error {`)
        this.tab()
        this.output(`return enc.Encode(${tv}.Export())`)
        this.untab()
        this.output('}')
        this.emptyLine()

        this.output(`func (${tv} *${enm}) Decode(dec rpc.Decoder) error {`)
        this.tab()
        this.output(`var tmp ${inm}`)
        this.output('err := dec.Decode(&tmp)')
        this.output(`if err != nil {`)
        this.tab()
        this.output('return err')
        this.untab()
        this.output('}')
        this.output(`*${tv} = tmp.Import()`)
        this.output('return nil')
        this.untab()
        this.output('}')
        this.emptyLine()
    }

    emitVariantStructCase(
        v: Variant,
        c: VariantCase,
        isInternal: boolean
    ): void {
        if (typeof c.position != 'number') {
            return
        }
        const p = be64encode(c.position)
        this.outputFrag(`${this.variantCasePositionToVariable(c.position)} *`)
        if (isInternal) {
            c.type.emitInternal(this)
            this.outputFrag(' `codec:"' + p + '"`')
        } else {
            c.type.emit(this)
            this.outputFrag(' `json:"f' + c.position + ',omitempty"`')
        }
        this.emptyLine()
    }

    emitVariantStructCaseInternal(v: Variant, c: VariantCase): void {
        if (typeof c.position != 'number') {
            return
        }
        const p = be64encode(c.position)
        this.outputFrag(`${this.variantCasePositionToVariable(c.position)} *`)
        c.type.emitInternal(this)
        this.outputFrag(' `codec:"' + p + '"`')
        this.emptyLine()
    }

    emitVariantInternalSwitchStruct(v: Variant): void {
        this.output(`type ${this.switchInternalStructType(v.name)} struct {`)
        this.tab()
        this.output('_struct struct{} `codec:",omitempty"`')
        for (const c of v.cases) {
            this.emitVariantStructCase(v, c, true)
        }
        this.untab()
        this.output('}')
    }

    emitVariantSwitchAccessorCase(
        v: Variant,
        c: VariantCase,
        thisVar: string
    ): void {
        if (c.labels.length == 0) {
            this.output('default:')
        } else {
            const cases = c.labels
                .map((x) => x.caseLabel(this, v.switchType))
                .join(', ')
            this.output(`case ${cases}:`)
        }
        this.tab()
        const p = c.position
        if (typeof p !== 'number') {
            this.output('break')
        } else {
            const cda = this.caseDataAccess(v, c)
            this.output(`if ${cda} == nil {`)
            this.tab()
            this.output(
                `return ret, errors.New("unexpected nil case for ${this.variantCasePositionToVariable(
                    p
                )}")`
            )
            this.untab()
            this.output('}')
        }
        this.untab()
    }

    emitVariantSwitchAccessor(v: Variant): void {
        const tv = this.thisVariableName(v.name)
        const tt = this.exportSymbol(v.name)
        const sv = `${tv}.${this.exportSymbol(v.switchVariable)}`
        this.outputFrag(
            `func (${tv} ${tt}) Get${this.exportSymbol(
                v.switchVariable
            )}() (ret `
        )
        v.switchType.emit(this)
        this.output(', err error) {')
        this.tab()
        this.output(`switch ${sv} {`)
        this.tab()
        for (const c of v.cases) {
            this.emitVariantSwitchAccessorCase(v, c, tv)
        }
        this.untab()
        this.output('}')
        this.output(`return ${sv}, nil`)
        this.untab()
        this.output('}')
    }

    switchStructName(): string {
        return 'Switch__'
    }

    caseDataAccess(v: Variant, c: VariantCase): string | null {
        const p = c.position
        const tv = this.thisVariableName(v.name)
        if (typeof p !== 'number') {
            return null
        }
        return [tv, this.variantCasePositionToVariable(p)].join('.')
    }

    switchValue(v: Variant): string {
        const tv = this.thisVariableName(v.name)
        return `${tv}.${this.exportSymbol(v.switchVariable)}`
    }

    emitVariantConstructorCase(v: Variant, c: VariantCase) {
        const tt = this.exportSymbol(v.name)

        const defConstructor = 'New' + this.exportSymbol(v.name) + 'Default'

        const labels: { constructorName: string; caseLabel: string }[] =
            c.labels.length == 0
                ? [{ constructorName: defConstructor, caseLabel: 's' }]
                : c.labels.map((x) => {
                      return {
                          constructorName: x.constructorName(this, v.name),
                          caseLabel: x.caseLabel(this, v.switchType),
                      }
                  })

        labels.forEach(({ constructorName, caseLabel }) => {
            this.outputFrag(`func ${constructorName} (`)

            let didOutput = false
            if (c.labels.length == 0) {
                this.outputFrag('s ')
                v.switchType.emit(this)
                didOutput = true
            }

            if (c.hasData()) {
                if (didOutput) {
                    this.outputFrag(', ')
                }
                this.outputFrag('v ')
                c.type.emit(this)
            }

            this.output(`) ${tt} {`)
            this.tab()
            this.output(`return ${tt}{`)
            this.tab()
            this.output(
                `${this.exportSymbol(v.switchVariable)} : ${caseLabel},`
            )
            if (c.hasData()) {
                const pos = c.position
                if (typeof pos == 'number') {
                    const cda = this.variantCasePositionToVariable(pos)
                    this.output(`${cda} : &v,`)
                }
            }
            this.untab()
            this.output('}')
            this.untab()
            this.output('}')
        })
    }

    emitVariantDataAccessorsCase(v: Variant, c: VariantCase) {
        const tv = this.thisVariableName(v.name)
        const tt = this.exportSymbol(v.name)
        const sv = this.switchValue(v)

        const cda = this.caseDataAccess(v, c)
        if (!cda) {
            return
        }
        const labels: { getterMethodName: string; caseLabel: string }[] =
            c.labels.length == 0
                ? [{ getterMethodName: 'Default', caseLabel: '' }]
                : c.labels.map((x) => {
                      return {
                          getterMethodName: x.getterMethodName(this),
                          caseLabel: x.caseLabel(this, v.switchType),
                      }
                  })

        for (const { getterMethodName, caseLabel } of labels) {
            this.outputFrag(`func (${tv} ${tt}) ${getterMethodName}() `)
            c.type.emit(this)
            this.output(' {')
            this.tab()
            this.output(`if ${cda} == nil {`)
            this.tab()
            this.output(
                'panic("unexepected nil case; should have been checked")'
            )
            this.untab()
            this.output('}')
            if (caseLabel.length > 0) {
                this.output(`if ${sv} != ${caseLabel} {`)
                this.tab()
                this.output(
                    `panic(fmt.Sprintf("unexpected switch value (%v) when ${getterMethodName} is called", ${sv}))`
                )
                this.untab()
                this.output('}')
            }
            this.output(`return *${cda}`)
            this.untab()
            this.output('}')
        }
    }

    emitVariantDataAccessors(v: Variant) {
        for (const c of v.cases) {
            this.emitVariantDataAccessorsCase(v, c)
        }
    }

    emitVariantConstructors(v: Variant) {
        for (const c of v.cases) {
            this.emitVariantConstructorCase(v, c)
        }
    }

    emitVariantExportCase(v: Variant, c: VariantCase): void {
        const p = c.position
        const tv = this.thisVariableName(v.name)
        if (typeof p !== 'number') {
            return
        }

        const field = this.variantCasePositionToVariable(p)
        this.outputFrag(`${field} : `)

        // optimization!
        if (c.type.isPrimitiveType()) {
            this.output(`${tv}.${field},`)
            return
        }

        this.outputFrag('(func (x *')
        c.type.emit(this)
        this.outputFrag(') *')
        c.type.emitInternal(this)
        this.output(' {')
        this.output(`if x == nil {`)
        this.tab()
        this.output('return nil')
        this.untab()
        this.output('}')
        this.outputFrag('return ')
        c.type.emitExport(this, '(*x)')
        this.output(`})(${tv}.${field}),`)
    }

    emitVariantExport(v: Variant): void {
        const tv = this.thisVariableName(v.name)
        this.output(
            `func (${tv} ${this.exportSymbol(
                v.name
            )}) Export() *${this.internalStructName(v.name)} {`
        )
        this.tab()
        this.output(`return &${this.internalStructName(v.name)} {`)
        this.tab()
        const sv = this.exportSymbol(v.switchVariable)
        this.output(`${sv} : ${tv}.${sv},`)
        this.output(
            `${this.switchStructName()} : ${this.switchInternalStructType(
                v.name
            )} {`
        )
        this.tab()
        v.cases.forEach((c) => {
            this.emitVariantExportCase(v, c)
        })
        this.untab()
        this.output('},')
        this.untab()
        this.output('}')
        this.untab()
        this.output('}')
    }

    emitVariantImportCase(v: Variant, c: VariantCase): void {
        const p = c.position
        const tv = this.thisVariableName(v.name)
        if (typeof p !== 'number') {
            return
        }
        const field = this.variantCasePositionToVariable(p)
        this.outputFrag(`${field} : `)

        const source = [tv, this.switchStructName(), field].join('.')

        // optimiziation
        if (c.type.isPrimitiveType()) {
            this.output(`${source},`)
            return
        }

        this.outputFrag('(func (x *')
        c.type.emitInternal(this)
        this.outputFrag(') *')
        c.type.emit(this)
        this.output(' {')
        this.tab()
        this.output(`if x == nil {`)
        this.tab()
        this.output('return nil')
        this.untab()
        this.output('}')
        this.outputFrag('tmp := ')
        c.type.emitImport(this, 'x')
        this.emptyLine()
        this.output('return &tmp')
        this.untab()
        this.output(`})(${source}),`)
    }

    emitVariantImport(v: Variant): void {
        const tv = this.thisVariableName(v.name)
        this.output(
            `func (${tv} ${this.internalStructName(
                v.name
            )}) Import() ${this.exportSymbol(v.name)} {`
        )
        this.tab()
        this.output(`return ${this.exportSymbol(v.name)} {`)
        this.tab()
        const sv = this.exportSymbol(v.switchVariable)
        this.output(`${sv} : ${tv}.${sv},`)
        v.cases.forEach((c) => {
            this.emitVariantImportCase(v, c)
        })
        this.untab()
        this.output('}')
        this.untab()
        this.output('}')
    }

    emitVariant(v: Variant): void {
        this.emitStatementPremable(v)
        this.emitVariantTopStruct(v)
        this.emitVariantInternalStruct(v)
        this.emitVariantInternalSwitchStruct(v)
        this.emitVariantSwitchAccessor(v)
        this.emitVariantDataAccessors(v)
        this.emitVariantConstructors(v)
        this.emitVariantImport(v)
        this.emitVariantExport(v)
        this.emitCodec(v.name)
        this.emitId(v.name, v.id)
        this.emitBytesNil(v.name)
    }

    protocolId(p: Protocol): string {
        return this.exportSymbol(p.name) + 'ProtocolID'
    }

    emitProtocolId(p: Protocol): void {
        this.output(
            `var ${this.protocolId(
                p
            )} rpc.ProtocolUniqueID = rpc.ProtocolUniqueID(${p.id.id})`
        )
    }

    emitServerHookSignature(i: Protocol, m: Method): void {
        this.emitDecorators(m.decorators)
        this.outputFrag(`${this.exportSymbol(m.name)}(context.Context`)
        if (m.arg.length > 0) {
            this.outputFrag(', ')
            if (m.arg.length === 1 && m.arg[0].position == 0) {
                m.arg[0].type.emit(this)
            } else {
                this.outputFrag(m.makeArgName(this))
            }
        }
        this.outputFrag(') (')
        if (!m.res.isVoid()) {
            m.res.emit(this)
            this.outputFrag(', ')
        }
        this.output('error)')
    }

    emitServerInterface(p: Protocol): void {
        this.emitStatementPremable(p)
        const nm = this.exportSymbol(p.name)
        this.output(`type ${nm}Interface interface {`)
        this.tab()
        for (const m of p.methods) {
            this.emitServerHookSignature(p, m)
        }
        this.outputFrag(`ErrorWrapper() func(error) `)
        p.pm.etype.emit(this)
        this.emptyLine()
        if (!!p.pm.ahType) {
            this.outputFrag(`CheckArgHeader(ctx context.Context, h `)
            p.pm.ahType.emit(this)
            this.output(') error')
            this.emptyLine()
        }
        if (!!p.pm.rhType) {
            this.outputFrag(`MakeResHeader() `)
            p.pm.rhType.emit(this)
            this.emptyLine()
        }
        this.untab()
        this.output('}')
    }

    methodArgName(methodName: string, argName: string | null): string {
        return this.exportSymbol(argName ? argName : methodName + 'Arg')
    }

    toEnumConstant(t: Type, name: string): string {
        const parts = []
        const dt = t.toDerivedType()
        if (!!dt) {
            const prfx = this.derivedPrefix(dt)
            if (prfx) {
                parts.push(prfx)
            }
        }
        const prfx = t.enumPrefix()
        if (prfx.length == 0) {
            parts.push(name)
        } else {
            parts.push(this.exportSymbol(prfx) + '_' + name)
        }
        return parts.join('')
    }

    toEnumConstructor(t: Type, name: string): string {
        return this.toEnumConstant(t, name)
    }

    emitClientStub(i: Protocol): void {
        const es = this.exportSymbol(i.name)
        this.output(`type ${es}Client struct {`)
        this.tab()
        this.output('Cli rpc.GenericClient')
        this.output(`ErrorUnwrapper ${es}ErrorUnwrapper`)
        if (!!i.pm.ahType) {
            this.outputFrag(`MakeArgHeader func() `)
            i.pm.ahType.emit(this)
            this.emptyLine()
        }
        if (!!i.pm.rhType) {
            this.outputFrag(`CheckResHeader func(context.Context, `)
            i.pm.rhType.emit(this)
            this.output(') error')
        }
        this.untab()
        this.output('}')
    }

    emitClientMethods(i: Protocol): void {
        for (const m of i.methods) {
            this.emitClientMethod(i, m)
        }
    }

    emitClientMethod(i: Protocol, m: Method): void {
        this.outputFrag(
            `func (c ${this.exportSymbol(i.name)}Client) ${this.exportSymbol(
                m.name
            )} (ctx context.Context`
        )
        const argStructName = m.makeArgName(this) // this.exportSymbol(m.name) + 'Arg'
        if (m.arg.length > 0) {
            this.outputFrag(', ')
            if (m.singleArg()) {
                this.outputFrag(m.arg[0].name + ' ')
                m.arg[0].type.emit(this)
            } else {
                this.outputFrag(`arg ${argStructName}`)
            }
        }
        this.outputFrag(') (')
        if (!m.res.isVoid()) {
            this.outputFrag('res ')
            m.res.emit(this)
            this.outputFrag(', ')
        }
        this.output('err error) {')
        this.tab()
        if (m.singleArg()) {
            this.output(`arg := ${argStructName}{`)
            this.tab()
            const n = m.arg[0].name
            this.output(`${this.exportSymbol(n)}: ${n},`)
            this.untab()
            this.output('}')
        } else if (m.arg.length == 0) {
            this.output(`var arg ${argStructName}`)
        }

        if (!!i.pm.ahType) {
            this.outputFrag('warg := &rpc.DataWrap[')
            i.pm.ahType.emit(this)
            this.outputFrag(', *')
            const argType = this.internalStructName(m.makeArgName(this))
            this.outputFrag(argType)
            this.output('] {')
            this.tab()
            this.output('Data : arg.Export(),')
            this.untab()
            this.output('}')
            this.output(`if c.MakeArgHeader != nil {`)
            this.tab()
            this.output('warg.Header = c.MakeArgHeader()')
            this.untab()
            this.output('}')
        } else {
            this.output('warg := arg.Export()')
        }

        let nilRes = false

        if (!!i.pm.rhType) {
            this.outputFrag(`var tmp rpc.DataWrap[`)
            i.pm.rhType.emit(this)
            this.outputFrag(', ')
            if (m.res.isVoid()) {
                this.outputFrag('interface{}')
            } else {
                m.res.emitInternal(this)
            }
            this.output(']')
        } else if (!m.res.isVoid()) {
            this.outputFrag('var tmp ')
            m.res.emitInternal(this)
            this.emptyLine()
        } else {
            nilRes = true
        }

        const res = nilRes ? 'nil' : '&tmp'
        const method = `rpc.NewMethodV2(${this.protocolId(i)}, ${
            m.position
        }, "${i.name}.${m.name}")`
        const adapter =
            this.privateSymbol(i.name) +
            'ErrorUnwrapperAdapter{' +
            'h: c.ErrorUnwrapper}'
        this.output(
            `err = c.Cli.Call2(ctx, ${method}, warg, ${res}, 0*time.Millisecond, ${adapter})`
        )
        this.output(`if err != nil {`)
        this.tab()
        this.output('return')
        this.untab()
        this.output('}')
        if (!!i.pm.rhType) {
            this.output(`if c.CheckResHeader != nil {`)
            this.tab()
            this.output(`err = c.CheckResHeader(ctx, tmp.Header)`)
            this.output(`if err != nil {`)
            this.tab()
            this.output('return')
            this.untab()
            this.output('}')
            this.untab()
            this.output('}')
        }
        if (!m.res.isVoid()) {
            const tmp = !!i.pm.rhType ? 'tmp.Data' : 'tmp'
            this.outputFrag('res = ')
            if (m.res.isPrimitiveType()) {
                this.output(tmp)
            } else if (m.res.isList()) {
                m.res.emitImport(this, '&' + tmp)
                this.emptyLine()
            } else {
                this.output(tmp + '.Import()')
            }
        }
        this.output('return')
        this.untab()
        this.output('}')
    }

    emitServerProtocolHandler(i: Protocol, m: Method): void {
        const argType = this.internalStructName(m.makeArgName(this))
        this.output(`${m.position} : {`)
        this.tab()
        this.output('ServeHandlerDescription : rpc.ServeHandlerDescription{')
        this.tab()
        this.output(`MakeArg: func() interface{} {`)
        this.tab()
        if (!!i.pm.ahType) {
            this.outputFrag('var ret rpc.DataWrap[')
            i.pm.ahType.emit(this)
            this.outputFrag(', *')
            this.outputFrag(argType)
            this.output(']')
        } else {
            this.output(`var ret ${argType}`)
        }
        this.output(`return &ret`)
        this.untab()
        this.output('},')
        this.untab()
        this.output(
            `Handler : func(ctx context.Context, args interface{}) (interface{}, error) {`
        )
        this.tab()
        if (!!i.pm.ahType) {
            this.outputFrag(`typedWrappedArg, ok := args.(*rpc.DataWrap[`)
            i.pm.ahType.emit(this)
            this.outputFrag(', *')
            this.outputFrag(argType)
            this.output('])')
            this.output('if !ok {')
            this.tab()
            this.outputFrag('err := rpc.NewTypeError((*rpc.DataWrap[')
            i.pm.ahType.emit(this)
            this.outputFrag(', *')
            this.outputFrag(argType)
            this.output('])(nil), args)')
            this.output('return nil, err')
            this.untab()
            this.output('}')
            this.output(
                `if err := i.CheckArgHeader(ctx, typedWrappedArg.Header); err != nil {`
            )
            this.tab()
            this.output('return nil, err')
            this.untab()
            this.output('}')
            if (m.arg.length > 0) {
                this.output('typedArg := typedWrappedArg.Data')
            }
        } else {
            const typedArgs = m.arg.length == 0 ? '_' : 'typedArg'
            this.output(`${typedArgs}, ok := args.(*${argType})`)
            this.output(`if !ok {`)
            this.tab()
            this.output(`err := rpc.NewTypeError((*${argType})(nil), args)`)
            this.output('return nil, err')
            this.untab()
            this.output('}')
        }
        const ret = m.res.isVoid() ? '' : 'tmp, '
        const arg =
            m.arg.length == 0
                ? ''
                : ', (typedArg.Import())' +
                  (m.singleArg() ? '.' + this.exportSymbol(m.arg[0].name) : '')
        this.output(`${ret}err := i.${this.exportSymbol(m.name)}(ctx${arg})`)
        this.output('if err != nil {')
        this.tab()
        this.output('return nil, err')
        this.untab()
        this.output('}')

        let isList = false
        if (!m.res.isVoid() && m.res.isList()) {
            isList = true
            this.outputFrag('lst := ')
            m.res.emitExport(this, 'tmp')
            this.emptyLine()
        }

        if (!!i.pm.rhType) {
            this.outputFrag('ret := rpc.DataWrap[')
            i.pm.rhType.emit(this)
            this.outputFrag(', ')
            if (m.res.isVoid()) {
                this.outputFrag('interface{}')
            } else if (m.res.isList()) {
                m.res.emitInternal(this)
            } else if (m.res.isPrimitiveType()) {
                m.res.emitInternal(this)
            } else {
                this.outputFrag('*')
                m.res.emitInternal(this)
            }
            this.output(']{')
            this.tab()
            if (m.res.isVoid()) {
                // noop
            } else if (m.res.isPrimitiveType()) {
                this.output('Data : tmp,')
            } else if (m.res.isList()) {
                this.output('Data : *lst,')
            } else {
                this.output('Data : tmp.Export(),')
            }
            this.output('Header : i.MakeResHeader(),')
            this.untab()
            this.output('}')
            this.output('return &ret, nil')
        } else {
            if (m.res.isVoid()) {
                this.output('return nil, nil')
            } else if (m.res.isPrimitiveType()) {
                this.output('return tmp,  nil')
            } else if (m.res.isList()) {
                this.output('return lst, nil')
            } else {
                this.output('return tmp.Export(), nil')
            }
        }
        this.untab()
        this.output('},')
        this.output('},')
        this.output(`Name: "${m.name}",`)
        this.untab()
        this.output('},')
    }

    emitServerProtocol(i: Protocol): void {
        const pn = this.exportSymbol(i.name)
        this.output(`func ${pn}Protocol(i ${pn}Interface) rpc.ProtocolV2 {`)
        this.tab()
        this.output(`return rpc.ProtocolV2{`)
        this.tab()
        this.output(`Name: "${i.name}",`)
        this.output(`Id: ${this.protocolId(i)},`)
        this.output(`Methods: map[rpc.Position]rpc.ServeHandlerDescriptionV2{`)
        this.tab()
        for (const m of i.methods) {
            this.emitServerProtocolHandler(i, m)
        }
        this.untab()
        this.output('},')
        this.output(
            `WrapError : ${pn}MakeGenericErrorWrapper(i.ErrorWrapper()),`
        )
        this.untab()
        this.output('}')
        this.untab()
        this.output(`}`)
    }

    emitClientErrorUnwrapperType(i: Protocol): void {
        this.outputFrag(`type ${this.exportSymbol(i.name)}ErrorUnwrapper func(`)
        i.pm.etype.emit(this)
        this.output(') error')
    }

    emitClientErrorWrapperType(i: Protocol): void {
        this.outputFrag(
            `type ${this.exportSymbol(i.name)}ErrorWrapper func(error) `
        )
        i.pm.etype.emit(this)
        this.emptyLine()
        this.emptyLine()
    }

    emitClientErrorUnwrapperAdapterStruct(p: Protocol): void {
        const nm = this.privateSymbol(p.name) + 'ErrorUnwrapperAdapter'
        const hook = this.exportSymbol(p.name) + 'ErrorUnwrapper'
        const tv = this.thisVariableName(p.name)

        this.output(`type ${nm} struct {`)
        this.tab()
        this.output(`h ${hook}`)
        this.untab()
        this.output('}')
        this.emptyLine()

        this.output(`func (${tv} ${nm}) MakeArg() interface{} {`)
        this.tab()
        this.outputFrag(`return &`)
        p.pm.etype.emitInternal(this)
        this.output('{}')
        this.untab()
        this.output('}')
        this.emptyLine()

        this.output(
            `func (${tv} ${nm}) UnwrapError(raw interface{}) ` +
                `(appError error, dispatchError error) {`
        )
        this.tab()
        this.outputFrag('s, ok := raw.(*')
        p.pm.etype.emitInternal(this)
        this.output(')')
        this.output('if !ok {')
        this.tab()
        this.output(
            'return nil, errors.New("Error converting to internal type in UnwrapError")'
        )
        this.untab()
        this.output('}')
        this.output('if s == nil {')
        this.tab()
        this.output('return nil, nil')
        this.untab()
        this.output('}')
        this.output(`return ${tv}.h(s.Import()), nil`)
        this.untab()
        this.output('}')

        this.emptyLine()
        this.output(`var _ rpc.ErrorUnwrapper = ${nm}{}`)
    }

    emitClientErrorUnwrapper(p: Protocol): void {
        this.emitClientErrorUnwrapperType(p)
        this.emitClientErrorWrapperType(p)
        this.emitClientErrorUnwrapperAdapterStruct(p)
    }

    emitServerWrapError(p: Protocol): void {
        const nm = this.exportSymbol(p.name)
        this.output(
            `func ${nm}MakeGenericErrorWrapper(f ${nm}ErrorWrapper) rpc.WrapErrorFunc {`
        )
        this.tab()
        this.output('return func(err error) interface{} {')
        this.tab()
        this.output('if err == nil {')
        this.tab()
        this.output('return err')
        this.untab()
        this.output('}')
        this.output(
            `return f(err)${p.pm.etype.isPrimitiveType() ? '' : '.Export()'}`
        )
        this.untab()
        this.output('}')
        this.untab()
        this.output('}')
    }

    emitFutureLink(parent: Type, child: string): void {
        const nm = this.exportSymbol(child)
        const tv = this.thisVariableName(child)

        this.outputFrag(
            `func (${tv} *${nm}) AllocAndDecode(f rpc.DecoderFactory) (*`
        )
        parent.emit(this)
        this.output(', error) {')
        this.tab()
        this.outputFrag(`var ret `)
        parent.emit(this)
        this.emptyLine()
        this.output(`src := f.NewDecoderBytes(&ret, ${tv}.Bytes())`)
        this.output('err := ret.Decode(src)')
        this.output(`if err != nil {`)
        this.tab()
        this.output('return nil, err')
        this.untab()
        this.output('}')
        this.output('return &ret, nil')
        this.untab()
        this.output('}')

        this.output(
            `func (${tv} *${nm}) AssertNormalized() error { return nil }`
        )
        this.emptyLine()

        this.outputFrag(`func (${tv} *`)
        parent.emit(this)
        this.output(`) EncodeTyped(f rpc.EncoderFactory) (*${nm}, error) {`)
        this.tab()
        this.output(`var tmp []byte`)
        this.output(`enc := f.NewEncoderBytes(&tmp)`)
        this.output(`err := ${tv}.Encode(enc)`)
        this.output(`if err != nil {`)
        this.tab()
        this.output(`return nil, err`)
        this.untab()
        this.output(`}`)
        this.output(`ret := ${nm}(tmp)`)
        this.output(`return &ret, nil`)
        this.untab()
        this.output('}')

        this.outputFrag(`func (${tv} *`)
        parent.emit(this)
        this.output(`) ChildBlob(_b []byte) ${nm} {`)
        this.tab()
        this.output(`return ${nm}(_b)`)
        this.untab()
        this.output('}')
    }

    emitProtocol(p: Protocol): void {
        this.emitProtocolId(p)
        this.emitMethodsArgs(p)
        this.emitServerInterface(p)
        this.emitServerWrapError(p)
        this.emitClientErrorUnwrapper(p)
        this.emitClientStub(p)
        this.emitClientMethods(p)
        this.emitServerProtocol(p)
    }

    emitImportLibrary(i: BaseImport): void {
        super.storeImport(i)
        if (i.isGo()) {
            this.output(`import ${i.name} ${i.path}`)
        }
    }

    emitTypedefBlobSize(b: Blob): void {
        return
    }
}

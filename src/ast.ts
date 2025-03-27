import { Emitter } from './emit'
import { Language } from './constants'

export class Inventory {
    rpc: boolean
    variant: boolean
    strct: boolean
    typedef: boolean
    unique: boolean

    constructor() {
        this.rpc = false
        this.variant = false
        this.strct = false
        this.typedef = false
        this.unique = false
    }
}

export class Statement {
    decorators: Decorators
    constructor(d: Decorators) {
        this.decorators = d
    }
    isVariant(): boolean {
        return false
    }
    isProtocol(): boolean {
        return false
    }
    emit(_: Emitter) {}

    doInventory(i: Inventory) {}
}

export abstract class BaseImport extends Statement {
    path: string
    name: string

    constructor(p: string, n: string) {
        super(new Decorators(null))
        this.name = n
        this.path = p
    }
    isGo(): boolean {
        return false
    }
    isTs(): boolean {
        return false
    }
    isGeneric(): boolean {
        return false
    }
    emit(e: Emitter) {
        e.emitImportLibrary(this)
    }
    abstract lang(): Language
}

export class ImportFlavors {
    m: Map<Language, BaseImport>

    constructor() {
        this.m = new Map<Language, GenericImport>()
    }
}

export class GenericImport extends BaseImport {
    lang(): Language {
        return Language.None
    }
    isGeneric(): boolean {
        return true
    }
}

export class TsImport extends BaseImport {
    isTs(): boolean {
        return true
    }
    lang(): Language {
        return Language.TypeScript
    }
}

export class GoImport extends BaseImport {
    isGo(): boolean {
        return true
    }
    lang(): Language {
        return Language.Go
    }
}
export abstract class Type {
    abstract emit(e: Emitter): void
    emitInternal(e: Emitter) {
        return this.emit(e)
    }
    isList(): boolean {
        return false
    }
    isVoid(): boolean {
        return false
    }
    makeOptional(): Option {
        return new Option(this)
    }
    isPrimitiveType(): boolean {
        return false
    }
    isDerivedType(): boolean {
        return false
    }
    toDerivedType(): DerivedType | null {
        return null
    }
    toPrimitiveType(): PrimitiveType | null {
        return null
    }
    enumPrefix(): string {
        return ''
    }

    emitExport(e: Emitter, params: string | null) {
        return
    }
    emitImport(e: Emitter, params: string | null): void {
        return
    }
    emitBytes(e: Emitter, nm: string): void {
        return e.emitNil()
    }
    emitSize(e: Emitter): void {
        return
    }
    emitFutureLink(e: Emitter, child: string): void {}
}

export class Void extends Type {
    emit(e: Emitter): void {
        e.emitVoid(this)
    }
    isVoid(): boolean {
        return true
    }
}

export class Option extends Type {
    type: Type
    constructor(t: Type) {
        super()
        this.type = t
    }
    emit(e: Emitter) {
        e.emitOption(this)
    }
    emitInternal(e: Emitter) {
        e.emitOptionInternal(this)
    }
    makeOptional(): Option {
        return this
    }
    emitExport(e: Emitter, params: string | null): void {
        return e.emitExportOption(this.type, params)
    }
    emitImport(e: Emitter, params: string | null): void {
        return e.emitImportOption(this.type, params)
    }
}

export class EnumValue {
    name: string
    value: number
    constructor(n: string, v: number) {
        this.name = n
        this.value = v
    }
}

export class Enum extends Statement {
    name: string
    values: EnumValue[]
    constructor(d: Decorators, n: string, v: EnumValue[]) {
        super(d)
        this.name = n
        this.values = v
    }
    emit(e: Emitter) {
        e.emitEnum(this)
    }
}

export abstract class PrimitiveType extends Type {
    constructor() {
        super()
    }
    isPrimitiveType(): boolean {
        return true
    }
    toPrimitiveType(): PrimitiveType | null {
        return this
    }
    emitExport(e: Emitter, params: string | null): void {
        e.emitExportPrimitiveType(this, params)
    }
    emitImport(e: Emitter, params: string | null): void {
        return e.emitImportPrimitiveType(this, params)
    }
}

export class Uint extends PrimitiveType {
    emit(e: Emitter): void {
        e.emitUint(this)
    }
    emitImport(e: Emitter, params: string | null): void {
        return e.emitImportUint(this, params)
    }
    emitExport(e: Emitter, params: string | null): void {
        e.emitExportUint(this, params)
    }
}
export class Int extends PrimitiveType {
    emit(e: Emitter): void {
        e.emitInt(this)
    }
    emitImport(e: Emitter, params: string | null): void {
        return e.emitImportInt(this, params)
    }
    emitExport(e: Emitter, params: string | null): void {
        e.emitExportInt(this, params)
    }
}
export class Bool extends PrimitiveType {
    emit(e: Emitter): void {
        e.emitBool(this)
    }
    emitImport(e: Emitter, params: string | null): void {
        return e.emitImportBool(this, params)
    }
}
export class Text extends PrimitiveType {
    emit(e: Emitter): void {
        e.emitText(this)
    }
    emitImport(e: Emitter, params: string | null): void {
        return e.emitImportText(this, params)
    }
}

export class Field {
    name: string
    position: number
    type: Type
    constructor(n: string, p: number, t: Type) {
        this.name = n
        this.position = p
        this.type = t
    }
}

export class Param {
    name: string
    position: number
    type: Type
    constructor(n: string, p: number, t: Type) {
        this.name = n
        this.position = p
        this.type = t
    }
    toField(): Field {
        return new Field(this.name, this.position, this.type)
    }
}

export class Struct extends Statement {
    name: string
    fields: Field[]
    id: UniqueId | null
    constructor(d: Decorators, n: string, i: UniqueId | null, f: Field[]) {
        super(d)
        this.name = n
        this.id = i
        // Sort fields in positional oder, since they will be output in that order
        this.fields = f.sort((a: Field, b: Field) => a.position - b.position)
        this.checkNoDuplicateFields()
    }
    emit(e: Emitter): void {
        e.emitStruct(this)
    }
    doInventory(i: Inventory) {
        i.strct = true
    }
    maxPosition(): number {
        return this.fields?.length
            ? this.fields[this.fields.length - 1].position
            : -1
    }
    checkNoDuplicateFields(): void {
        const s = new Set<number>()
        this.fields.forEach((f) => {
            if (s.has(f.position)) {
                throw new Error(
                    `repeated position ${f.position} (${f.name}) in struct ${this.name}`
                )
            }
            s.add(f.position)
        })
    }
}

export class List extends Type {
    typ: Type
    constructor(t: Type) {
        super()
        this.typ = t
    }
    emit(e: Emitter): void {
        e.emitList(this)
    }
    emitInternal(e: Emitter): void {
        e.emitListInternal(this)
    }
    isList(): boolean {
        return true
    }
    emitExport(e: Emitter, params: string | null): void {
        e.emitExportList(this, params)
    }
    emitImport(e: Emitter, params: string | null): void {
        return e.emitImportList(this, params)
    }
}

export class DerivedType extends Type {
    name: string
    importedFrom: string | null
    constructor(n: string, i: string | null) {
        super()
        this.name = n
        this.importedFrom = i
    }
    isDerivedType(): boolean {
        return true
    }
    toDerivedType(): DerivedType | null {
        return this
    }
    emit(e: Emitter): void {
        e.emitDerivedType(this)
    }
    emitInternal(e: Emitter): void {
        e.emitDerivedTypeInternal(this)
    }
    enumPrefix(): string {
        return this.name
    }
    emitExport(e: Emitter, params: string | null): void {
        e.emitExportDerivedType(this, params)
    }
    emitImport(e: Emitter, params: string | null): void {
        return e.emitImportDerivedType(this, params)
    }
    fullTypeName(): string {
        const parts = []
        if (!!this.importedFrom) {
            parts.push(this.importedFrom)
        }
        parts.push(this.name)
        return parts.join('.')
    }
    emitBytes(e: Emitter, varName: string): void {
        e.emitBytesDowncast(this.fullTypeName(), varName)
    }
}

export class Typedef extends Statement {
    name: string
    typ: Type
    id: UniqueId | null
    constructor(d: Decorators, n: string, i: UniqueId | null, t: Type) {
        super(d)
        this.name = n
        this.typ = t
        this.id = i
    }
    emit(e: Emitter): void {
        e.emitTypedef(this)
    }
    doInventory(i: Inventory) {
        i.typedef = true
        if (this.id != null) {
            this.id.doInventory(i)
        }
    }
}

export class UniqueId {
    id: string
    constructor(i: string) {
        this.id = i
    }
    doInventory(i: Inventory) {
        i.unique = true
    }
}

export class Blob extends PrimitiveType {
    count: number | undefined | null
    constructor(c: number | undefined | null) {
        super()
        this.count = c
    }
    isFixed(): boolean {
        return typeof this.count === 'number'
    }
    emit(e: Emitter): void {
        e.emitBlob(this)
    }
    emitBytes(e: Emitter, nm: string): void {
        e.emitBlobToBytes(nm)
    }
    emitExport(e: Emitter, params: string | null): void {
        e.emitExportBlob(this, params)
    }
    emitImport(e: Emitter, params: string | null): void {
        e.emitImportBlob(this, params)
    }
    emitSize(e: Emitter) {
        e.emitTypedefBlobSize(this)
    }
}

export class Future extends Blob {
    type: Type
    constructor(t: Type) {
        super(null)
        this.type = t
    }
    emitFutureLink(e: Emitter, child: string) {
        e.emitFutureLink(this.type, child)
    }
}

export class Root {
    id: UniqueId
    statements: Statement[]
    constructor(i: UniqueId, s: Statement[]) {
        this.id = i
        this.statements = s
    }

    emit(e: Emitter) {
        for (const s of this.statements) {
            s.emit(e)
        }
    }
    doInventory(i: Inventory) {
        for (const c of this.statements) {
            c.doInventory(i)
        }
    }
}

abstract class VariantLabel {
    abstract caseLabel(e: Emitter, t: Type): string
    abstract getterMethodName(e: Emitter): string
    abstract constructorName(e: Emitter, s: string): string
    abstract instanceConstructor(e: Emitter, t: Type): string
}

export class VariantLabelIdentifier implements VariantLabel {
    i: string
    constructor(i: string) {
        this.i = i
    }
    caseLabel(e: Emitter, t: Type): string {
        return e.toEnumConstant(t, this.i)
    }
    getterMethodName(e: Emitter): string {
        return e.getterMethodNameForConstant(this.i)
    }
    constructorName(e: Emitter, variantName: string): string {
        return e.constructorNameForConstant(variantName, this.i)
    }
    instanceConstructor(e: Emitter, t: Type): string {
        return e.toEnumConstructor(t, this.i)
    }
}

export class VariantLabelNumber implements VariantLabel {
    n: number
    constructor(n: number) {
        this.n = n
    }
    caseLabel(e: Emitter, t: Type): string {
        return this.n.toString()
    }
    getterMethodName(e: Emitter): string {
        return e.getterMethodNameForInt(this.n)
    }
    constructorName(e: Emitter, variantName: string): string {
        return e.constructorNameForInt(variantName, this.n)
    }
    instanceConstructor(e: Emitter, t: Type): string {
        return this.caseLabel(e, t)
    }
}

export class VariantLabelBool implements VariantLabel {
    b: boolean
    constructor(b: boolean) {
        this.b = b
    }
    caseLabel(e: Emitter, t: Type): string {
        return this.b.toString()
    }
    getterMethodName(e: Emitter): string {
        return e.getterMethodNameForBool(this.b)
    }
    constructorName(e: Emitter, variantName: string): string {
        return e.constructorNameForBool(variantName, this.b)
    }
    instanceConstructor(e: Emitter, t: Type): string {
        return this.caseLabel(e, t)
    }
}

export class VariantCase {
    labels: VariantLabel[]
    position: number | undefined | null
    type: Type
    hasData(): boolean {
        return !this.type.isVoid()
    }
    constructor(l: VariantLabel[], p: number | undefined | null, t: Type) {
        this.labels = l
        this.position = p
        this.type = t
        const hasPosition = typeof this.position === 'number'
        if (hasPosition && !this.hasData()) {
            throw new Error('cannot provide a position (@X) for a void case')
        }
        if (!hasPosition && this.hasData()) {
            throw new Error('require a position (@X) for a non-void case')
        }
    }
}

export class Variant extends Statement {
    name: string
    switchVariable: string
    switchType: Type
    id: UniqueId | null
    cases: VariantCase[]
    constructor(
        d: Decorators,
        n: string,
        v: string,
        t: Type,
        i: UniqueId | null,
        c: VariantCase[]
    ) {
        super(d)
        this.name = n
        this.switchVariable = v
        this.switchType = t
        this.id = i
        this.cases = c
    }

    emit(e: Emitter): void {
        e.emitVariant(this)
    }
    isVariant(): boolean {
        return true
    }
    doInventory(i: Inventory) {
        i.variant = true
    }
}

export class Method {
    decorators: Decorators
    name: string
    position: number
    arg: Param[]
    res: Type
    argName: string | null
    constructor(
        d: Decorators,
        n: string,
        p: number,
        a: Param[],
        an: string | null,
        r: Type
    ) {
        this.decorators = d
        this.name = n
        this.position = p
        this.arg = a
        this.res = r
        this.argName = an
    }

    paramsToStruct(n: string): Struct {
        return new Struct(
            new Decorators(null),
            n,
            null,
            this.arg.map((x) => x.toField())
        )
    }

    singleArg(): boolean {
        return this.arg.length == 1 && this.arg[0].position == 0
    }

    makeArgName(e: Emitter): string {
        return e.methodArgName(this.name, this.argName)
    }
}

export class ProtoModifier {
    isErrorType(): boolean {
        return false
    }
    isArgHeader(): boolean {
        return false
    }
    isResHeader(): boolean {
        return false
    }
}

export class ErrorType extends ProtoModifier {
    etype: Type
    constructor(e: Type) {
        super()
        this.etype = e
    }
    isErrorType(): boolean {
        return true
    }
}

export class ArgHeader extends ProtoModifier {
    ahType: Type
    constructor(a: Type) {
        super()
        this.ahType = a
    }
    isArgHeader(): boolean {
        return true
    }
}

export class ResHeader extends ProtoModifier {
    rhType: Type
    constructor(r: Type) {
        super()
        this.rhType = r
    }
    isResHeader(): boolean {
        return true
    }
}

export class ProtoModifiers {
    etype: Type
    ahType: Type | null
    rhType: Type | null
    constructor(e: Type, a: Type | null, r: Type | null) {
        this.etype = e
        this.ahType = a
        this.rhType = r
    }
}

function parseProtoModifiers(l: ProtoModifier[]): ProtoModifiers {
    let e: Type | null = null
    let a: Type | null = null
    let r: Type | null = null
    l.forEach((m) => {
        if (m.isErrorType()) {
            if (e != null) {
                throw new Error('duplicate error type')
            }
            e = (m as ErrorType).etype
        } else if (m.isArgHeader()) {
            if (a != null) {
                throw new Error('duplicate arg header')
            }
            a = (m as ArgHeader).ahType
        } else if (m.isResHeader()) {
            if (r != null) {
                throw new Error('duplicate res header')
            }
            r = (m as ResHeader).rhType
        }
    })
    if (e == null) {
        throw new Error('missing error type')
    }
    return new ProtoModifiers(e, a, r)
}

export class Protocol extends Statement {
    name: string
    id: UniqueId
    pm: ProtoModifiers
    methods: Method[]
    constructor(
        d: Decorators,
        n: string,
        pm: ProtoModifier[],
        i: UniqueId,
        m: Method[]
    ) {
        super(d)
        this.name = n
        this.id = i
        this.pm = parseProtoModifiers(pm)
        this.methods = m
    }
    emit(e: Emitter): void {
        e.emitProtocol(this)
    }
    isProtocol(): boolean {
        return true
    }
    doInventory(i: Inventory) {
        i.rpc = true
        i.unique = true
    }
}

export class Doc {
    line: number
    raw: string
    constructor(n: number, r: string) {
        this.line = n
        this.raw = r
    }
}

export class Decorators {
    doc: Doc | undefined | null
    constructor(d: Doc | null) {
        this.doc = d
    }
}

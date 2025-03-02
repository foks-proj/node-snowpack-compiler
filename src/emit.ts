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
    Option,
    Statement,
    Doc,
    Variant,
    Protocol,
    Method,
    Decorators,
    PrimitiveType,
    BaseImport,
    ImportFlavors,
} from './ast'

export abstract class Emitter {
    md: Metadata
    lines: string[]
    nTabs: number
    lastFrag: boolean
    imports: Map<string, ImportFlavors>
    constructor(m: Metadata) {
        this.md = m
        this.lines = []
        this.nTabs = 0
        this.lastFrag = false
        this.imports = new Map<string, ImportFlavors>()
    }

    storeImport(i: BaseImport): void {
        const flav = this.imports.get(i.name) || new ImportFlavors()
        flav.m.set(i.lang(), i)
        this.imports.set(i.name, flav)
    }

    abstract emitImportLibrary(i: BaseImport): void

    tab() {
        this.nTabs++
    }

    untab() {
        this.nTabs--
    }

    tabs(): string {
        return '\t'.repeat(this.nTabs)
    }

    abstract emitPreamble(r: Root): void

    async emit(r: Root): Promise<string> {
        this.emitPreamble(r)
        r.emit(this)
        return this.collectOutput()
    }

    emptyLine() {
        this.output('')
    }
    output(s: string) {
        return this._output(s, false)
    }
    outputFrag(s: string) {
        return this._output(s, true)
    }
    _output(s: string, frag: boolean) {
        if (this.lastFrag) {
            this.lines[this.lines.length - 1] += s
            this.lastFrag = false
        } else {
            this.lines.push(this.tabs() + s)
        }
        if (frag) {
            this.lastFrag = true
        } else if ((s === '}' || s === ')') && this.nTabs === 0) {
            this.lines.push('')
        }
    }
    collectOutput(): string {
        return this.lines.join('\n') + '\n'
    }

    emitStatementPremable(s: Statement): void {
        this.emitDecorators(s.decorators)
    }

    // This will work for any target language that has //-style comments
    // This isn't exact but it's close enough for now. Feel free to revisit
    // when it's wrong.
    emitDoc(d: Doc): void {
        const lines = d.raw.split('\n')
        const isEmpty = (s: string): boolean => {
            return !!s.match(/^\s*$/)
        }
        if (lines.length > 0 && isEmpty(lines[0])) {
            lines.shift()
        }
        if (lines.length > 0 && isEmpty(lines[lines.length - 1])) {
            lines.pop()
        }
        for (const line of lines) {
            this.output('// ' + line)
        }
    }

    emitDecorators(d: Decorators): void {
        if (!!d && !!d.doc) {
            this.emitDoc(d.doc)
        }
    }

    emitMethodArgs(i: Protocol, m: Method): void {
        const n = m.makeArgName(this) // this.exportSymbol(m.name) + 'Arg'
        const s = m.paramsToStruct(n)
        s.emit(this)
    }

    emitMethodsArgs(i: Protocol): void {
        for (const m of i.methods) {
            this.emitMethodArgs(i, m)
        }
    }

    abstract emitEnum(e: Enum): void
    abstract emitTypedef(t: Typedef): void
    abstract emitStruct(s: Struct): void
    abstract emitVariant(v: Variant): void
    abstract emitProtocol(p: Protocol): void
    abstract exportSymbol(s: string): string

    abstract getterMethodNameForConstant(name: string): string
    abstract getterMethodNameForBool(b: boolean): string
    abstract getterMethodNameForInt(i: number): string
    abstract toEnumConstant(t: Type, name: string): string
    abstract toEnumConstructor(t: Type, name: string): string
    abstract constructorNameForConstant(
        variantName: string,
        caseName: string
    ): string
    abstract constructorNameForBool(
        variantName: string,
        caseName: boolean
    ): string
    abstract constructorNameForInt(
        variantName: string,
        caseName: number
    ): string

    abstract emitExportPrimitiveType(
        p: PrimitiveType,
        params: string | null
    ): void
    abstract emitExportDerivedType(
        p: PrimitiveType,
        params: string | null
    ): void
    abstract emitExportList(l: List, params: string | null): void
    abstract emitExportUint(u: Uint, params: string | null): void
    abstract emitExportInt(u: Uint, params: string | null): void
    abstract emitExportOption(t: Type, params: string | null): void
    abstract emitExportBlob(b: Blob, params: string | null): void

    abstract emitImportOption(t: Type, parms: string | null): void
    abstract emitImportPrimitiveType(
        p: PrimitiveType,
        params: string | null
    ): void
    abstract emitImportList(l: List, params: string | null): void
    abstract emitImportUint(u: Uint, params: string | null): void
    abstract emitImportInt(i: Int, params: string | null): void
    abstract emitImportText(t: Text, params: string | null): void
    abstract emitImportBool(b: Bool, params: string | null): void
    abstract emitImportBlob(b: Blob, params: string | null): void
    abstract emitImportDerivedType(
        p: PrimitiveType,
        params: string | null
    ): void

    abstract methodArgName(methodName: string, argName: string | null): string
    abstract emitVoid(v: Void): void
    abstract emitUint(u: Uint): void
    abstract emitInt(i: Int): void
    abstract emitText(t: Text): void
    abstract emitBlob(b: Blob): void
    abstract emitBool(b: Bool): void
    abstract emitDerivedType(t: DerivedType): void
    abstract emitDerivedTypeInternal(t: DerivedType): void
    abstract emitList(l: List): void
    abstract emitListInternal(l: List): void
    abstract emitOption(o: Option): void
    abstract emitOptionInternal(o: Option): void
    abstract emitNil(): void
    abstract emitBlobToBytes(nm: string): void
    abstract emitBytesDowncast(klass: string, varName: string): void
    abstract emitTypedefBlobSize(b: Blob): void
    abstract emitFutureLink(parent: Type, child: string): void

    variantCasePositionToVariable(n: number): string {
        return `F_${n}__`
    }
}

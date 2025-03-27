import { readFile, writeFile, readdir } from 'fs/promises'
import { Parser } from './parser'
import * as astClasses from './ast'
import { TypeScriptEmitter } from './emit_ts'
import * as path from 'path'
import { GoEmitter } from './emit_go'
import { Emitter } from './emit'
import { Language } from './constants'

export const langMap = new Map<string, Language>([
    ['go', Language.Go],
    ['ts', Language.TypeScript],
])
const extMap = new Map<Language, string>([
    [Language.Go, 'go'],
    [Language.TypeScript, 'ts'],
])

function getLangExt(l: Language): string {
    const ret = extMap.get(l)
    if (!ret) {
        throw new Error(`no extention found for language ${l}`)
    }
    return ret
}

class File {
    name: string
    constructor(n: string) {
        this.name = n
    }

    isStdPipe(): boolean {
        return this.name.length === 0 || this.name === '-'
    }
    filename(def: string): string {
        return this.isStdPipe() ? def : this.name
    }
}

export class Infile extends File {
    constructor(n: string) {
        super(n)
    }

    async read(): Promise<string> {
        const fn = this.filename('/dev/stdin')
        const buf = await readFile(fn, 'utf8')
        return buf.toString()
    }
}

export class Outfile extends File {
    constructor(n: string) {
        super(n)
    }
    async write(d: string) {
        const fn = this.filename('/dev/stdout')
        await writeFile(fn, d)
    }
}

type PackageJson = {
    name: string
    version: string
    repository: { url: string }
}

export class Options {
    lang: Language
    infile: Infile | null
    outfile: Outfile | null
    package: string
    pjson: PackageJson
    inputDir: string | null
    outputDir: string | null
    ext: string
    constructor({
        lang,
        pkg,
        ext,
    }: {
        lang: Language
        pkg: string
        ext: string | null
    }) {
        this.lang = lang
        this.package = pkg
        this.infile = null
        this.outfile = null
        this.inputDir = null
        this.outputDir = null
        this.ext = ext || 'snowp'
        this.pjson = { name: '', version: '', repository: { url: '' } }
    }

    setInfile(s: string) {
        this.infile = new Infile(s)
    }

    setOutfile(s: string) {
        this.outfile = new Outfile(s)
    }

    setInputDirectory(s: string) {
        this.inputDir = s
    }
    setOutputDirectory(s: string) {
        this.outputDir = s
    }

    async readPackageJson(): Promise<void> {
        const fn = require.main?.filename || null
        if (!fn) {
            throw new Error('cannot read current package for package.json')
        }
        const appDir = path.dirname(fn)
        const dat = await readFile(path.join(appDir, '..', 'package.json'))
        this.pjson = JSON.parse(dat.toString()) as PackageJson
    }
}

export async function run(o: Options) {
    await new Runner(o).run()
}

function allocEmitter(m: Metadata): Emitter {
    switch (m.langague) {
        case Language.Go:
            return new GoEmitter(m)
        case Language.TypeScript:
            return new TypeScriptEmitter(m)
        default:
            throw new Error('no emitter for given langague')
    }
}

export class Metadata {
    infile: Infile
    outfile: Outfile
    pjson: PackageJson
    package: string
    langague: Language

    constructor(fp: FilePair, opts: Options) {
        this.infile = fp.i
        this.outfile = fp.o
        this.pjson = opts.pjson
        this.package = opts.package
        this.langague = opts.lang
    }

    async run() {
        const dat = await this.infile.read()
        process.stderr.write(
            `🏗️  compiling ${this.infile.filename('-')}` +
                ` → ${this.outfile.filename('-')}\n`
        )
        const parser = new Parser()
        parser.yy = astClasses
        const root = parser.parse(dat)
        const emitter = allocEmitter(this)
        const out = await emitter.emit(root)
        await this.outfile.write(out)
    }
}

class FilePair {
    i: Infile
    o: Outfile
    constructor(i: Infile, o: Outfile) {
        this.i = i
        this.o = o
    }

    async run(opts: Options) {
        await new Metadata(this, opts).run()
    }
}

class FileSet {
    files: FilePair[]
    constructor() {
        this.files = []
    }
    fromPair(i: Infile, o: Outfile) {
        this.files.push(new FilePair(i, o))
    }

    async fromDirectory(
        ind: string,
        outd: string,
        inExtension: string,
        outExtension: string
    ) {
        const files = await readdir(ind)
        files.forEach((f) => {
            const e = path.extname(f)
            const inExtWithDot = '.' + inExtension
            if (inExtWithDot === e) {
                const infile = path.join(ind, f)
                const outfile = path.join(
                    outd,
                    path.basename(f, inExtWithDot) + '.' + outExtension
                )
                this.fromPair(new Infile(infile), new Outfile(outfile))
            }
        })
    }

    static async alloc(opts: Options): Promise<FileSet> {
        const ret = new FileSet()
        if (opts.inputDir) {
            await ret.fromDirectory(
                opts.inputDir,
                opts.outputDir || opts.inputDir,
                opts.ext,
                getLangExt(opts.lang)
            )
        } else if (opts.infile && opts.outfile) {
            ret.fromPair(opts.infile, opts.outfile)
        } else {
            throw new Error('no files!')
        }
        return ret
    }
}

export class Runner {
    opts: Options
    constructor(o: Options) {
        this.opts = o
    }

    async run() {
        await this.opts.readPackageJson()
        const fileSet = await FileSet.alloc(this.opts)
        for (const f of fileSet.files) {
            await f.run(this.opts)
        }
    }
}

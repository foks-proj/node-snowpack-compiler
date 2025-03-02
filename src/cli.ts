import { Command } from 'commander'
import { Options, run, langMap } from './main'
import { lstat } from 'fs/promises'
import { Language } from './constants'

async function isDir(path: string): Promise<boolean> {
    try {
        const stat = await lstat(path)
        return stat.isDirectory()
    } catch (e) {
        // lstatSync throws an error if path doesn't exist
        return false
    }
}

function parseOpts(): Options {
    const program = new Command()
    program
        .requiredOption('-l, --lang <lang>', 'which languge to output for')
        .option('-d, --input-dir <dir>', 'process all files in a directory')
        .option(
            '-D, --output-dir <dir>',
            'to be used with -d, output to this directory'
        )
        .option(
            '-i, --input <file>',
            'input file name (or - for standard input)'
        )
        .option(
            '-o, --output <file>',
            'output file name (or - for standard output)'
        )
        .option(
            '-e, --extension <extension>',
            'specifcy extension to search for (default .snowp)'
        )
        .requiredOption('-p, --package <pkg>', 'the containing Go package name')
    program.parse(process.argv)
    const options = program.opts()
    const langString = options.lang as string
    const lang = langString
        ? langMap.get(langString) || Language.None
        : Language.None
    if (lang === Language.None) {
        throw new Error(
            "no valid language given via -l; can only support 'go' right now"
        )
    }
    const ret = new Options({
        lang,
        pkg: options.package,
        ext: options.extension,
    })

    const id = options.inputDir
    const od = options.outputDir
    if (!!id) {
        if (!isDir(id)) {
            throw new Error(`input directory ${id} does not exit`)
        }
        ret.setInputDirectory(id)
    }

    if (!!od) {
        if (!isDir(od)) {
            throw new Error(`output directory ${od} does not exist`)
        }
        ret.setOutputDirectory(options.outputDir)
        if (!options.inputDir) {
            throw new Error('can only use --outputDir with --inputDir')
        }
    }

    if ((!!id || !!od) && (!!options.input || !!options.output)) {
        throw new Error('Can either use -d or (-i and -o) but not both')
    }

    ret.setInfile((options.input as string) || '-')
    ret.setOutfile((options.output as string) || '-')
    return ret
}

async function main() {
    const opts = parseOpts()
    await run(opts)
}

main()

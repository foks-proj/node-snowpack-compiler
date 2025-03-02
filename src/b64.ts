// This is here just an example of how generate charMap, in case we need to
// regenerate it, but we're not using this code.
const charMapGenerator = [...Array(10).keys()]
    .map((x) => x.toString())
    .concat(
        [...Array(26).keys()].map((x) =>
            String.fromCharCode('a'.charCodeAt(0) + x)
        )
    )
    .concat(
        [...Array(26).keys()].map((x) =>
            String.fromCharCode('A'.charCodeAt(0) + x)
        )
    )
    .concat(['-', '_'])

const charMap = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '-',
    '_',
]

export const be64encode = (n: number): string => {
    const tmp = []
    let first = true
    while (n > 0 || first) {
        const low = n & 0x3f
        tmp.push(charMap[low])
        n = n >> 6
        first = false
    }
    return tmp.reverse().join('')
}

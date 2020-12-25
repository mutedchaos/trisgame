export default class Shape {
  variants = new Set<string>()

  constructor(shape: string) {
    const mainShape = normalizeShape(shape)
    for (const mirror of [0, 1, 2]) {
      for (const rotate of [0, 1, 2, 3]) {
        let s = mainShape
        let r = rotate
        while (r--) {
          s = doRotate(s)
        }
        if (mirror === 1) s = doMirror(s)
        if (mirror === 2) s = doMirror2(s)

        this.variants.add(s)
      }
    }
  }

  getOffsets(variant: number, width: number) {
    let variants = Array.from(this.variants)
    const data = variants[variant % variants.length]
    const lines = data.split('\n')
    const offset = Math.floor(lines.length / 2)
    console.log('o', offset)

    return Array.from(getOffsetsImpl())

    function* getOffsetsImpl() {
      for (let col = 0; col < lines.length; ++col) {
        for (let row = 0; row < lines.length; ++row) {
          if (lines[row][col] !== ' ') {
            yield (row - offset) * width + col - offset
          }
        }
      }
    }
  }
}

function normalizeShape(s: string) {
  const lines = s.split('\n')
  const nonEmpties = lines.filter(l => l.trim())
  const indent = nonEmpties.reduce((indent, line) => Math.min(indent, line.match(/^\s*/)![0].length), Infinity)
  const withIndentRemoved = nonEmpties.map(l => l.trimEnd().substring(indent))
  const dimension = Math.max(withIndentRemoved.length, ...withIndentRemoved.map(l => l.length))
  const withEmptiesAdded = addEmptiesTo(withIndentRemoved, dimension)
  const withEmptyOffsets = withEmptiesAdded.map(line => line.padEnd(dimension, ' '))
  const rightPad = withEmptyOffsets.reduce((indent, line) => Math.min(indent, line.match(/\s*$/)![0].length), Infinity)
  const transferPad = Math.floor(rightPad / 2)
  if (transferPad) {
    return withEmptyOffsets.map(x => x.substr(0, x.length - transferPad).padStart(x.length, ' ')).join('\n')
  }
  return withEmptyOffsets.join('\n')
}

function addEmptiesTo(s: string[], l: number): string[] {
  if (s.length >= l) return s
  const padded = ['', ...s, '']
  if (padded.length < l) {
    return addEmptiesTo(padded, l)
  }
  if (padded.length > l) {
    return padded.slice(1)
  }
  return padded
}

function doMirror(s: string) {
  return s.split('\n').reverse().join('\n')
}
function doMirror2(s: string) {
  return s
    .split('\n')
    .map(x => x.split('').reverse().join(''))
    .join('\n')
}

function doRotate(s: string) {
  const lines = s.split('\n')
  const newLines = [...lines].fill('')
  for (let i = 0; i < lines.length; ++i) {
    for (let c = 0; c < lines.length; ++c) {
      newLines[i] += lines[c][i]
    }
  }
  return newLines.join('\n')
}

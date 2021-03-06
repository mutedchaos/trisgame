export default class Shape {
  private constructor(private shape: string, public color: string) {}

  public get shapeString() {
    return this.shape
  }

  static from(str: string) {
    const variants = new Set<string>()
    const [color] = str.split('\n')
    const mainShape = normalizeShape(str)
    for (const rotate of [0, 1, 2, 3]) {
      for (const mirror of [0, 1, 2, 3]) {
        let s = mainShape
        let r = rotate
        while (r--) {
          s = doRotate(s)
        }
        if (mirror === 1 || mirror === 3) s = doMirror2(s)
        if (mirror === 2 || mirror === 3) s = doMirror(s)

        variants.add(s)
      }
    }
    return Array.from(variants).map(s => new Shape(s, color))
  }

  getOffsets(width: number) {
    const data = this.shape
    const lines = data.split('\n')
    return Array.from(getOffsetsImpl())

    function* getOffsetsImpl() {
      for (let col = 0; col < lines[0].length; ++col) {
        for (let row = 0; row < lines.length; ++row) {
          if (lines[row][col] !== ' ') {
            yield row * width + col
          }
        }
      }
    }
  }

  getGrid() {
    const lines = this.shape.split('\n')
    const length = lines[0].length
    return Array(lines.length)
      .fill('')
      .map((_, row) => {
        return Array(length)
          .fill('')
          .map((_, col) => lines[row][col] !== ' ')
      })
  }

  equals(other: Shape) {
    return this.shape === other.shape
  }
}

function normalizeShape(s: string) {
  const lines = s.split('\n').slice(1)
  const nonEmpties = lines.filter(l => l.trim())
  const indent = nonEmpties.reduce((indent, line) => Math.min(indent, line.match(/^\s*/)![0].length), Infinity)
  const withIndentRemoved = nonEmpties.map(l => l.trimEnd().substring(indent))
  const length = Math.max(...withIndentRemoved.map(x => x.length))
  const equalizedLength = withIndentRemoved.map(x => x.padEnd(length, ' '))
  return equalizedLength.join('\n')
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
  const newLines = Array(lines[0].length)
    .fill('')
    .map(() => Array<string>(lines.length).fill('x'))

  return newLines
    .map((row, rowN) =>
      row
        .map((_, colN) => {
          return lines[colN][lines[0].length - rowN - 1]
        })
        .join('')
    )
    .join('\n')
}

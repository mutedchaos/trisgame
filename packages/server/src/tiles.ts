import fs from 'fs'
import flatten from 'lodash/flatten'
import shuffle from 'lodash/shuffle'

const defaultTileset = {
  starting: loadTiles('starting'),
  main: flatten(['1', '2', '3', '4', '5', '6', '7'].map(loadTiles)),
}

function loadTiles(set: string) {
  const data = fs.readFileSync(__dirname + '/tiles/' + set + '.txt', 'utf-8')
  const lines = data.split('\n')
  const color = lines[0]
  const dataSegments = lines.slice(1).join('\n').split('--')
  const datas = dataSegments.filter(segment => segment.trim())

  return datas.map(row => `${color}\n${row}`)
}

export function getStartingTiles() {
  return shuffle(defaultTileset.starting)
}

export function getMainTiles() {
  return shuffle(defaultTileset.main)
}

export function withFallbackTile(tile?: string) {
  if (tile) return tile
  return 'black\n xx \nxxxx\nxxxx\n xx '
}

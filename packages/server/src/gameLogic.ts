import { Borders, CellData, GamePhase, GameState, Shape } from '@tris/common'
import { getMainTiles, getStartingTiles } from './tiles'
import { persistGame } from './persistence'

export async function startGame(game: GameState) {
  if (game.phase !== GamePhase.WaitingForPlayers && game.phase !== GamePhase.GameOver) {
    throw new Error('Not ready to start game')
  }
  const startingTiles = getStartingTiles()
  game.phase = GamePhase.PlacingStartingTiles

  for (const player of game.players) {
    player.awaitingTile = true
    player.personalTiles = [startingTiles.shift()!]
    player.gameOver = false
  }
  game.tileOptions = []
  game.secrets = { remainingTiles: getMainTiles() }
  await persistGame(game)
}

export async function addShape(game: GameState, playerId: string, shape: string, index: number) {
  const player = game.players.find(p => p.id === playerId)!
  if (!player.awaitingTile) return
  const shapeObj = getValidShape(player.personalTiles ?? game.tileOptions, shape)
  if (!shapeObj) throw new Error('Shape not valid')
  const offsets = shapeObj.getOffsets(game.width)
  const indexes = offsets.map(o => o + index)
  if (indexes.some(i => !player.cells[i])) return
  if (indexes.some(i => player.cells[i].data !== CellData.EMPTY && player.cells[i].data !== CellData.CENTER)) return
  if (game.phase === GamePhase.PlacingStartingTiles && !indexes.some(i => player.cells[i].data === CellData.CENTER))
    return

  // looks good
  const { width } = game
  for (const i of indexes) {
    player.cells[i] = {
      data: CellData.FILLED,
      color: shapeObj.color,
      borders:
        (indexes.includes(i - width) ? Borders.Top : 0) +
        (indexes.includes(i + width) ? Borders.Bottom : 0) +
        (indexes.includes(i + 1) ? Borders.Right : 0) +
        (indexes.includes(i - 1) ? Borders.Left : 0),
    }
  }
  player.personalTiles = null
  player.awaitingTile = false
  await persistGame(game)

  await checkForEndOfTurn(game)
}

async function checkForEndOfTurn(game: GameState) {
  if (game.players.every(p => !p.awaitingTile)) {
    await startNextTurn(game)
  }
}

async function startNextTurn(game: GameState) {
  game.phase = GamePhase.RegularGame
  game.tileOptions = [game.secrets!.remainingTiles.shift()!, game.secrets!.remainingTiles.shift()!]
  for (const player of game.players) {
    if (!player.gameOver) {
      player.awaitingTile = true
    }
  }
  ++game.turn
  await persistGame(game)
}

function getValidShape(tileOptions: string[], proposedTile: string): Shape | null {
  for (const option of tileOptions) {
    for (const shape of Shape.from(option)) {
      if (shape.shapeString === proposedTile) return shape
    }
  }
  return null
}

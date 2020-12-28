import { Borders, CellData, GamePhase, GameState, Shape } from '@tris/common'
import { getMainTiles, getStartingTiles, withFallbackTile } from './tiles'
import { persistGame } from './persistence'

export async function startGame(game: GameState) {
  if (game.phase !== GamePhase.WaitingForPlayers && game.phase !== GamePhase.GameOver) {
    throw new Error('Not ready to start game')
  }
  const startingTiles = getStartingTiles()
  game.phase = GamePhase.PlacingStartingTiles
  game.bonusPointsAllocated = false

  for (const player of game.players) {
    player.awaitingTile = true
    player.personalTiles = [withFallbackTile(startingTiles.shift())]
    player.gameOver = false
    player.previousRoundScore = 0
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
  if (game.phase !== GamePhase.RegularGame && game.phase !== GamePhase.PlacingStartingTiles) return

  if (game.players.every(p => !p.awaitingTile)) {
    await startNextTurn(game)
  }
}

async function startNextTurn(game: GameState) {
  if (game.players.some(p => p.gameOver) && !game.bonusPointsAllocated && game.players.length > 1) {
    game.bonusPointsAllocated = true
    for (const player of game.players.filter(p => p.gameOver)) {
      const tile = player.cells.find(c => c.data === CellData.EMPTY)
      if (tile) {
        tile.data = CellData.BONUS
      }
    }
    await persistGame(game)
  }
  game.phase = GamePhase.RegularGame
  game.tileOptions = [
    withFallbackTile(game.secrets!.remainingTiles.shift()),
    withFallbackTile(game.secrets!.remainingTiles.shift()),
  ]
  for (const player of game.players) {
    if (!player.gameOver) {
      player.awaitingTile = true
    }
  }
  ++game.turn
  await persistGame(game)
}

export async function giveUp(game: GameState, playerId: string) {
  // TODO: check if permitted
  if (game.phase !== GamePhase.RegularGame) return
  const player = game.players.find(p => p.id === playerId)!

  if (player.gameOver) return
  if (player.personalTiles) {
    player.gameOver = true
  } else {
    player.personalTiles = [withFallbackTile(game.secrets!.remainingTiles.shift())]
  }

  await persistGame(game)
  await checkGameOver(game)
  await checkForEndOfTurn(game)
}

async function checkGameOver(game: GameState) {
  if (game.players.every(g => g.gameOver)) {
    for (const player of game.players) {
      player.previousRoundScore = player.cells.filter(c => c.data === CellData.EMPTY).length
      player.overallScore += player.previousRoundScore
    }
    const maxScore = Math.max(...game.players.map(p => p.previousRoundScore))
    for (const player of game.players) {
      if (player.previousRoundScore === maxScore) {
        player.roundsWon++
      }
    }

    game.phase = GamePhase.GameOver

    await persistGame(game)
  }
}

function getValidShape(tileOptions: string[], proposedTile: string): Shape | null {
  for (const option of tileOptions) {
    for (const shape of Shape.from(option)) {
      if (shape.shapeString === proposedTile) return shape
    }
  }
  return null
}

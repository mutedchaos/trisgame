import { GamePhase, GameState } from '@tris/common'
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

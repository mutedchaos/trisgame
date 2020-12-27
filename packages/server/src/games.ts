import { v4 as uuid } from 'uuid'
import { CellData, GamePhase, GameState } from '@tris/common'
import { getGameIdByCode, getPersistedGame, persistCode, persistGame, persistPlayer } from './persistence'

const games = new Map<string, GameState>()

export async function getGame(gameId: string) {
  if (games.has(gameId)) {
    return games.get(gameId)!
  }
  const persisted = await getPersistedGame(gameId)
  if (persisted) {
    games.set(gameId, persisted)
  }
  return persisted
}

export async function createGame(playerName: string) {
  const code = await generateCode()
  const gameId = uuid()

  const game: GameState = {
    v: 0,
    code,
    id: gameId,
    phase: GamePhase.WaitingForPlayers,
    tileOptions: [],
    width: 9,
    height: 9,
    players: [],
  }

  games.set(gameId, game)
  await persistGame(game)
  await persistCode(code, gameId)
  return await joinGame(playerName, gameId)
}

export async function joinGame(playerName: string, gameId: string) {
  const playerId = uuid()

  const game = await getGame(gameId)

  if (game?.phase !== GamePhase.WaitingForPlayers) throw new Error('Game does not accept players any more')
  const cells = Array(game.width * game.height)
    .fill('')
    .map(() => ({
      data: CellData.EMPTY,
    }))
  cells[Math.floor(cells.length / 2)].data = CellData.CENTER

  game.players.push({
    id: playerId,
    name: playerName,
    awaitingTile: false,
    gameOver: false,
    cells,
    initialTile: 'white\nx',
  })
  await persistPlayer(playerId, gameId)
  await persistGame(game)
  return playerId
}

async function generateCode(): Promise<string> {
  const code = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0')
  if (await getGameIdByCode(code)) return generateCode()
  return code
}

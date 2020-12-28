import { v4 as uuid } from 'uuid'
import { GamePhase, GameState } from '@tris/common'
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
    turn: 0,
    bonusPointsAllocated: false,
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

export async function joinGameByCode(playerName: string, code: string) {
  const gameId = await getGameIdByCode(code)
  if (!gameId) throw new Error('Invalid code')
  return joinGame(playerName, gameId)
}

export async function joinGame(playerName: string, gameId: string) {
  const playerId = uuid()

  const game = await getGame(gameId)

  if (game?.phase !== GamePhase.WaitingForPlayers) throw new Error('Game does not accept players any more')

  game.players.push({
    id: playerId,
    name: playerName,
    awaitingTile: false,
    gameOver: false,
    cells: [],
    personalTiles: [],
    overallScore: 0,
    roundsWon: 0,
    previousRoundScore: 0,
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

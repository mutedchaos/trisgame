import Redis from 'ioredis'
import { GameState } from '@tris/common'
import { getIOS } from './ios'

const redis = new Redis('redis://localhost:6379')

export function persistCode(code: string, gameId: string) {
  return redis.setex('tris-code-' + code, 60 * 60, gameId)
}

export function persistPlayer(playerId: string, gameId: string) {
  return redis.setex('tris-player-' + playerId, 60 * 60 * 48, gameId)
}

export function getPlayerGame(playerId: string) {
  return redis.get('tris-player-' + playerId)
}

export function getGameIdByCode(code: string) {
  return redis.get('tris-code-' + code)
}

export async function persistGame(game: GameState) {
  ++game.v
  await redis.setex('tris-game-' + game.id, 60 * 60, JSON.stringify(game))
  getIOS()
    .in('game-' + game.id)
    .emit('game-state', game)
}

export async function getPersistedGame(gameId: string): Promise<GameState | null> {
  const str = await redis.get('tris-game-' + gameId)
  return str ? JSON.parse(str) : null
}

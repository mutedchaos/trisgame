import { Socket } from 'socket.io'
import { GameState, SocketMessage } from '@tris/common'
import { startGame } from './gameLogic'
import { getGame } from './games'

export function attachSocketListeners(socket: Socket) {
  socket.on(SocketMessage.START, async () => {
    let game = await getSocketGame(socket)
    if (!game) throw new Error('Game gone')
    handleStart(game, getSocketPlayer(socket))
  })
}

function handleStart(game: GameState, playerId: string) {
  if (game.players[0].id !== playerId) throw new Error('Not owner')
  startGame(game)
}

function getSocketPlayer(socket: Socket): string {
  return (socket.handshake.query as any).playerId
}

function getSocketGame(socket: Socket) {
  const gameId = Array.from(socket.rooms)
    .find(r => r.startsWith('game-'))!
    .substring(5)
  return getGame(gameId)
}

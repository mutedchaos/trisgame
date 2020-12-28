import { Socket } from 'socket.io'
import { SocketMessage } from '@tris/common'
import { addShape, giveUp, startGame } from './gameLogic'
import { getGame } from './games'

export function attachSocketListeners(socket: Socket) {
  socket.on(SocketMessage.START, async () => {
    const game = await getSocketGame(socket)
    if (!game) throw new Error('Game gone')
    if (game.players[0].id !== getSocketPlayer(socket)) throw new Error('Not owner')
    startGame(game)
  })

  socket.on(SocketMessage.ADD, async arg => {
    const game = await getSocketGame(socket)
    if (!game) throw new Error('Game gone')
    if (typeof arg !== 'object' || !arg || typeof arg.shape !== 'string' || typeof arg.index !== 'number') {
      throw new Error('Invalid args')
    }
    addShape(game, getSocketPlayer(socket), arg.shape, arg.index)
  })

  socket.on(SocketMessage.GIVE_UP, async () => {
    const game = await getSocketGame(socket)
    if (!game) throw new Error('Game gone')

    giveUp(game, getSocketPlayer(socket))
  })
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

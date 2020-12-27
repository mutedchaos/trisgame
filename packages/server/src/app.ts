import express from 'express'
import ioServer, { Socket } from 'socket.io'
import { setIOS } from './ios'
import { createGame, getGame, joinGame } from './games'
import { getPlayerGame, persistGame } from './persistence'

async function run() {
  const app = express()
  const server = app.listen(3001)

  app.post('/game', async (req, res) => {
    try {
      const name = req.query.name
      if (!name || typeof name !== 'string') throw new Error('No name')
      const id = await createGame(name)
      res.send({ id })
    } catch (err) {
      res.send(err.message)
    }
  })
  app.post('/join', async (req, res) => {
    try {
      const name = req.query.name
      const code = req.query.code
      if (!name || typeof name !== 'string') throw new Error('No name')
      if (!code || typeof code !== 'string') throw new Error('No code')
      const id = await joinGame(name, code)
      res.send({ id })
    } catch (err) {
      res.send(err.message)
    }
  })

  const ios = new ioServer.Server(server)

  ios.on('connection', async (socket: Socket) => {
    try {
      const playerId = (socket.handshake.query as any).playerId as any
      if (!playerId || typeof playerId !== 'string') throw new Error('No or invalid player id')
      const gameId = await getPlayerGame(playerId)
      if (!gameId) throw new Error('No game for player')
      const game = await getGame(gameId)
      if (!game) throw new Error('Game not found')
      await socket.join('game-' + gameId)
      await persistGame(game)
    } catch (err) {
      console.error(err.stack)
      socket.disconnect(true)
    }
  })
  setIOS(ios)
}

run().catch(err => {
  console.error(err.stack)
  process.exit(88)
})

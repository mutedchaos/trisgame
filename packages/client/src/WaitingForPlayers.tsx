import { useCallback, useContext } from 'react'
import { SocketMessage } from '@tris/common'
import useIsOwner from './useIsOwner'
import { socketContext } from './socketContext'
import { gameStateContext } from './GameStateContext'
import OwnerIndicator from './OwnerIndicator'

export default function WaitingForPlayers() {
  const isOwner = useIsOwner()
  const { sendMessage } = useContext(socketContext)
  const gameState = useContext(gameStateContext)
  const startGame = useCallback(() => {
    sendMessage(SocketMessage.START)
  }, [sendMessage])
  return (
    <div>
      <h1>Getting ready to start the game</h1>
      <p>
        To let someone join, pass them the code <strong>{gameState.code}</strong>
      </p>
      <h2>Players in the game:</h2>
      <ul>
        {gameState.players.map((player, i) => (
          <li key={player.id}>
            {player.name} {i === 0 && <OwnerIndicator />}
          </li>
        ))}
      </ul>
      {isOwner && (
        <>
          <p>
            When all the players are in the game, press the button to start the game. No other players can join
            afterwards.
          </p>
          <button onClick={startGame}>Start game</button>
        </>
      )}
    </div>
  )
}

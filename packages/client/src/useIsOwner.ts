import { useContext } from 'react'
import { playerIdContext } from './PlayerIdContext'
import { gameStateContext } from './GameStateContext'

export default function useIsOwner() {
  const playerId = useContext(playerIdContext)
  const gameState = useContext(gameStateContext)
  return gameState.players[0].id === playerId
}

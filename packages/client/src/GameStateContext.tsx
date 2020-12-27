import { GameState } from '@tris/common'
import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { socketContext } from './socketContext'
import { selectedShapeContext } from './selectedShapeContext'

export const gameStateContext = React.createContext<GameState>(null as any)

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const { subscribe } = useContext(socketContext)
  const { selectShape } = useContext(selectedShapeContext)
  useEffect(() => {
    subscribe(setGameState)
  }, [subscribe])
  useEffect(() => {
    gameState?.turn.valueOf()
    selectShape(null, 0, 0)
  }, [selectShape, gameState?.turn])

  if (!gameState) return null

  return <gameStateContext.Provider value={gameState}>{children}</gameStateContext.Provider>
}

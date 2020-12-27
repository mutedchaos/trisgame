import { GameState } from '@tris/common'
import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { socketContext } from './socketContext'

export const gameStateContext = React.createContext<GameState>(null as any)

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const { subscribe } = useContext(socketContext)
  useEffect(() => {
    subscribe(setGameState)
  }, [subscribe])
  if (!gameState) return null
  return <gameStateContext.Provider value={gameState}>{children}</gameStateContext.Provider>
}

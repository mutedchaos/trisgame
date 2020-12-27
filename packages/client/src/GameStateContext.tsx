import { CellData, GamePhase, GameState } from '@tris/common'
import React, { ReactNode, useState } from 'react'

export const gameStateContext = React.createContext<GameState>(null as any)

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [gameState] = useState<GameState>({
    width: 9,
    height: 9,
    phase: GamePhase.PlacingStartingTiles,
    players: [
      {
        id: 'a',
        cells: Array(81)
          .fill('x')
          .map(x => ({
            data: CellData.EMPTY,
          })),
        gameOver: false,
        initialTile: 'red\nxxx\nx',
        awaitingTile: true,
      },
    ],
    tileOptions: [],
  })
  return <gameStateContext.Provider value={gameState}>{children}</gameStateContext.Provider>
}

import React, { ReactNode, useContext } from 'react'
import { GameState } from '@tris/common'
import { playerIdContext } from './PlayerIdContext'
import { gameStateContext } from './GameStateContext'

type MyPlayerType = GameState['players'][number]

export const myPlayerContext = React.createContext<MyPlayerType>(null as any)

interface Props {
  children: ReactNode
}
export function MyPlayerProvider({ children }: Props) {
  const playerId = useContext(playerIdContext)
  const { players } = useContext(gameStateContext)
  const playerInfo = players.find(p => p.id === playerId)
  if (!playerInfo) throw new Error('Player info not found')

  return <myPlayerContext.Provider value={playerInfo}>{children}</myPlayerContext.Provider>
}

import React, { ReactNode } from 'react'

export const playerIdContext = React.createContext<string>('')

export function PlayerIdProvider({ children, playerId }: { children: ReactNode; playerId: string }) {
  return <playerIdContext.Provider value={playerId}>{children}</playerIdContext.Provider>
}

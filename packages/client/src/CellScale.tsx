import React, { ReactNode, useContext } from 'react'

const cellScaleContext = React.createContext<number>(1)

export function CellScale({ children, scale }: { children: ReactNode; scale: number }) {
  return <cellScaleContext.Provider value={scale}>{children}</cellScaleContext.Provider>
}

export function useCellScale() {
  return useContext(cellScaleContext)
}

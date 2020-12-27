import { Shape } from '@tris/common'
import React, { ReactNode, useMemo, useState } from 'react'

interface Ctx {
  shape: Shape | null
  selectShape(shape: Shape | null): void
}

export const selectedShapeContext = React.createContext<Ctx>(null as any)

export function SelectedShapeProvider({ children }: { children: ReactNode }) {
  const [shape, setShape] = useState<Shape | null>(null)
  const value = useMemo(() => ({ shape, selectShape: setShape }), [shape])
  return <selectedShapeContext.Provider value={value}>{children}</selectedShapeContext.Provider>
}

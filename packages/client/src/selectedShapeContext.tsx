import { Shape } from '@tris/common'
import React, { ReactNode, useCallback, useMemo, useState } from 'react'

interface Ctx {
  shape: Shape | null
  selectShape(shape: Shape | null, offsetX: number, offsetY: number): void
  offsetX: number
  offsetY: number
}

export const selectedShapeContext = React.createContext<Ctx>(null as any)

export function SelectedShapeProvider({ children }: { children: ReactNode }) {
  const [shape, setShape] = useState<Shape | null>(null)
  const [offset, setOffset] = useState({ offsetX: 0, offsetY: 0 })

  const selectShape = useCallback<Ctx['selectShape']>((shape, offsetX, offsetY) => {
    setShape(shape)
    setOffset({ offsetX, offsetY })
  }, [])

  const value = useMemo(() => ({ shape, selectShape, ...offset }), [offset, selectShape, shape])
  return <selectedShapeContext.Provider value={value}>{children}</selectedShapeContext.Provider>
}

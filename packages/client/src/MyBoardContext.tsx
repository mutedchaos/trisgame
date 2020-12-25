import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import produce from 'immer'
import Shape from './Shape'
export enum Cell {
  EMPTY,
  INVALID,
  SEMIVALID,
  VALID,
  FILLED,
  CENTER,
}

interface MyBoardType {
  width: number
  height: number
  cells: Cell[]
  fillColor?: string
  hover(index: number): void
  click(index: number): void
}

export const myBoardContext = React.createContext<MyBoardType>(null as any)

interface Props {
  width: number
  height: number
  children: ReactNode
  shape: Shape
}
export function MyBoardProvider({ children, width, height, shape }: Props) {
  const [savedCells, setSavedCells] = useState<Cell[]>([])
  const [cells, setCells] = useState<Cell[]>([])
  const [rotation, setRotation] = useState(0)
  const [hovered, setHovered] = useState(-1)

  useEffect(() => {
    setCells(
      produce(savedCells, t => {
        const offsets = shape.getOffsets(rotation, width)
        const cells = offsets.map(i => t[hovered + i])
        const valid = cells.every(c => c === Cell.EMPTY)
        for (const offset of offsets) {
          t[hovered + offset] = valid ? Cell.VALID : t[hovered + offset] === Cell.EMPTY ? Cell.SEMIVALID : Cell.INVALID
        }
      })
    )
  }, [savedCells, hovered, shape, rotation, width])

  const handleClick = useCallback(() => {
    setSavedCells(cells.map((c, i) => (c === Cell.VALID ? Cell.FILLED : savedCells[i])))
    setRotation(old => old + 1)
  }, [cells, savedCells])

  useEffect(() => {
    setSavedCells(Array(width * height).fill(Cell.EMPTY))
  }, [width, height])
  const value = useMemo<MyBoardType>(() => ({ width, height, cells, hover: setHovered, click: handleClick }), [
    width,
    height,
    cells,
    handleClick,
  ])

  return <myBoardContext.Provider value={value}>{children}</myBoardContext.Provider>
}

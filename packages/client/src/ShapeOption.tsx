import { Borders, CellData, Shape } from '@tris/common'
import CellView from './CellView'
import { useCallback, useContext, useMemo } from 'react'
import { selectedShapeContext } from './selectedShapeContext'

interface Props {
  shape: Shape
}

export default function ShapeOption({ shape }: Props) {
  const grid = useMemo(() => shape.getGrid(), [shape])
  const { shape: selected, selectShape } = useContext(selectedShapeContext)

  const doSelectShape = useCallback(
    (col: number, row: number) => {
      selectShape(shape, col, row)
    },
    [selectShape, shape]
  )
  return (
    <div
      className={`shape-option ${selected && shape.equals(selected) && 'selected'}`}
      onClick={() => doSelectShape(0, 0)}
    >
      {grid.map((row, rowN) => (
        <div key={rowN}>
          {row.map((cell, colN) => (
            <span
              key={colN}
              onClick={e => {
                e.stopPropagation()
                doSelectShape(colN, rowN)
              }}
            >
              <CellView
                type={cell ? CellData.FILLED : CellData.EMPTY}
                color={shape.color}
                borders={
                  !cell
                    ? undefined
                    : (grid[rowN - 1]?.[colN] ? Borders.Top : 0) +
                      (grid[rowN + 1]?.[colN] ? Borders.Bottom : 0) +
                      (grid[rowN]?.[colN + 1] ? Borders.Right : 0) +
                      (grid[rowN]?.[colN - 1] ? Borders.Left : 0)
                }
              />
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

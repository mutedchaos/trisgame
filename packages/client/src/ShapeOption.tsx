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
      const { col: finalCol, row: finalRow } = findClosestFilled(grid, col, row)
      selectShape(shape, finalCol, finalRow)
    },
    [grid, selectShape, shape]
  )
  return (
    <div
      className={`shape-option ${selected && shape.equals(selected) && 'selected'}`}
      onClick={() => doSelectShape(0, 0)}
    >
      {grid.map((row, rowN) => (
        <div key={rowN} className={'preview-row'}>
          {row.map((cell, colN) => (
            <div
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
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function findClosestFilled(grid: boolean[][], col: number, row: number) {
  const coeffs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]
  if (grid[row][col]) return { col, row }
  for (let distanceA = 1; true; ++distanceA) {
    for (let distanceB = 0; distanceB <= distanceA; ++distanceB) {
      for (const coeff of coeffs) {
        const testCol = col + distanceA * coeff[0] + distanceB * coeff[1]
        const testRow = row + distanceA * coeff[1] + distanceB * coeff[0]
        if (testCol < 0 || testRow < 0 || testRow >= grid.length || testCol >= grid[row].length) continue
        if (grid[testRow][testCol]) {
          return { row: testRow, col: testCol }
        }
      }
    }
  }
}

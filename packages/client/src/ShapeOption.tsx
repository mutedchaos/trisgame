import { CellData, Shape } from '@tris/common'
import CellView from './CellView'
import { useCallback, useContext, useMemo } from 'react'
import { selectedShapeContext } from './selectedShapeContext'

interface Props {
  shape: Shape
}

export default function ShapeOption({ shape }: Props) {
  const grid = useMemo(() => shape.getGrid(), [shape])
  const { shape: selected, selectShape } = useContext(selectedShapeContext)

  const doSelectShape = useCallback(() => {
    selectShape(shape)
  }, [selectShape, shape])
  return (
    <div className={`shape-option ${selected && shape.equals(selected) && 'selected'}`} onClick={doSelectShape}>
      {grid.map((row, i) => (
        <div key={i}>
          {row.map((cell, i) => (
            <CellView key={i} type={cell ? CellData.FILLED : CellData.EMPTY} color={shape.color} />
          ))}
        </div>
      ))}
    </div>
  )
}

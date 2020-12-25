import { useContext, useMemo } from 'react'
import { myBoardContext } from './MyBoardContext'
import Cell from './Cell'

export default function BoardView() {
  const { width, height } = useContext(myBoardContext)

  const rows = useMemo(() => Array(height).fill(0), [height])
  const cols = useMemo(() => Array(width).fill(0), [width])

  return (
    <div>
      {rows.map((_, row) => (
        <div key={row} className={'row'}>
          {cols.map((_, col) => (
            <Cell key={col} index={row * width + col} />
          ))}
        </div>
      ))}
    </div>
  )
}

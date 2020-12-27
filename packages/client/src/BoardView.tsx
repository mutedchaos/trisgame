import { useContext, useMemo } from 'react'
import Cell from './Cell'
import { gameStateContext } from './GameStateContext'

export default function BoardView() {
  const { width, height } = useContext(gameStateContext)

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

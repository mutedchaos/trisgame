import './Cell.css'
import { useCallback, useContext } from 'react'
import { myBoardContext } from './MyBoardContext'
import CellView from './CellView'

interface Props {
  index: number
}

export default function Cell({ index }: Props) {
  const { cells, hover, click } = useContext(myBoardContext)
  const value = cells[index]
  const onHover = useCallback(() => hover(index), [hover, index])
  const onClick = useCallback(() => click(index), [click, index])

  if (!value) throw new Error('Missing cell ' + index)

  return (
    <div onMouseEnter={onHover} onClick={onClick} className={'cell-container'}>
      <CellView type={value.data} color={value.color} />
    </div>
  )
}

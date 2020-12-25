import './Cell.css'
import { useCallback, useContext } from 'react'
import { myBoardContext } from './MyBoardContext'

interface Props {
  index: number
}
export default function Cell({ index }: Props) {
  const { cells, hover, click } = useContext(myBoardContext)
  const value = cells[index]
  const onHover = useCallback(() => hover(index), [hover, index])
  const onClick = useCallback(() => click(index), [click, index])
  return <div className={`cell cell-${value}`} onMouseEnter={onHover} onClick={onClick} />
}

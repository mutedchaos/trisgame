import { MyBoardProvider } from './MyBoardContext'
import BoardView from './BoardView'
import { useMemo } from 'react'
import Shape from './Shape'

export default function Game() {
  const s = useMemo(
    () =>
      new Shape(`
    xxx
    x
  `),
    []
  )
  return (
    <MyBoardProvider width={11} height={11} shape={s}>
      <BoardView />
    </MyBoardProvider>
  )
}

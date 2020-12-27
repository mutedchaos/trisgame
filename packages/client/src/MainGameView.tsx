import { MyBoardProvider } from './MyBoardContext'
import BoardView from './BoardView'
import ShapeOptions from './ShapeOptions'

export default function MainGameView() {
  return (
    <MyBoardProvider>
      <BoardView />
      <ShapeOptions />
    </MyBoardProvider>
  )
}

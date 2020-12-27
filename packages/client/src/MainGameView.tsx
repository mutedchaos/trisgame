import { MyBoardProvider } from './MyBoardContext'
import BoardView from './BoardView'
import ShapeOptions from './ShapeOptions'
import './mainGameView.css'

export default function MainGameView() {
  return (
    <MyBoardProvider>
      <div className={'main-game-view'}>
        <BoardView />
        <ShapeOptions />
      </div>
    </MyBoardProvider>
  )
}

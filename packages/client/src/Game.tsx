import { MyBoardProvider } from './MyBoardContext'
import BoardView from './BoardView'
import { GameStateProvider } from './GameStateContext'
import { PlayerIdProvider } from './PlayerIdContext'
import { SelectedShapeProvider } from './selectedShapeContext'
import ShapeOptions from './ShapeOptions'

export default function Game() {
  return (
    <PlayerIdProvider playerId={'a'}>
      <SelectedShapeProvider>
        <GameStateProvider>
          <MyBoardProvider>
            <BoardView />
            <ShapeOptions />
          </MyBoardProvider>
        </GameStateProvider>
      </SelectedShapeProvider>
    </PlayerIdProvider>
  )
}

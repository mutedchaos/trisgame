import { MyBoardProvider } from './MyBoardContext'
import BoardView from './BoardView'
import { GameStateProvider } from './GameStateContext'
import { PlayerIdProvider } from './PlayerIdContext'
import { SelectedShapeProvider } from './selectedShapeContext'
import ShapeOptions from './ShapeOptions'
import { SocketProvider } from './socketContext'
import WelcomeView from './WelcomeView'

import qs from 'qs'
export default function Game() {
  const playerId = qs.parse(document.location.search.slice(1)).id as string | undefined
  return (
    <PlayerIdProvider playerId={playerId && playerId !== 'undefined' ? playerId : ''}>
      <SocketProvider fallback={<WelcomeView />}>
        <SelectedShapeProvider>
          <GameStateProvider>
            <MyBoardProvider>
              <BoardView />
              <ShapeOptions />
            </MyBoardProvider>
          </GameStateProvider>
        </SelectedShapeProvider>
      </SocketProvider>
    </PlayerIdProvider>
  )
}

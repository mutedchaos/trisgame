import { GameStateProvider } from './GameStateContext'
import { PlayerIdProvider } from './PlayerIdContext'
import { SelectedShapeProvider } from './selectedShapeContext'
import { SocketProvider } from './socketContext'
import WelcomeView from './WelcomeView'

import qs from 'qs'
import GameView from './GameView'

export default function Game() {
  const playerId = qs.parse(document.location.search.slice(1)).id as string | undefined
  return (
    <PlayerIdProvider playerId={playerId && playerId !== 'undefined' ? playerId : ''}>
      <SocketProvider fallback={<WelcomeView />}>
        <SelectedShapeProvider>
          <GameStateProvider>
            <GameView />
          </GameStateProvider>
        </SelectedShapeProvider>
      </SocketProvider>
    </PlayerIdProvider>
  )
}

import { useContext } from 'react'
import { gameStateContext } from './GameStateContext'
import { GamePhase } from '@tris/common'
import MainGameView from './MainGameView'
import GameOverView from './GameOverView'
import WaitingForPlayers from './WaitingForPlayers'

export default function GameView() {
  const { phase } = useContext(gameStateContext)

  switch (phase) {
    case GamePhase.WaitingForPlayers:
      return <WaitingForPlayers />
    case GamePhase.PlacingStartingTiles:
    case GamePhase.RegularGame:
      return <MainGameView />
    case GamePhase.GameOver:
      return <GameOverView />
  }
}

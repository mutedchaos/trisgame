import noop from 'lodash/noop'
import { useContext } from 'react'
import { gameStateContext } from './GameStateContext'
import BoardView from './BoardView'
import { myBoardContext } from './MyBoardContext'

import './otherPlayers.css'
import { CellScale } from './CellScale'
import { playerIdContext } from './PlayerIdContext'

export default function OtherPlayersView() {
  const gameState = useContext(gameStateContext)
  const self = useContext(playerIdContext)
  if (!gameState) return null
  const players = gameState.players

  return (
    <CellScale scale={0.5}>
      <div className={'other-players'}>
        {players
          .filter(p => p.id !== self)
          .map(player => (
            <div key={player.id}>
              <h4>{player.name}</h4>
              <myBoardContext.Provider
                value={{
                  ...player,
                  hover: noop,
                  click: noop,
                }}
              >
                <BoardView />
              </myBoardContext.Provider>
            </div>
          ))}
      </div>
    </CellScale>
  )
}

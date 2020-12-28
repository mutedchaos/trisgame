import { MyBoardProvider } from './MyBoardContext'
import BoardView from './BoardView'
import ShapeOptions from './ShapeOptions'
import './mainGameView.css'
import React, { useCallback, useContext } from 'react'
import { SocketMessage } from '@tris/common'
import { socketContext } from './socketContext'
import { myPlayerContext } from './MyPlayerContext'
import OtherPlayersView from './OtherPlayersView'

export default function MainGameView() {
  const { sendMessage } = useContext(socketContext)

  const giveUp = useCallback(() => {
    sendMessage(SocketMessage.GIVE_UP)
  }, [sendMessage])

  const { gameOver, awaitingTile } = useContext(myPlayerContext)

  return (
    <div>
      <MyBoardProvider>
        <div className={`main-game-view ${gameOver && 'disabled'}`}>
          <BoardView />
          <ShapeOptions />
          {!gameOver && (
            <button disabled={!awaitingTile} onClick={giveUp}>
              Give up
            </button>
          )}
        </div>
      </MyBoardProvider>
      <OtherPlayersView />
    </div>
  )
}

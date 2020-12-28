import { MyBoardProvider } from './MyBoardContext'
import BoardView from './BoardView'
import ShapeOptions from './ShapeOptions'
import './mainGameView.css'
import React, { useCallback, useContext } from 'react'
import { SocketMessage } from '@tris/common'
import { socketContext } from './socketContext'

export default function MainGameView() {
  const { sendMessage } = useContext(socketContext)

  const giveUp = useCallback(() => {
    sendMessage(SocketMessage.GIVE_UP)
  }, [sendMessage])

  return (
    <MyBoardProvider>
      <div className={'main-game-view'}>
        <BoardView />
        <ShapeOptions />
        <button onClick={giveUp}>Give up</button>
      </div>
    </MyBoardProvider>
  )
}

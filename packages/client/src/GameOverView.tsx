import Scores from './Scores'
import { useCallback, useContext } from 'react'
import { socketContext } from './socketContext'
import { SocketMessage } from '@tris/common'

export default function GameOverView() {
  const { sendMessage } = useContext(socketContext)
  const playAgain = useCallback(() => {
    sendMessage(SocketMessage.RESTART)
  }, [sendMessage])

  const leave = useCallback(() => {
    document.location.href = '/'
  }, [])

  return (
    <div>
      <h1>Game Over</h1>
      <h2>Scores</h2>
      <h3>This round</h3>
      <Scores field={'previousRoundScore'} />
      <h3>Overall</h3>
      <Scores field={'overallScore'} />
      <h3>Rounds</h3>
      <Scores field={'roundsWon'} />
      <div>
        <button onClick={playAgain}>Play again</button>
        <button onClick={leave}>Leave</button>
      </div>
    </div>
  )
}

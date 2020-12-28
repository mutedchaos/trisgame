import { useContext } from 'react'
import { gameStateContext } from './GameStateContext'

interface Props {
  field: 'previousRoundScore' | 'roundsWon' | 'overallScore'
}

export default function Scores({ field }: Props) {
  const state = useContext(gameStateContext)
  const sortedPlayers = state.players.sort((a, b) => a[field] - b[field])
  return (
    <table>
      <thead>
        <tr>
          <th>Player</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {sortedPlayers.map(player => (
          <tr key={player.id}>
            <td>{player.name}</td>
            <td>{player[field]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

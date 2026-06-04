import { calcTeamPoints } from '../data'
import s from '../styles'

export default function Leaderboard({ players, assignments, teamPoints }) {
  const board = Object.entries(assignments)
    .map(([name, teams]) => ({
      name,
      teams,
      score: teams.reduce((sum, t) => sum + calcTeamPoints(teamPoints[t.name]), 0),
    }))
    .sort((a, b) => b.score - a.score)

  if (board.length === 0) {
    return (
      <div style={s.empty}>
        <p style={s.emptyText}>No players yet. The draw hasn't been run.</p>
      </div>
    )
  }

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div style={s.panel}>
      {board.map((entry, i) => (
        <div key={entry.name} style={{ ...s.leaderRow, ...(i === 0 ? s.leaderFirst : {}) }}>
          <span style={s.leaderRank}>{medals[i] || `#${i + 1}`}</span>
          <div style={s.leaderInfo}>
            <span style={s.leaderName}>{entry.name}</span>
            <span style={s.leaderFlags}>{entry.teams.map(t => t.flag).join('  ')}</span>
          </div>
          <span style={s.leaderScore}>{entry.score}<span style={s.ptsLabel}> pts</span></span>
        </div>
      ))}
    </div>
  )
}

import { calcTeamPoints, calcTeamGoals } from '../data'
import s from '../styles'

export default function Leaderboard({ assignments, teamPoints }) {
  const board = Object.entries(assignments)
    .map(([name, teams]) => {
      const score = teams.reduce((sum, t) => sum + calcTeamPoints(teamPoints[t.name]), 0)
      const scored = teams.reduce((sum, t) => sum + calcTeamGoals(teamPoints[t.name]).scored, 0)
      const conceded = teams.reduce((sum, t) => sum + calcTeamGoals(teamPoints[t.name]).conceded, 0)
      return { name, teams, score, scored, conceded }
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (b.scored !== a.scored) return b.scored - a.scored
      if (a.conceded !== b.conceded) return a.conceded - b.conceded
      return 0
    })

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
            <span style={s.leaderGoals}>⚽ {entry.scored} scored · {entry.conceded} conceded</span>
          </div>
          <span style={s.leaderScore}>{entry.score}<span style={s.ptsLabel}> pts</span></span>
        </div>
      ))}
    </div>
  )
}

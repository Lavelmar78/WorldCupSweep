import { calcTeamPoints } from '../data'
import s from '../styles'

export default function TeamsView({ assignments, teamPoints }) {
  const entries = Object.entries(assignments)
    .map(([name, teams]) => ({
      name,
      teams,
      score: teams.reduce((sum, t) => sum + calcTeamPoints(teamPoints[t.name]), 0),
    }))
    .sort((a, b) => b.score - a.score)

  if (entries.length === 0) {
    return <div style={s.empty}><p style={s.emptyText}>No draw yet.</p></div>
  }

  return (
    <div style={s.panel}>
      {entries.map(entry => (
        <div key={entry.name} style={s.teamCard}>
          <div style={s.teamCardHeader}>
            <span style={s.teamPlayerName}>{entry.name}</span>
            <span style={s.leaderScore}>{entry.score}<span style={s.ptsLabel}> pts</span></span>
          </div>
          {entry.teams.map(team => {
            const pts = calcTeamPoints(teamPoints[team.name])
            const tp = teamPoints[team.name] || {}
            const groupRes = (tp.group || []).join(' ')
            return (
              <div key={team.name} style={s.teamLine}>
                <span style={{ fontSize: 20 }}>{team.flag}</span>
                <span style={s.teamLineName}>{team.name}</span>
                <span style={s.groupRes}>{groupRes}</span>
                <span style={s.teamLinePts}>{pts} pts</span>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

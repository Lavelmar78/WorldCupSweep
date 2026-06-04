import { ALL_TEAMS, ROUND_LABELS } from '../data'
import { db } from '../firebase'
import { ref, set, get } from 'firebase/database'
import s from '../styles'

async function recordGroupResult(teamName, result, teamPoints) {
  const current = teamPoints[teamName]?.group || []
  if (current.length >= 3) return
  const next = [...current, result]
  await set(ref(db, `teamPoints/${teamName}/group`), next)
}

async function undoGroupResult(teamName, teamPoints) {
  const current = teamPoints[teamName]?.group || []
  if (current.length === 0) return
  await set(ref(db, `teamPoints/${teamName}/group`), current.slice(0, -1))
}

async function recordKnockoutResult(teamName, round, result) {
  await set(ref(db, `teamPoints/${teamName}/${round}`), result)
}

export default function ResultsEntry({ teamPoints }) {
  const knockout = ['r16', 'qf', 'sf', 'final']

  return (
    <div style={s.panel}>
      {/* GROUP STAGE */}
      <div style={s.sectionLabel}>GROUP STAGE</div>
      {ALL_TEAMS.map(team => {
        const tp = teamPoints[team.name] || { group: [] }
        const games = tp.group || []
        return (
          <div key={team.name} style={s.resultRow}>
            <span style={{ fontSize: 18, width: 24 }}>{team.flag}</span>
            <span style={s.resultTeam}>{team.name}</span>
            <div style={s.resultBadges}>
              {[0, 1, 2].map(gi => {
                const r = games[gi]
                return (
                  <span key={gi} style={{ ...s.badge, ...(r === 'W' ? s.badgeW : r === 'D' ? s.badgeD : r === 'L' ? s.badgeL : s.badgeEmpty) }}>
                    {r || '·'}
                  </span>
                )
              })}
            </div>
            <div style={s.resultBtns}>
              {games.length < 3 && (
                <>
                  <button style={{ ...s.miniBtn, ...s.btnW }} onClick={() => recordGroupResult(team.name, 'W', teamPoints)}>W</button>
                  <button style={{ ...s.miniBtn, ...s.btnD }} onClick={() => recordGroupResult(team.name, 'D', teamPoints)}>D</button>
                  <button style={{ ...s.miniBtn, ...s.btnL }} onClick={() => recordGroupResult(team.name, 'L', teamPoints)}>L</button>
                </>
              )}
              {games.length > 0 && (
                <button style={{ ...s.miniBtn, ...s.btnUndo }} onClick={() => undoGroupResult(team.name, teamPoints)}>↩</button>
              )}
            </div>
          </div>
        )
      })}

      {/* KNOCKOUT ROUNDS */}
      {knockout.map(round => (
        <div key={round}>
          <div style={s.sectionLabel}>{ROUND_LABELS[round].toUpperCase()}</div>
          {ALL_TEAMS.map(team => {
            const tp = teamPoints[team.name] || {}
            const res = tp[round]
            return (
              <div key={team.name} style={s.resultRow}>
                <span style={{ fontSize: 18, width: 24 }}>{team.flag}</span>
                <span style={s.resultTeam}>{team.name}</span>
                <div style={s.resultBadges}>
                  <span style={{ ...s.badge, ...(res === 'W' ? s.badgeW : res === 'E' ? s.badgeL : s.badgeEmpty) }}>
                    {res === 'W' ? 'W' : res === 'E' ? 'Out' : '·'}
                  </span>
                </div>
                <div style={s.resultBtns}>
                  {!res && (
                    <>
                      <button style={{ ...s.miniBtn, ...s.btnW }} onClick={() => recordKnockoutResult(team.name, round, 'W')}>W</button>
                      <button style={{ ...s.miniBtn, ...s.btnL }} onClick={() => recordKnockoutResult(team.name, round, 'E')}>Out</button>
                    </>
                  )}
                  {res && (
                    <button style={{ ...s.miniBtn, ...s.btnUndo }} onClick={() => recordKnockoutResult(team.name, round, null)}>↩</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

import React, { useState } from 'react'
import { ALL_TEAMS, ROUND_LABELS } from '../data'
import { db } from '../firebase'
import { ref, set } from 'firebase/database'
import s from '../styles'

async function recordGroupResult(teamName, result, scored, conceded, teamPoints) {
  const current = teamPoints[teamName]?.group || []
  if (current.length >= 3) return
  const next = [...current, { result, scored: Number(scored), conceded: Number(conceded) }]
  await set(ref(db, `teamPoints/${teamName}/group`), next)
}

async function undoGroupResult(teamName, teamPoints) {
  const current = teamPoints[teamName]?.group || []
  if (current.length === 0) return
  await set(ref(db, `teamPoints/${teamName}/group`), current.slice(0, -1))
}

async function recordKnockoutResult(teamName, round, result, scored, conceded) {
  await set(ref(db, `teamPoints/${teamName}/${round}`), { result, scored: Number(scored), conceded: Number(conceded) })
}

async function clearKnockoutResult(teamName, round) {
  await set(ref(db, `teamPoints/${teamName}/${round}`), null)
}

function GoalInput({ value, onChange, placeholder }) {
  return (
    <input
      type="number"
      min="0"
      max="20"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={s.goalInput}
    />
  )
}

function GroupRow({ team, tp, teamPoints }) {
  const games = tp?.group || []
  const [scored, setScored] = useState('')
  const [conceded, setConceded] = useState('')

  function submit(result) {
    if (scored === '' || conceded === '') return
    recordGroupResult(team.name, result, scored, conceded, teamPoints)
    setScored('')
    setConceded('')
  }

  return (
    <div style={s.resultRowWrap}>
      <div style={s.resultRow}>
        <span style={{ fontSize: 18, width: 24 }}>{team.flag}</span>
        <span style={s.resultTeam}>{team.name}</span>
        <div style={s.resultBadges}>
          {[0, 1, 2].map(gi => {
            const r = games[gi]
            const res = r?.result
            return (
              <span key={gi} style={{ ...s.badge, ...(res === 'W' ? s.badgeW : res === 'D' ? s.badgeD : res === 'L' ? s.badgeL : s.badgeEmpty) }}>
                {res ? `${res} ${r.scored}-${r.conceded}` : '·'}
              </span>
            )
          })}
        </div>
        {games.length > 0 && (
          <button style={{ ...s.miniBtn, ...s.btnUndo }} onClick={() => undoGroupResult(team.name, teamPoints)}>↩</button>
        )}
      </div>
      {games.length < 3 && (
        <div style={s.goalRow}>
          <GoalInput value={scored} onChange={setScored} placeholder="For" />
          <span style={s.goalSep}>–</span>
          <GoalInput value={conceded} onChange={setConceded} placeholder="Agn" />
          <div style={s.resultBtns}>
            <button style={{ ...s.miniBtn, ...s.btnW }} onClick={() => submit('W')}>W</button>
            <button style={{ ...s.miniBtn, ...s.btnD }} onClick={() => submit('D')}>D</button>
            <button style={{ ...s.miniBtn, ...s.btnL }} onClick={() => submit('L')}>L</button>
          </div>
        </div>
      )}
    </div>
  )
}

function KnockoutRow({ team, tp, round }) {
  const res = tp?.[round]
  const [scored, setScored] = useState('')
  const [conceded, setConceded] = useState('')

  function submit(result) {
    if (scored === '' || conceded === '') return
    recordKnockoutResult(team.name, round, result, scored, conceded)
    setScored('')
    setConceded('')
  }

  return (
    <div style={s.resultRowWrap}>
      <div style={s.resultRow}>
        <span style={{ fontSize: 18, width: 24 }}>{team.flag}</span>
        <span style={s.resultTeam}>{team.name}</span>
        <div style={s.resultBadges}>
          <span style={{ ...s.badge, ...(res?.result === 'W' ? s.badgeW : res?.result === 'E' ? s.badgeL : s.badgeEmpty) }}>
            {res?.result === 'W' ? `W ${res.scored}-${res.conceded}` : res?.result === 'E' ? `Out ${res.scored}-${res.conceded}` : '·'}
          </span>
        </div>
        {res && (
          <button style={{ ...s.miniBtn, ...s.btnUndo }} onClick={() => clearKnockoutResult(team.name, round)}>↩</button>
        )}
      </div>
      {!res && (
        <div style={s.goalRow}>
          <GoalInput value={scored} onChange={setScored} placeholder="For" />
          <span style={s.goalSep}>–</span>
          <GoalInput value={conceded} onChange={setConceded} placeholder="Agn" />
          <div style={s.resultBtns}>
            <button style={{ ...s.miniBtn, ...s.btnW }} onClick={() => submit('W')}>W</button>
            <button style={{ ...s.miniBtn, ...s.btnL }} onClick={() => submit('E')}>Out</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ResultsEntry({ teamPoints }) {
  const knockout = ['r32', 'r16', 'qf', 'sf', 'final']

  return (
    <div style={s.panel}>
      <div style={s.sectionLabel}>GROUP STAGE</div>
      {ALL_TEAMS.map(team => (
        <GroupRow key={team.name} team={team} tp={teamPoints[team.name]} teamPoints={teamPoints} />
      ))}
      {knockout.map(round => (
        <div key={round}>
          <div style={s.sectionLabel}>{ROUND_LABELS[round].toUpperCase()}</div>
          {ALL_TEAMS.map(team => (
            <KnockoutRow key={team.name} team={team} tp={teamPoints[team.name]} round={round} />
          ))}
        </div>
      ))}
    </div>
  )
}

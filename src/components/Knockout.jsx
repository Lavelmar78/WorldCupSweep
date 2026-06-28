import { useState } from 'react'
import { TEAM_MAP } from '../data'
import { db } from '../firebase'
import { ref, set } from 'firebase/database'
import s from '../styles'

// Official confirmed 2026 World Cup Round of 32 bracket
const R32_FIXTURES = [
  { id: 'R32_1',  home: 'South Africa', away: 'Canada' },
  { id: 'R32_2',  home: 'Brazil',       away: 'Japan' },
  { id: 'R32_3',  home: 'Germany',      away: 'Paraguay' },
  { id: 'R32_4',  home: 'Netherlands',  away: 'Morocco' },
  { id: 'R32_5',  home: 'Ivory Coast',  away: 'Norway' },
  { id: 'R32_6',  home: 'France',       away: 'Sweden' },
  { id: 'R32_7',  home: 'Mexico',       away: 'Ecuador' },
  { id: 'R32_8',  home: 'England',      away: 'DR Congo' },
  { id: 'R32_9',  home: 'Belgium',      away: 'Senegal' },
  { id: 'R32_10', home: 'USA',          away: 'Bosnia & Herzegovina' },
  { id: 'R32_11', home: 'Spain',        away: 'Austria' },
  { id: 'R32_12', home: 'Switzerland',  away: 'Algeria' },
  { id: 'R32_13', home: 'Portugal',     away: 'Croatia' },
  { id: 'R32_14', home: 'Australia',    away: 'Egypt' },
  { id: 'R32_15', home: 'Argentina',    away: 'Cape Verde' },
  { id: 'R32_16', home: 'Colombia',     away: 'Ghana' },
]

async function saveKnockoutResult(fixtureId, home, away, homeScore, awayScore, round) {
  const hs = Number(homeScore)
  const as = Number(awayScore)
  if (hs === as) return

  const winner = hs > as ? home : away
  const loser  = hs > as ? away : home

  await set(ref(db, `fixtureResults/${fixtureId}`), { homeScore: hs, awayScore: as })
  await set(ref(db, `teamPoints/${winner}/${round}`), { result: 'W', scored: hs > as ? hs : as, conceded: hs > as ? as : hs })
  await set(ref(db, `teamPoints/${loser}/${round}`),  { result: 'E', scored: hs > as ? as : hs, conceded: hs > as ? hs : as })
  await set(ref(db, `knockoutFixtures/${fixtureId}_winner`), winner)
}

async function clearKnockoutResult(fixtureId, home, away, round) {
  await set(ref(db, `fixtureResults/${fixtureId}`), null)
  await set(ref(db, `teamPoints/${home}/${round}`), null)
  await set(ref(db, `teamPoints/${away}/${round}`), null)
  await set(ref(db, `knockoutFixtures/${fixtureId}_winner`), null)
}

function KnockoutMatchRow({ fixtureId, home, away, round, result, isAdmin }) {
  const [hs, setHs] = useState('')
  const [as, setAs] = useState('')
  const [error, setError] = useState('')
  const homeTeam = TEAM_MAP[home]
  const awayTeam = TEAM_MAP[away]
  const hasResult = result && result.homeScore !== undefined

  function submit() {
    if (hs === '' || as === '') return
    if (Number(hs) === Number(as)) {
      setError('No draws in knockout — enter score after extra time')
      return
    }
    setError('')
    saveKnockoutResult(fixtureId, home, away, hs, as, round)
    setHs('')
    setAs('')
  }

  if (!home || !away) {
    return (
      <div style={{ ...s.fixtureRow, opacity: 0.4 }}>
        <div style={s.fixtureTeams}>
          <span style={s.fixtureTbd}>TBD</span>
          <span style={s.fixtureVs}>vs</span>
          <span style={s.fixtureTbd}>TBD</span>
        </div>
      </div>
    )
  }

  return (
    <div style={s.fixtureRow}>
      <div style={s.fixtureTeams}>
        <div style={s.fixtureTeam}>
          <span style={s.fixtureFlag}>{homeTeam?.flag}</span>
          <span style={s.fixtureTeamName}>{home}</span>
        </div>
        <div style={s.fixtureScore}>
          {hasResult ? (
            <span style={s.fixtureScoreText}>
              {result.homeScore} – {result.awayScore}
            </span>
          ) : (
            <span style={s.fixtureVs}>vs</span>
          )}
        </div>
        <div style={{ ...s.fixtureTeam, ...s.fixtureTeamRight }}>
          <span style={s.fixtureTeamName}>{away}</span>
          <span style={s.fixtureFlag}>{awayTeam?.flag}</span>
        </div>
      </div>
      {isAdmin && (
        <div style={s.fixtureInputRow}>
          {!hasResult ? (
            <>
              <input type="number" min="0" max="20" value={hs}
                onChange={e => { setHs(e.target.value); setError('') }}
                placeholder="0" style={s.scoreInput} />
              <span style={s.goalSep}>–</span>
              <input type="number" min="0" max="20" value={as}
                onChange={e => { setAs(e.target.value); setError('') }}
                placeholder="0" style={s.scoreInput} />
              <button style={{ ...s.miniBtn, ...s.btnW, padding: '5px 10px' }} onClick={submit}>
                Save
              </button>
            </>
          ) : (
            <button style={{ ...s.miniBtn, ...s.btnUndo }}
              onClick={() => clearKnockoutResult(fixtureId, home, away, round)}>
              ↩ Clear
            </button>
          )}
        </div>
      )}
      {error && <p style={{ color: '#ff6b6b', fontSize: 11, paddingLeft: 8, marginTop: 2 }}>{error}</p>}
    </div>
  )
}

export default function Knockout({ fixtureResults, knockoutFixtures, isAdmin }) {
  const r32Matches = R32_FIXTURES

  const r16Matches = []
  for (let i = 0; i < 8; i++) {
    const m1 = r32Matches[i * 2]
    const m2 = r32Matches[i * 2 + 1]
    if (!m1 || !m2) continue
    const home = knockoutFixtures?.[m1.id + '_winner'] || null
    const away = knockoutFixtures?.[m2.id + '_winner'] || null
    r16Matches.push({ id: `R16_${i + 1}`, home, away })
  }

  const qfMatches = []
  for (let i = 0; i < 4; i++) {
    const m1 = r16Matches[i * 2]
    const m2 = r16Matches[i * 2 + 1]
    if (!m1 || !m2) continue
    const home = knockoutFixtures?.[m1.id + '_winner'] || null
    const away = knockoutFixtures?.[m2.id + '_winner'] || null
    qfMatches.push({ id: `QF_${i + 1}`, home, away })
  }

  const sfMatches = []
  for (let i = 0; i < 2; i++) {
    const m1 = qfMatches[i * 2]
    const m2 = qfMatches[i * 2 + 1]
    if (!m1 || !m2) continue
    const home = knockoutFixtures?.[m1.id + '_winner'] || null
    const away = knockoutFixtures?.[m2.id + '_winner'] || null
    sfMatches.push({ id: `SF_${i + 1}`, home, away })
  }

  const finalMatch = {
    id: 'FINAL',
    home: knockoutFixtures?.['SF_1_winner'] || null,
    away: knockoutFixtures?.['SF_2_winner'] || null,
  }

  const rounds = [
    { label: 'ROUND OF 32', matches: r32Matches, round: 'r32' },
    { label: 'ROUND OF 16', matches: r16Matches, round: 'r16' },
    { label: 'QUARTER-FINALS', matches: qfMatches, round: 'qf' },
    { label: 'SEMI-FINALS', matches: sfMatches, round: 'sf' },
    { label: 'FINAL', matches: [finalMatch], round: 'final' },
  ]

  return (
    <div style={s.panel}>
      {rounds.map(({ label, matches, round }) => (
        <div key={round}>
          <div style={s.sectionLabel}>{label}</div>
          {matches.map(m => (
            <KnockoutMatchRow
              key={m.id}
              fixtureId={m.id}
              home={m.home}
              away={m.away}
              round={round}
              result={fixtureResults[m.id]}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

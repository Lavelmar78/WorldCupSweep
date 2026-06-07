import { useState } from 'react'
import { TEAM_MAP, getBestThirdPlace, ROUND_LABELS } from '../data'
import { db } from '../firebase'
import { ref, set } from 'firebase/database'
import s from '../styles'

// 2026 World Cup Round of 32 bracket structure
// Based on official FIFA bracket: group winners and runners-up
// plus 8 best third place teams
const R32_SLOTS = [
  { id: 'R32_1',  home: '1A', away: '2B' },
  { id: 'R32_2',  home: '1B', away: '2A' },
  { id: 'R32_3',  home: '1C', away: '2D' },
  { id: 'R32_4',  home: '1D', away: '2C' },
  { id: 'R32_5',  home: '1E', away: '2F' },
  { id: 'R32_6',  home: '1F', away: '2E' },
  { id: 'R32_7',  home: '1G', away: '2H' },
  { id: 'R32_8',  home: '1H', away: '2G' },
  { id: 'R32_9',  home: '1I', away: '2J' },
  { id: 'R32_10', home: '1J', away: '2I' },
  { id: 'R32_11', home: '1K', away: '2L' },
  { id: 'R32_12', home: '1L', away: '2K' },
  { id: 'R32_13', home: '1A', away: '3best' },
  { id: 'R32_14', home: '1C', away: '3best' },
  { id: 'R32_15', home: '1E', away: '3best' },
  { id: 'R32_16', home: '1G', away: '3best' },
  { id: 'R32_17', home: '1I', away: '3best' },
  { id: 'R32_18', home: '1K', away: '3best' },
  { id: 'R32_19', home: '1B', away: '3best' },
  { id: 'R32_20', home: '1D', away: '3best' },
  { id: 'R32_21', home: '1F', away: '3best' },
  { id: 'R32_22', home: '1H', away: '3best' },
  { id: 'R32_23', home: '1J', away: '3best' },
  { id: 'R32_24', home: '1L', away: '3best' },
  { id: 'R32_25', home: '2C', away: '3best' },
  { id: 'R32_26', home: '2E', away: '3best' },
  { id: 'R32_27', home: '2G', away: '3best' },
  { id: 'R32_28', home: '2I', away: '3best' },
  { id: 'R32_29', home: '2K', away: '3best' },
  { id: 'R32_30', home: '2B', away: '3best' },
  { id: 'R32_31', home: '2D', away: '3best' },
  { id: 'R32_32', home: '2F', away: '3best' },
]

function resolveSlot(slot, standings, bestThird, confirmed) {
  if (confirmed?.[slot]) return confirmed[slot]
  if (!slot) return null

  if (slot.startsWith('W_')) {
    const fixtureId = slot.replace('W_', '')
    return confirmed?.[fixtureId + '_winner'] || null
  }

  const match = slot.match(/^([123])([A-L])$/)
  if (match) {
    const pos = parseInt(match[1]) - 1
    const group = match[2]
    return standings[group]?.[pos]?.name || null
  }

  if (slot === '3best') return null // handled separately

  return null
}

async function saveKnockoutResult(fixtureId, home, away, homeScore, awayScore, round) {
  const hs = Number(homeScore)
  const as = Number(awayScore)
  if (hs === as) return // no draws in knockout

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

function ThirdPlaceConfirm({ bestThird, confirmed, isAdmin, knockoutFixtures }) {
  const allGroupsDone = bestThird.length >= 8

  async function confirm() {
    const slots = {}
    bestThird.slice(0, 8).forEach((t, i) => {
      slots[`3rd_${i}`] = t.name
    })
    await set(ref(db, 'knockoutFixtures/thirdPlaceConfirmed'), true)
    await set(ref(db, 'knockoutFixtures/thirdPlaceTeams'), bestThird.slice(0, 8).map(t => t.name))
  }

  const isConfirmed = knockoutFixtures?.thirdPlaceConfirmed

  return (
    <div style={s.thirdPlaceBox}>
      <div style={s.sectionLabel}>8 BEST THIRD PLACE TEAMS</div>
      {bestThird.slice(0, 8).map((t, i) => (
        <div key={t.name} style={s.thirdPlaceRow}>
          <span style={{ fontSize: 16 }}>#{i + 1}</span>
          <span style={{ fontSize: 18 }}>{TEAM_MAP[t.name]?.flag}</span>
          <span style={{ color: '#fff', fontSize: 13, flex: 1 }}>{t.name}</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
            Grp {t.group} · {t.pts}pts · {t.gd > 0 ? '+' : ''}{t.gd} GD
          </span>
        </div>
      ))}
      {isAdmin && allGroupsDone && !isConfirmed && (
        <button style={{ ...s.primaryBtn, marginTop: 12 }} onClick={confirm}>
          ✅ Confirm & Generate Round of 32
        </button>
      )}
      {isConfirmed && (
        <p style={{ color: '#6ddc6d', fontSize: 12, marginTop: 8 }}>
          ✅ Third place teams confirmed
        </p>
      )}
      {!allGroupsDone && (
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 8 }}>
          Waiting for all group stage results…
        </p>
      )}
    </div>
  )
}

export default function Knockout({
  standings, bestThird, fixtureResults,
  knockoutFixtures, teamPoints, isAdmin
}) {
  const thirdPlaceTeams = knockoutFixtures?.thirdPlaceTeams || []
  const thirdPlaceConfirmed = knockoutFixtures?.thirdPlaceConfirmed

  // Build R32 fixtures with resolved team names
  function resolveTeam(slot, thirdIndex) {
    if (!slot) return null
    const match = slot.match(/^([12])([A-L])$/)
    if (match) {
      const pos = parseInt(match[1]) - 1
      const group = match[2]
      return standings[group]?.[pos]?.name || null
    }
    if (slot === '3best') {
      return thirdPlaceTeams[thirdIndex] || null
    }
    if (slot.startsWith('W_')) {
      const id = slot.replace('W_', '')
      return knockoutFixtures?.[id + '_winner'] || null
    }
    return null
  }

  // Generate R32 matches - pair group qualifiers with third place teams
  let thirdIdx = 0
  const r32Matches = []
  for (let i = 1; i <= 32; i++) {
    const slot = R32_SLOTS[i - 1]
    if (!slot) continue
    let home = resolveTeam(slot.home, slot.home === '3best' ? thirdIdx++ : 0)
    let away = resolveTeam(slot.away, slot.away === '3best' ? thirdIdx++ : 0)
    r32Matches.push({ id: slot.id, home, away })
  }

  // Generate R16 from R32 winners
  const r16Matches = []
  for (let i = 0; i < 16; i++) {
    const m1 = r32Matches[i * 2]
    const m2 = r32Matches[i * 2 + 1]
    if (!m1 || !m2) continue
    const home = knockoutFixtures?.[m1.id + '_winner'] || null
    const away = knockoutFixtures?.[m2.id + '_winner'] || null
    r16Matches.push({ id: `R16_${i + 1}`, home, away })
  }

  // Generate QF from R16 winners
  const qfMatches = []
  for (let i = 0; i < 8; i++) {
    const m1 = r16Matches[i * 2]
    const m2 = r16Matches[i * 2 + 1]
    if (!m1 || !m2) continue
    const home = knockoutFixtures?.[m1.id + '_winner'] || null
    const away = knockoutFixtures?.[m2.id + '_winner'] || null
    qfMatches.push({ id: `QF_${i + 1}`, home, away })
  }

  // Generate SF from QF winners
  const sfMatches = []
  for (let i = 0; i < 4; i++) {
    const m1 = qfMatches[i * 2]
    const m2 = qfMatches[i * 2 + 1]
    if (!m1 || !m2) continue
    const home = knockoutFixtures?.[m1.id + '_winner'] || null
    const away = knockoutFixtures?.[m2.id + '_winner'] || null
    sfMatches.push({ id: `SF_${i + 1}`, home, away })
  }

  // Final
  const finalMatch = {
    id: 'FINAL',
    home: knockoutFixtures?.['SF_1_winner'] || knockoutFixtures?.['SF_2_winner'] ? knockoutFixtures?.['SF_1_winner'] : null,
    away: knockoutFixtures?.['SF_3_winner'] || knockoutFixtures?.['SF_4_winner'] ? knockoutFixtures?.['SF_3_winner'] : null,
  }

  const rounds = [
    { label: 'ROUND OF 32', matches: r32Matches,  round: 'r32',   show: thirdPlaceConfirmed },
    { label: 'ROUND OF 16', matches: r16Matches,  round: 'r16',   show: thirdPlaceConfirmed },
    { label: 'QUARTER-FINALS', matches: qfMatches, round: 'qf',   show: thirdPlaceConfirmed },
    { label: 'SEMI-FINALS',  matches: sfMatches,  round: 'sf',    show: thirdPlaceConfirmed },
    { label: 'FINAL',        matches: [finalMatch], round: 'final', show: thirdPlaceConfirmed },
  ]

  return (
    <div style={s.panel}>
      <ThirdPlaceConfirm
        bestThird={bestThird}
        confirmed={knockoutFixtures?.thirdPlaceConfirmed}
        isAdmin={isAdmin}
        knockoutFixtures={knockoutFixtures}
      />

      {rounds.map(({ label, matches, round, show }) => show ? (
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
      ) : null)}
    </div>
  )
}

import { useState } from 'react'
import { FIXTURES, TEAM_MAP, calcGroupStandings } from '../data'
import { db } from '../firebase'
import { ref, set } from 'firebase/database'
import s from '../styles'

function groupFixturesByDate(fixtures) {
  const byDate = {}
  fixtures.forEach(f => {
    if (!byDate[f.date]) byDate[f.date] = []
    byDate[f.date].push(f)
  })
  return byDate
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short' })
}

async function saveFixtureResult(fixtureId, homeScore, awayScore, teamPoints, fixture) {
  const hs = Number(homeScore)
  const as = Number(awayScore)

  // Save fixture result
  await set(ref(db, `fixtureResults/${fixtureId}`), { homeScore: hs, awayScore: as })

  // Work out W/D/L for each team and update teamPoints
  const homeResult = hs > as ? 'W' : hs < as ? 'L' : 'D'
  const awayResult = as > hs ? 'W' : as < hs ? 'L' : 'D'

  const homeTp = teamPoints[fixture.home] || { group: [] }
  const awayTp = teamPoints[fixture.away] || { group: [] }

  const homeGroup = [...(homeTp.group || [])].filter(r => r.fixtureId !== fixtureId)
  const awayGroup = [...(awayTp.group || [])].filter(r => r.fixtureId !== fixtureId)

  homeGroup.push({ result: homeResult, scored: hs, conceded: as, fixtureId })
  awayGroup.push({ result: awayResult, scored: as, conceded: hs, fixtureId })

  await set(ref(db, `teamPoints/${fixture.home}/group`), homeGroup)
  await set(ref(db, `teamPoints/${fixture.away}/group`), awayGroup)
}

async function clearFixtureResult(fixtureId, fixture, teamPoints) {
  await set(ref(db, `fixtureResults/${fixtureId}`), null)

  // Remove this fixture from both teams' group results
  const homeTp = teamPoints[fixture.home] || { group: [] }
  const awayTp = teamPoints[fixture.away] || { group: [] }

  await set(ref(db, `teamPoints/${fixture.home}/group`),
    (homeTp.group || []).filter(r => r.fixtureId !== fixtureId))
  await set(ref(db, `teamPoints/${fixture.away}/group`),
    (awayTp.group || []).filter(r => r.fixtureId !== fixtureId))
}

function FixtureRow({ fixture, result, isAdmin, teamPoints }) {
  const [hs, setHs] = useState('')
  const [as, setAs] = useState('')
  const homeTeam = TEAM_MAP[fixture.home]
  const awayTeam = TEAM_MAP[fixture.away]
  const hasResult = result && result.homeScore !== undefined

  function submit() {
    if (hs === '' || as === '') return
    saveFixtureResult(fixture.id, hs, as, teamPoints, fixture)
    setHs('')
    setAs('')
  }

  return (
    <div style={s.fixtureRow}>
      <div style={s.fixtureTeams}>
        <div style={s.fixtureTeam}>
          <span style={s.fixtureFlag}>{homeTeam?.flag}</span>
          <span style={s.fixtureTeamName}>{fixture.home}</span>
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
          <span style={s.fixtureTeamName}>{fixture.away}</span>
          <span style={s.fixtureFlag}>{awayTeam?.flag}</span>
        </div>
      </div>

      {isAdmin && (
        <div style={s.fixtureInputRow}>
          {!hasResult ? (
            <>
              <input
                type="number" min="0" max="20"
                value={hs} onChange={e => setHs(e.target.value)}
                placeholder="0" style={s.scoreInput}
              />
              <span style={s.goalSep}>–</span>
              <input
                type="number" min="0" max="20"
                value={as} onChange={e => setAs(e.target.value)}
                placeholder="0" style={s.scoreInput}
              />
              <button
                style={{ ...s.miniBtn, ...s.btnW, padding: '5px 10px' }}
                onClick={submit}
              >
                Save
              </button>
            </>
          ) : (
            <button
              style={{ ...s.miniBtn, ...s.btnUndo }}
              onClick={() => clearFixtureResult(fixture.id, fixture, teamPoints)}
            >
              ↩ Clear
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function Fixtures({ fixtureResults, teamPoints, isAdmin }) {
  const [selectedGroup, setSelectedGroup] = useState('All')
  const groups = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

  const filtered = selectedGroup === 'All'
    ? FIXTURES
    : FIXTURES.filter(f => f.group === selectedGroup)

  const byDate = groupFixturesByDate(filtered)
  const dates = Object.keys(byDate).sort()

  return (
    <div style={s.panel}>
      {/* Group filter */}
      <div style={s.groupFilter}>
        {groups.map(g => (
          <button
            key={g}
            style={{ ...s.groupFilterBtn, ...(selectedGroup === g ? s.groupFilterActive : {}) }}
            onClick={() => setSelectedGroup(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {dates.map(date => (
        <div key={date}>
          <div style={s.dateLabel}>{formatDate(date)}</div>
          {byDate[date].map(fixture => (
            <FixtureRow
              key={fixture.id}
              fixture={fixture}
              result={fixtureResults[fixture.id]}
              isAdmin={isAdmin}
              teamPoints={teamPoints}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

import { useState } from 'react'
import { TEAM_MAP } from '../data'
import { db } from '../firebase'
import { ref, set } from 'firebase/database'
import s from '../styles'

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

const R16_PAIRS = [
  { id: 'R16_1', a: 'R32_1',  b: 'R32_4'  },
  { id: 'R16_2', a: 'R32_3',  b: 'R32_6'  },
  { id: 'R16_3', a: 'R32_2',  b: 'R32_5'  },
  { id: 'R16_4', a: 'R32_7',  b: 'R32_8'  },
  { id: 'R16_5', a: 'R32_13', b: 'R32_11' },
  { id: 'R16_6', a: 'R32_10', b: 'R32_9'  },
  { id: 'R16_7', a: 'R32_15', b: 'R32_14' },
  { id: 'R16_8', a: 'R32_12', b: 'R32_16' },
]

const QF_PAIRS = [
  { id: 'QF_1', a: 'R16_1', b: 'R16_2' },
  { id: 'QF_2', a: 'R16_3', b: 'R16_4' },
  { id: 'QF_3', a: 'R16_5', b: 'R16_6' },
  { id: 'QF_4', a: 'R16_7', b: 'R16_8' },
]

const SF_PAIRS = [
  { id: 'SF_1', a: 'QF_1', b: 'QF_3' },
  { id: 'SF_2', a: 'QF_2', b: 'QF_4' },
]

async function saveKnockoutResult(fixtureId, home, away, homeScore, awayScore, round, penaltyWinner) {
  const hs = Number(homeScore)
  const as = Number(awayScore)

  if (hs === as && !penaltyWinner) return

  let winner, loser
  if (penaltyWinner) {
    winner = penaltyWinner
    loser = penaltyWinner === home ? away : home
  } else {
    winner = hs > as ? home : away
    loser = hs > as ? away : home
  }

  const winnerScore = winner === home ? hs : as
  const loserScore = winner === home ? as : hs

  await set(ref(db, `fixtureResults/${fixtureId}`), { homeScore: hs, awayScore: as, penalties: !!penaltyWinner })
  await set(ref(db, `teamPoints/${winner}/${round}`), { result: 'W', scored: winnerScore, conceded: loserScore })
  await set(ref(db, `teamPoints/${loser}/${round}`),  { result: 'E', scored: loserScore, conceded: winnerScore })
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
  const [wentToPens, setWentToPens] = useState(false)
  const [pensWinner, setPensWinner] = useState('')
  const [error, setError] = useState('')
  const homeTeam = TEAM_MAP[home]
  const awayTeam = TEAM_MAP[away]
  const hasResult = result && result.homeScore !== undefined

  function submit() {
    if (hs === '' || as === '') return
    const hsNum = Number(hs)
    const asNum = Number(as)
    if (hsNum === asNum && !wentToPens) {
      setError('Scores level — tick "Decided on penalties" and pick the winner')
      return
    }
    if (wentToPens && !pensWinner) {
      setError('Select which team won on penalties')
      return
    }
    setError('')
    saveKnockoutResult(fixtureId, home, away, hs, as, round, wentToPens ? pensWinner : null)
    setHs('')
    setAs('')
    setWentToPens(false)
    setPensWinner('')
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
              {result.homeScore} – {result.awayScore}{result.penalties ? ' (pens)' : ''}
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
        <>
          {!hasResult ? (
            <>
              <div style={s.fixtureInputRow}>
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
              </div>
              <div style={s.penaltyRow}>
                <label style={s.penaltyLabel}>
                  <input
                    type="checkbox"
                    checked={wentToPens}
                    onChange={e => { setWentToPens(e.target.checked); setError('') }}
                  />
                  {' '}Decided on penalties
                </label>
                {wentToPens && (
                  <div style={s.penaltyChoice}>
                    <button
                      style={{ ...s.miniBtn, ...(pensWinner === home ? s.btnW : s.btnUndo) }}
                      onClick={() => setPensWinner(home)}
                    >
                      {home} won
                    </button>
                    <button
                      style={{ ...s.miniBtn, ...(pensWinner === away ? s.btnW : s.btnUndo) }}
                      onClick={() => setPensWinner(away)}
                    >
                      {away} won
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={s.fixtureInputRow}>
              <button style={{ ...s.miniBtn, ...s.btnUndo }}
                onClick={() => clearKnockoutResult(fixtureId, home, away, round)}>
                ↩ Clear
              </button>
            </div>
          )}
        </>
      )}
      {error && <p style={{ color: '#ff6b6b', fontSize: 11, paddingLeft: 8, marginTop: 2 }}>{error}</p>}
    </div>
  )
}

export default function Knockout({ fixtureResults, knockoutFixtures, isAdmin }) {

  const r16Matches = R16_PAIRS.map((p, i) => ({
    id: `R16_${i + 1}`,
    home: knockoutFixtures?.[p.a + '_winner'] || null,
    away: knockoutFixtures?.[p.b + '_winner'] || null,
  }))

  const qfMatches = QF_PAIRS.map((p, i) => ({
    id: `QF_${i + 1}`,
    home: knockoutFixtures?.[p.a + '_winner'] || null,
    away: knockoutFixtures?.[p.b + '_winner'] || null,
  }))

  const sfMatches = SF_PAIRS.map((p, i) => ({
    id: `SF_${i + 1}`,
    home: knockoutFixtures?.[p.a + '_winner'] || null,
    away: knockoutFixtures?.[p.b + '_winner'] || null,
  }))

  const finalMatch = {
    id: 'FINAL',
    home: knockoutFixtures?.['SF_1_winner'] || null,
    away: knockoutFixtures?.['SF_2_winner'] || null,
  }

  const rounds = [
    { label: 'ROUND OF 32',    matches: R32_FIXTURES, round: 'r32'   },
    { label: 'ROUND OF 16',    matches: r16Matches,   round: 'r16'   },
    { label: 'QUARTER-FINALS', matches: qfMatches,    round: 'qf'    },
    { label: 'SEMI-FINALS',    matches: sfMatches,    round: 'sf'    },
    { label: 'FINAL',          matches: [finalMatch], round: 'final' },
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

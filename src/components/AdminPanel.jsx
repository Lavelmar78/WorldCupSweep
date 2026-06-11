import { useState } from 'react'
import { POTS, shuffle } from '../data'
import { db } from '../firebase'
import { ref, set, remove } from 'firebase/database'
import s from '../styles'

function buildDeck(pot, needed) {
  // Shuffle the pot and repeat until we have enough cards
  const deck = []
  while (deck.length < needed) {
    deck.push(...shuffle([...pot]))
  }
  return deck
}

function assignTeamsSmallGroup(valid, potArrays) {
  const [pot1, pot2, pot3, pot4] = potArrays
  const playerCount = valid.length

  for (let attempt = 0; attempt < 2000; attempt++) {
    // Deal cards from each pot — every team used once before repeats
    const deck1 = buildDeck(pot1, playerCount * 2) // 2 picks per player
    const deck2 = buildDeck(pot2, playerCount * 2)
    const deck3 = buildDeck(pot3, playerCount)
    const deck4 = buildDeck(pot4, playerCount)

    const result = {}
    const usedCombos = new Set()
    let failed = false

    // Pre-assign pot1 pairs from deck (consecutive pairs)
    const pot1Assignments = []
    for (let i = 0; i < playerCount; i++) {
      pot1Assignments.push([deck1[i * 2], deck1[i * 2 + 1]])
    }

    // Pre-assign pot2 pairs from deck
    const pot2Assignments = []
    for (let i = 0; i < playerCount; i++) {
      pot2Assignments.push([deck2[i * 2], deck2[i * 2 + 1]])
    }

    // Pre-assign pot3 and pot4 from deck
    const pot3Assignments = deck3.slice(0, playerCount)
    const pot4Assignments = deck4.slice(0, playerCount)

    for (let i = 0; i < playerCount; i++) {
      const [t1a, t1b] = pot1Assignments[i]
      const [t2a, t2b] = pot2Assignments[i]
      const t3 = pot3Assignments[i]
      const t4 = pot4Assignments[i]

      const candidate = [t1a, t1b, t2a, t2b, t3, t4]
      const names = candidate.map(t => t.name)

      // Check no duplicate teams
      if (new Set(names).size !== 6) { failed = true; break }

      // Check t1a and t1b not same group
      if (t1a.group === t1b.group) { failed = true; break }

      // Check t2a and t2b not same group
      if (t2a.group === t2b.group) { failed = true; break }

      // Check all 6 teams from different groups
      const groups = new Set([t1a.group, t1b.group, t2a.group, t2b.group, t3.group, t4.group])
      if (groups.size !== 6) { failed = true; break }

      // Check unique combination
      const comboKey = [...names].sort().join('|')
      if (usedCombos.has(comboKey)) { failed = true; break }

      usedCombos.add(comboKey)
      result[valid[i]] = candidate
    }

    if (!failed) return { success: true, result }
  }

  return { success: false, result: {} }
}

function assignTeamsLargeGroup(valid, potArrays) {
  const playerCount = valid.length

  for (let attempt = 0; attempt < 1000; attempt++) {
    const result = {}
    const usedCombos = new Set()
    let failed = false

    for (let i = 0; i < playerCount; i++) {
      let playerTeams = null

      for (let inner = 0; inner < 200; inner++) {
        const candidate = potArrays.map(pot => pot[Math.floor(Math.random() * pot.length)])
        const groups = candidate.map(t => t.group)
        if (new Set(groups).size !== 4) continue
        const comboKey = candidate.map(t => t.name).sort().join('|')
        if (usedCombos.has(comboKey)) continue
        playerTeams = candidate
        usedCombos.add(comboKey)
        break
      }

      if (!playerTeams) { failed = true; break }
      result[valid[i]] = playerTeams
    }

    if (!failed) return { success: true, result }
  }

  return { success: false, result: {} }
}

export default function AdminPanel({ assignments, onLogout }) {
  const [players, setPlayers] = useState([''])
  const [drawing, setDrawing] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [drawError, setDrawError] = useState('')

  function addPlayer() { setPlayers([...players, '']) }
  function removePlayer(i) { setPlayers(players.filter((_, idx) => idx !== i)) }
  function updatePlayer(i, val) {
    const p = [...players]; p[i] = val; setPlayers(p)
  }

  async function runDraw() {
    const valid = players.filter(p => p.trim())
    if (valid.length < 2) return
    setDrawing(true)
    setDrawError('')

    const potArrays = Object.values(POTS)
    const playerCount = valid.length
    const smallGroup = playerCount < 12

    const { success, result } = smallGroup
      ? assignTeamsSmallGroup(valid, potArrays)
      : assignTeamsLargeGroup(valid, potArrays)

    if (!success) {
      setDrawError('Could not find a valid draw. Try with fewer players.')
      setDrawing(false)
      return
    }

    await set(ref(db, 'assignments'), result)
    const initPoints = {}
    Object.values(POTS).flat().forEach(t => {
      initPoints[t.name] = { group: [] }
    })
    await set(ref(db, 'teamPoints'), initPoints)
    await remove(ref(db, 'fixtureResults'))
    await remove(ref(db, 'knockoutFixtures'))
    setDrawing(false)
  }

  async function resetAll() {
    await remove(ref(db, 'assignments'))
    await remove(ref(db, 'teamPoints'))
    await remove(ref(db, 'fixtureResults'))
    await remove(ref(db, 'knockoutFixtures'))
    setConfirmReset(false)
  }

  const hasAssignments = Object.keys(assignments).length > 0
  const playerCount = players.filter(p => p.trim()).length
  const smallGroup = playerCount < 12

  return (
    <div style={s.panel}>
      <div style={s.adminHeader}>
        <span style={s.adminBadge}>🔑 Admin</span>
        <button style={s.logoutBtn} onClick={onLogout}>Log out</button>
      </div>
      {!hasAssignments ? (
        <>
          <div style={s.sectionLabel}>ADD PLAYERS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            {players.map((p, i) => (
              <div key={i} style={s.playerRow}>
                <span style={s.playerNum}>{i + 1}</span>
                <input
                  style={s.input}
                  placeholder={`Player ${i + 1}`}
                  value={p}
                  onChange={e => updatePlayer(i, e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addPlayer()}
                />
                {players.length > 2 && (
                  <button style={s.removeBtn} onClick={() => removePlayer(i)}>✕</button>
                )}
              </div>
            ))}
          </div>
          <button style={s.ghostBtn} onClick={addPlayer}>+ Add Player</button>
          {playerCount >= 2 && (
            <p style={{ color: 'rgba(255,215,0,0.6)', fontSize: 12, marginTop: 8, textAlign: 'center' }}>
              {smallGroup
                ? `${playerCount} players → 6 teams each (2 from Pot 1, 2 from Pot 2, 1 from Pot 3, 1 from Pot 4)`
                : `${playerCount} players → 4 teams each (1 per pot)`}
            </p>
          )}
          {drawError && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 8 }}>{drawError}</p>}
          <button
            style={{ ...s.primaryBtn, opacity: playerCount < 2 ? 0.4 : 1, marginTop: 16 }}
            onClick={runDraw}
            disabled={playerCount < 2 || drawing}
          >
            {drawing ? 'Drawing…' : '🎲 Run the Draw'}
          </button>
        </>
      ) : (
        <>
          <div style={s.sectionLabel}>CURRENT DRAW</div>
          {Object.entries(assignments).map(([player, teams]) => (
            <div key={player} style={s.drawSummaryRow}>
              <span style={s.drawPlayerName}>{player}</span>
              <span style={s.drawTeamFlags}>{teams.map(t => t.flag).join('  ')}</span>
            </div>
          ))}
          <div style={{ marginTop: 20 }}>
            {!confirmReset ? (
              <button style={{ ...s.ghostBtn, color: '#ff6b6b', borderColor: 'rgba(255,80,80,0.3)' }} onClick={() => setConfirmReset(true)}>
                🗑 Reset & Start New Draw
              </button>
            ) : (
              <div style={s.confirmBox}>
                <p style={s.confirmText}>This will delete all players, results and fixtures. Are you sure?</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ ...s.miniBtn, ...s.btnL, padding: '8px 16px' }} onClick={resetAll}>Yes, reset</button>
                  <button style={{ ...s.miniBtn, ...s.btnUndo, padding: '8px 16px' }} onClick={() => setConfirmReset(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

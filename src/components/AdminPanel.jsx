import { useState } from 'react'
import { POTS, shuffle } from '../data'
import { db } from '../firebase'
import { ref, set, remove } from 'firebase/database'
import s from '../styles'

function assignTeamsSmallGroup(valid, potArrays) {
  // 6 teams per player: 2 from pot1, 2 from pot2, 1 from pot3, 1 from pot4
  const [pot1, pot2, pot3, pot4] = potArrays

  // Build usage queues - shuffle and repeat until we have enough
  function buildQueue(pot, teamsNeeded) {
    const queue = []
    while (queue.length < teamsNeeded) {
      queue.push(...shuffle([...pot]))
    }
    return queue
  }

  const playerCount = valid.length
  let attempts = 0

  while (attempts < 1000) {
    // Build queues with enough teams for all players
    const q1a = buildQueue(pot1, playerCount) // first pot1 pick
    const q1b = buildQueue(pot1, playerCount) // second pot1 pick
    const q2a = buildQueue(pot2, playerCount) // first pot2 pick
    const q2b = buildQueue(pot2, playerCount) // second pot2 pick
    const q3  = buildQueue(pot3, playerCount)
    const q4  = buildQueue(pot4, playerCount)

    const result = {}
    const usedCombos = new Set()
    let failed = false

    for (let i = 0; i < playerCount; i++) {
      let playerTeams = null
      let innerAttempts = 0

      while (innerAttempts < 200) {
        // Pick from queues at position i, with some randomness
        const offset = Math.floor(Math.random() * pot1.length)
        const t1a = q1a[(i + offset) % q1a.length]
        const t1b = q1b[(i + offset + 1) % q1b.length]
        const t2a = q2a[(i + offset) % q2a.length]
        const t2b = q2b[(i + offset + 1) % q2b.length]
        const t3  = q3[(i + offset) % q3.length]
        const t4  = q4[(i + offset) % q4.length]

        const candidate = [t1a, t1b, t2a, t2b, t3, t4]

        // No duplicate teams within a player's hand
        const names = candidate.map(t => t.name)
        if (new Set(names).size !== 6) { innerAttempts++; continue }

        // No two teams from same group
        const groups = candidate.map(t => t.group)
        if (new Set(groups).size !== 6) { innerAttempts++; continue }

        // No duplicate combinations
        const comboKey = names.sort().join('|')
        if (usedCombos.has(comboKey)) { innerAttempts++; continue }

        playerTeams = [t1a, t1b, t2a, t2b, t3, t4]
        usedCombos.add(comboKey)
        break
      }

      if (!playerTeams) { failed = true; break }
      result[valid[i]] = playerTeams
    }

    if (!failed) return { success: true, result }
    attempts++
  }

  return { success: false, result: {} }
}

function assignTeamsLargeGroup(valid, potArrays) {
  // 4 teams per player: 1 from each pot
  const playerCount = valid.length
  let attempts = 0

  while (attempts < 1000) {
    const result = {}
    const usedCombos = new Set()
    let failed = false

    for (let i = 0; i < playerCount; i++) {
      let playerTeams = null
      let innerAttempts = 0

      while (innerAttempts < 200) {
        const candidate = potArrays.map(pot => pot[Math.floor(Math.random() * pot.length)])

        // No two teams from same group
        const groups = candidate.map(t => t.group)
        if (new Set(groups).size !== 4) { innerAttempts++; continue }

        // No duplicate combinations
        const comboKey = candidate.map(t => t.name).sort().join('|')
        if (usedCombos.has(comboKey)) { innerAttempts++; continue }

        playerTeams = candidate
        usedCombos.add(comboKey)
        break
      }

      if (!playerTeams) { failed = true; break }
      result[valid[i]] = playerTeams
    }

    if (!failed) return { success: true, result }
    attempts++
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

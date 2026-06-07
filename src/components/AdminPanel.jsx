import { useState } from 'react'
import { POTS, shuffle } from '../data'
import { db } from '../firebase'
import { ref, set, remove } from 'firebase/database'
import s from '../styles'

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
    let result = {}
    let attempts = 0
    let success = false

    while (attempts < 500 && !success) {
      result = {}
      const usedCombos = new Set()
      let failed = false

      for (let i = 0; i < valid.length; i++) {
        let playerTeams = null
        let innerAttempts = 0

        while (innerAttempts < 100) {
          // Pick one random team from each pot
          const candidate = potArrays.map(pot => pot[Math.floor(Math.random() * pot.length)])
          // Check no two teams from same group
          const groups = candidate.map(t => t.group)
          const uniqueGroups = new Set(groups)
          if (uniqueGroups.size !== candidate.length) {
            innerAttempts++
            continue
          }
          // Check combo not already used
          const comboKey = candidate.map(t => t.name).sort().join('|')
          if (usedCombos.has(comboKey)) {
            innerAttempts++
            continue
          }
          playerTeams = candidate
          usedCombos.add(comboKey)
          break
        }

        if (!playerTeams) {
          failed = true
          break
        }
        result[valid[i]] = playerTeams
      }

      if (!failed) {
        success = true
      }
      attempts++
    }

    if (!success) {
      setDrawError('Could not find a valid draw after many attempts. Try with fewer players.')
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
          {drawError && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 8 }}>{drawError}</p>}
          <button
            style={{ ...s.primaryBtn, opacity: players.filter(p => p.trim()).length < 2 ? 0.4 : 1, marginTop: 16 }}
            onClick={runDraw}
            disabled={players.filter(p => p.trim()).length < 2 || drawing}
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

import { useState } from 'react'
import { POTS, shuffle } from '../data'
import { db } from '../firebase'
import { ref, set, remove } from 'firebase/database'
import s from '../styles'

function assignTeamsSmallGroup(valid, potArrays) {
  const [pot1, pot2, pot3, pot4] = potArrays
  const playerCount = valid.length

  for (let attempt = 0; attempt < 2000; attempt++) {
    // Shuffle all pots fresh each attempt
    const sp1 = shuffle([...pot1])
    const sp2 = shuffle([...pot2])
    const sp3 = shuffle([...pot3])
    const sp4 = shuffle([...pot4])

    // Build pool of valid pot1 pairs (no same group between the two)
    const pot1Pairs = []
    for (let i = 0; i < sp1.length; i++) {
      for (let j = i + 1; j < sp1.length; j++) {
        if (sp1[i].group !== sp1[j].group) {
          pot1Pairs.push([sp1[i], sp1[j]])
        }
      }
    }

    // Build pool of valid pot2 pairs (no same group between the two)
    const pot2Pairs = []
    for (let i = 0; i < sp2.length; i++) {
      for (let j = i + 1; j < sp2.length; j++) {
        if (sp2[i].group !== sp2[j].group) {
          pot2Pairs.push([sp2[i], sp2[j]])
        }
      }
    }

    const shuffledP1Pairs = shuffle(pot1Pairs)
    const shuffledP2Pairs = shuffle(pot2Pairs)

    const result = {}
    const usedCombos = new Set()
    const usedPot1Teams = new Set()
    const usedPot2Teams = new Set()
    let failed = false

    for (let i = 0; i < playerCount; i++) {
      let playerTeams = null

      // Find a valid pot1 pair not using already used teams
      const p1pair = shuffledP1Pairs.find(([a, b]) =>
        !usedPot1Teams.has(a.name) && !usedPot1Teams.has(b.name)
      )
      if (!p1pair) { failed = true; break }

      // Find a valid pot2 pair not using already used teams
      const p2pair = shuffledP2Pairs.find(([a, b]) =>
        !usedPot2Teams.has(a.name) && !usedPot2Teams.has(b.name)
      )
      if (!p2pair) { failed = true; break }

      // Try pot3 and pot4 picks that don't clash with chosen groups
      const usedGroups = new Set([
        p1pair[0].group, p1pair[1].group,
        p2pair[0].group, p2pair[1].group,
      ])

      const t3 = sp3.find(t => !usedGroups.has(t.group))
      if (!t3) { failed = true; break }
      usedGroups.add(t3.group)

      const t4 = sp4.find(t => !usedGroups.has(t.group))
      if (!t4) { failed = true; break }

      const candidate = [p1pair[0], p1pair[1], p2pair[0], p2pair[1], t3, t4]
      const names = candidate.map(t => t.name)
      const comboKey = [...names].sort().join('|')

      if (usedCombos.has(comboKey)) { failed = true; break }

      playerTeams = candidate
      usedCombos.add(comboKey)
      usedPot1Teams.add(p1pair[0].name)
      usedPot1Teams.add(p1pair[1].name)
      usedPot2Teams.add(p2pair[0].name)
      usedPot2Teams.add(p2pair[1].name)

      // Remove used pairs from pools so next player gets different teams
      const p1idx = shuffledP1Pairs.indexOf(p1pair)
      shuffledP1Pairs.splice(p1idx, 1)
      const p2idx = shuffledP2Pairs.indexOf(p2pair)
      shuffledP2Pairs.splice(p2idx, 1)

      result[valid[i]] = playerTeams
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

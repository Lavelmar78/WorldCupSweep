import { useState, useEffect } from 'react'
import { db } from './firebase'
import { ref, onValue } from 'firebase/database'
import { calcGroupStandings, getBestThirdPlace } from './data'
import AdminLogin from './components/AdminLogin'
import AdminPanel from './components/AdminPanel'
import Leaderboard from './components/Leaderboard'
import TeamsView from './components/TeamsView'
import Fixtures from './components/Fixtures'
import Knockout from './components/Knockout'
import s from './styles'

const TAB_LABELS = {
  leaderboard: '🥇 Standings',
  teams:       '👥 Teams',
  fixtures:    '📅 Fixtures',
  knockout:    '⚔️ Knockout',
  paytable:    '💰 Prizes',
  admin:       '🔑 Admin',
}

function Paytable() {
  return (
    <div style={s.panel}>
      <div style={s.paytableCard}>
        <div style={s.paytableTitle}>🏆 Prize Structure</div>
        <div style={s.paytableSubtitle}>€200 total pot · 10 players · €20 entry</div>
        <div style={s.paytableRow}>
          <span style={s.paytableMedal}>🥇</span>
          <span style={s.paytablePlace}>1st Place</span>
          <span style={s.paytableAmount}>€100</span>
        </div>
        <div style={s.paytableRow}>
          <span style={s.paytableMedal}>🥈</span>
          <span style={s.paytablePlace}>2nd Place</span>
          <span style={s.paytableAmount}>€60</span>
        </div>
        <div style={s.paytableRow}>
          <span style={s.paytableMedal}>🥉</span>
          <span style={s.paytablePlace}>3rd Place</span>
          <span style={s.paytableAmount}>€40</span>
        </div>
      </div>

      <div style={s.paytableCard}>
        <div style={s.paytableTitle}>⚽ Points System</div>
        {[
          ['Group stage win', '2 pts'],
          ['Group stage draw', '1 pt'],
          ['Round of 32 win', '2 pts'],
          ['Round of 16 win', '3 pts'],
          ['Quarter-final win', '4 pts'],
          ['Semi-final win', '5 pts'],
          ['Final win', '6 pts'],
        ].map(([label, pts]) => (
          <div key={label} style={s.paytablePointRow}>
            <span style={s.paytablePointLabel}>{label}</span>
            <span style={s.paytablePointValue}>{pts}</span>
          </div>
        ))}
      </div>

      <div style={s.paytableCard}>
        <div style={s.paytableTitle}>🔢 Tiebreakers</div>
        {[
          '1. Most goals scored across all your teams',
          '2. Least goals conceded across all your teams',
          '3. Prize split equally between tied players',
        ].map(t => (
          <p key={t} style={s.paytableTiebreak}>{t}</p>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [assignments, setAssignments]           = useState({})
  const [teamPoints, setTeamPoints]             = useState({})
  const [fixtureResults, setFixtureResults]     = useState({})
  const [knockoutFixtures, setKnockoutFixtures] = useState({})
  const [isAdmin, setIsAdmin]                   = useState(false)
  const [showLogin, setShowLogin]               = useState(false)
  const [activeTab, setActiveTab]               = useState('leaderboard')

  useEffect(() => {
    const u1 = onValue(ref(db, 'assignments'),      snap => setAssignments(snap.val() || {}))
    const u2 = onValue(ref(db, 'teamPoints'),       snap => setTeamPoints(snap.val() || {}))
    const u3 = onValue(ref(db, 'fixtureResults'),   snap => setFixtureResults(snap.val() || {}))
    const u4 = onValue(ref(db, 'knockoutFixtures'), snap => setKnockoutFixtures(snap.val() || {}))
    return () => { u1(); u2(); u3(); u4() }
  }, [])

  const standings = calcGroupStandings(fixtureResults)
  const bestThird = getBestThirdPlace(standings)

  function handleLogin() {
    setIsAdmin(true)
    setShowLogin(false)
    setActiveTab('admin')
  }

  function handleLogout() {
    setIsAdmin(false)
    setActiveTab('leaderboard')
  }

  const tabs = isAdmin
    ? ['leaderboard', 'teams', 'fixtures', 'knockout', 'paytable', 'admin']
    : ['leaderboard', 'teams', 'fixtures', 'knockout', 'paytable']

  return (
    <div style={s.root}>
      {showLogin && !isAdmin && (
        <AdminLogin onLogin={handleLogin} onClose={() => setShowLogin(false)} />
      )}

      <div style={s.appHeader}>
        <div>
          <div style={s.appTitle}>🏆 PAFC u10 Coach</div>
          <div style={s.appTitle2}>World Cup Sweep</div>
          <div style={s.appSub}>Live Tracker</div>
        </div>
        {!isAdmin && (
          <button style={s.adminToggleBtn} onClick={() => setShowLogin(true)}>
            Admin
          </button>
        )}
      </div>

      <div style={s.tabs}>
        {tabs.map(tab => (
          <button
            key={tab}
            style={{ ...s.tab, ...(activeTab === tab ? s.tabActive : {}) }}
            onClick={() => setActiveTab(tab)}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <div style={s.mainContent}>
        {activeTab === 'leaderboard' && (
          <Leaderboard assignments={assignments} teamPoints={teamPoints} />
        )}
        {activeTab === 'teams' && (
          <TeamsView assignments={assignments} teamPoints={teamPoints} />
        )}
        {activeTab === 'fixtures' && (
          <Fixtures
            fixtureResults={fixtureResults}
            teamPoints={teamPoints}
            isAdmin={isAdmin}
          />
        )}
        {activeTab === 'knockout' && (
          <Knockout
            standings={standings}
            bestThird={bestThird}
            fixtureResults={fixtureResults}
            knockoutFixtures={knockoutFixtures}
            teamPoints={teamPoints}
            isAdmin={isAdmin}
          />
        )}
        {activeTab === 'paytable' && <Paytable />}
        {activeTab === 'admin' && isAdmin && (
          <AdminPanel assignments={assignments} onLogout={handleLogout} />
        )}
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0b1a2e; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        input:focus { border-color: rgba(255,215,0,0.5) !important; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        button:hover { opacity: 0.85; }
      `}</style>
    </div>
  )
}

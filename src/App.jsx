import { useState, useEffect } from 'react'
import { db } from './firebase'
import { ref, onValue } from 'firebase/database'
import AdminLogin from './components/AdminLogin'
import AdminPanel from './components/AdminPanel'
import Leaderboard from './components/Leaderboard'
import TeamsView from './components/TeamsView'
import ResultsEntry from './components/ResultsEntry'
import s from './styles'

const TABS_PUBLIC  = ['leaderboard', 'teams']
const TABS_ADMIN   = ['leaderboard', 'teams', 'results', 'admin']
const TAB_LABELS   = {
  leaderboard: '🥇 Standings',
  teams:       '👥 Teams',
  results:     '⚽ Results',
  admin:       '🔑 Admin',
}

export default function App() {
  const [assignments, setAssignments]   = useState({})
  const [teamPoints, setTeamPoints]     = useState({})
  const [isAdmin, setIsAdmin]           = useState(false)
  const [showLogin, setShowLogin]       = useState(false)
  const [activeTab, setActiveTab]       = useState('leaderboard')

  // Firebase listeners
  useEffect(() => {
    const unsub1 = onValue(ref(db, 'assignments'), snap => {
      setAssignments(snap.val() || {})
    })
    const unsub2 = onValue(ref(db, 'teamPoints'), snap => {
      setTeamPoints(snap.val() || {})
    })
    return () => { unsub1(); unsub2() }
  }, [])

  function handleLogin() {
    setIsAdmin(true)
    setShowLogin(false)
    setActiveTab('admin')
  }

  function handleLogout() {
    setIsAdmin(false)
    setActiveTab('leaderboard')
  }

  const tabs = isAdmin ? TABS_ADMIN : TABS_PUBLIC

  return (
    <div style={s.root}>
      {showLogin && !isAdmin && (
        <AdminLogin onLogin={handleLogin} onClose={() => setShowLogin(false)} />
      )}

      {/* Header */}
      <div style={s.appHeader}>
        <div>
          <div style={s.appTitle}>🏆 World Cup Sweep</div>
          <div style={s.appSub}>Live Tracker</div>
        </div>
        {!isAdmin && (
          <button style={s.adminToggleBtn} onClick={() => setShowLogin(true)}>
            Admin
          </button>
        )}
      </div>

      {/* Tabs */}
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

      {/* Content */}
      <div style={s.mainContent}>
        {activeTab === 'leaderboard' && (
          <Leaderboard assignments={assignments} teamPoints={teamPoints} />
        )}
        {activeTab === 'teams' && (
          <TeamsView assignments={assignments} teamPoints={teamPoints} />
        )}
        {activeTab === 'results' && isAdmin && (
          <ResultsEntry teamPoints={teamPoints} />
        )}
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

import { useState } from 'react'
import s from '../styles'

const ADMIN_PASSWORD = 'WCSweep2026!' // Change this to your password

export default function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function attempt() {
    if (pw === ADMIN_PASSWORD) {
      onLogin()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setPw('')
    }
  }

  return (
    <div style={s.overlay}>
      <div style={{ ...s.loginCard, ...(shake ? s.shake : {}) }}>
        <div style={s.lockIcon}>🔒</div>
        <h2 style={s.loginTitle}>Admin Access</h2>
        <p style={s.loginSub}>Enter your password to manage the sweep</p>
        <input
          style={{ ...s.input, ...(error ? s.inputError : {}) }}
          type="password"
          placeholder="Password"
          value={pw}
          onChange={e => { setPw(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          autoFocus
        />
        {error && <p style={s.errorMsg}>Incorrect password</p>}
        <button style={s.primaryBtn} onClick={attempt}>Enter</button>
      </div>
    </div>
  )
}

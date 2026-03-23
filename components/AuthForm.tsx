'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

interface Props {
  onSuccess: () => void
}

export function AuthForm({ onSuccess }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const supabase = createClient()

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please enter email and password'); return }
    setLoading(true); setError(''); setMessage('')
    try {
      if (mode === 'register') {
        const { error: signUpError } = await supabase.auth.signUp({ email, password })
        if (signUpError) { setError(signUpError.message); return }
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) { setMessage('Account created! Please sign in.'); setMode('login'); return }
        onSuccess()
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) { setError(signInError.message); return }
        onSuccess()
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 360 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, background: '#fff', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#000' }}>₹</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 }}>Expenses</h1>
          <p style={{ color: '#666', fontSize: 14, marginTop: 4 }}>Track your spending with ease</p>
        </div>

        {/* Toggle */}
        <div style={{ background: '#1c1c1c', borderRadius: 20, padding: 4, display: 'flex', marginBottom: 20 }}>
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); setMessage('') }}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 16, border: 'none',
                fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                background: mode === m ? '#fff' : 'transparent',
                color: mode === m ? '#000' : '#666',
                transition: 'all 0.2s',
              }}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ background: '#1c1c1c', borderRadius: 20, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14, fontFamily: 'inherit' }}
            />
          </div>
          <div style={{ padding: '16px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14, fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {error && <p style={{ color: '#e55', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>{error}</p>}
        {message && <p style={{ color: '#5e5', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>{message}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '16px', borderRadius: 20, border: 'none',
            background: loading ? '#333' : '#fff', color: loading ? '#666' : '#000',
            fontSize: 14, fontWeight: 600, cursor: loading ? 'default' : 'pointer',
            fontFamily: 'inherit', transition: 'all 0.2s',
          }}
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </div>
    </div>
  )
}

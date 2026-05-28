import { SignIn, SignUp } from '@clerk/clerk-react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '@clerk/react'

export default function AuthPage() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const { isSignedIn } = useUser()

  if (isSignedIn) return <Navigate to="/" />

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚡</div>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: '-0.5px' }}>ResumeAI</span>
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 6, border: '1px solid rgba(255,255,255,0.06)' }}>
        {['signin', 'signup'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '8px 24px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: mode === m ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
              color: mode === m ? '#fff' : 'rgba(255,255,255,0.35)',
              fontSize: 13, fontWeight: 500, fontFamily: "'Inter', sans-serif",
              transition: 'all 0.2s'
            }}
          >
            {m === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        ))}
      </div>

      {/* Free credits badge - signup pe dikhao */}
      {mode === 'signup' && (
        <div style={{
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: 10, padding: '10px 20px', marginBottom: 20, fontSize: 13,
          color: '#a5b4fc', textAlign: 'center'
        }}>
          🎉 New users get <strong>4 free credits</strong> on signup!
        </div>
      )}

      {/* Clerk Component */}
      <div style={{ width: '100%', maxWidth: 400 }}>
        {mode === 'signin' ? (
          <SignIn
            routing="hash"
            afterSignInUrl="/"
            appearance={{
              variables: {
                colorPrimary: '#6366f1',
                colorBackground: '#111118',
                colorText: '#ffffff',
                colorInputBackground: '#1a1a2e',
                colorInputText: '#ffffff',
                borderRadius: '12px'
              }
            }}
          />
        ) : (
          <SignUp
            routing="hash"
            afterSignUpUrl="/"
            appearance={{
              variables: {
                colorPrimary: '#6366f1',
                colorBackground: '#111118',
                colorText: '#ffffff',
                colorInputBackground: '#1a1a2e',
                colorInputText: '#ffffff',
                borderRadius: '12px'
              }
            }}
          />
        )}
      </div>
    </div>
  )
}
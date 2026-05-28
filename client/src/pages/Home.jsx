import { useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useUser, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Home() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const navigate = useNavigate()
  const { isSignedIn } = useUser()
  const signInRef = useRef(null)

  const handleUpload = async () => {
    if (!isSignedIn) {
      signInRef.current?.click()
      return
    }
    if (!file) return setError('Please select a PDF file')
    const formData = new FormData()
    formData.append('resume', file)
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(`${API_URL}/api/resume/upload`, formData)
      navigate('/results', {
        state: { resumeId: res.data.resumeId, fileName: res.data.fileName }
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped?.type === 'application/pdf') {
      setFile(dropped)
      setError(null)
    } else {
      setError('Only PDF files allowed')
    }
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: '100vh', background: '#0a0a0f', color: '#fff' }}>

      {/* Hidden SignIn trigger */}
      <SignedOut>
        <SignInButton mode="modal">
          <button ref={signInRef} style={{ display: 'none' }}>signin</button>
        </SignInButton>
      </SignedOut>

      {/* Navbar */}
      <nav style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px' }}>ResumeAI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)' }}>
            Powered by Gemini ✨
          </div>
          <SignedOut>
            <SignInButton mode="modal">
              <button style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', border: 'none', padding: '8px 18px',
                borderRadius: 20, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Inter', sans-serif"
              }}>
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '80px 24px 40px', textAlign: 'center', position: 'relative' }}>

        {/* Glow */}
        <div style={{
          position: 'absolute', top: '0%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 300, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0
        }} />

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 20, padding: '6px 16px', fontSize: 12, color: '#a5b4fc', marginBottom: 32, position: 'relative', zIndex: 1 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }}></span>
          AI-Powered Resume Analyzer
        </div>

        {/* Heading */}
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 20, position: 'relative', zIndex: 1 }}>
          Get Your Resume
          <span style={{ display: 'block', background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ATS Ready
          </span>
        </h1>

        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 48, maxWidth: 480, margin: '0 auto 48px', position: 'relative', zIndex: 1 }}>
          Upload your resume and instantly get an ATS score, missing keywords, and AI-powered bullet point improvements.
        </p>

        {/* Features */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 48, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          {[
            { icon: '🎯', label: 'ATS Score' },
            { icon: '🔍', label: 'Keyword Gap' },
            { icon: '✨', label: 'AI Improve' },
          ].map(f => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </div>
          ))}
        </div>

        {/* Upload Card */}
        <div
          style={{ background: 'rgba(255,255,255,0.03)', border: `2px dashed ${dragOver ? '#6366f1' : 'rgba(255,255,255,0.1)'}`, borderRadius: 20, padding: '48px 32px', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', marginBottom: 16, zIndex: 1 }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <input
            id="fileInput"
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={(e) => { setFile(e.target.files[0]); setError(null) }}
          />
          {file ? (
            <div>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px' }}>📄</div>
              <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{file.name}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{(file.size / 1024).toFixed(0)} KB · Click to change</p>
            </div>
          ) : (
            <div>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px' }}>⬆️</div>
              <p style={{ fontWeight: 500, fontSize: 15, marginBottom: 6 }}>Drop your resume here</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>or click to browse · PDF only · Max 5MB</p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 16px', fontSize: 13, color: '#fca5a5', marginBottom: 16, position: 'relative', zIndex: 1 }}>
            {error}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            width: '100%', padding: '16px', borderRadius: 14, border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            background: loading ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: loading ? 'rgba(255,255,255,0.25)' : '#fff',
            fontSize: 15, fontWeight: 600, letterSpacing: '-0.3px', transition: 'all 0.2s',
            fontFamily: "'Inter', sans-serif", position: 'relative', zIndex: 1
          }}
        >
          {loading ? 'Analyzing...' : isSignedIn ? 'Analyze My Resume →' : 'Get Started — It\'s Free →'}
        </button>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 20, position: 'relative', zIndex: 1 }}>
          Your resume is processed securely and never shared.
        </p>

      </div>
    </div>
  )
}
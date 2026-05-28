const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

import { useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUser, UserButton } from '@clerk/clerk-react'



export default function Results() {
  const { user } = useUser()
  const [credits,setCredits] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { resumeId, fileName } = location.state || {}

  const [jobDesc, setJobDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [improving, setImproving] = useState(false)
  const [result, setResult] = useState(null)
  const [bullets, setBullets] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('ats')

  const handleAnalyze = async () => {
    if (!jobDesc.trim()) return setError('Please paste a job description')
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(
        `${API_URL}/api/resume/analyze/${resumeId}`,
        { jobDescription: jobDesc, clerkId: user.id }
      )
      setCredits(res.data.creditsLeft)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const handleImprove = async () => {
    setImproving(true)
    setError(null)
    try {
      const res = await axios.post(`${API_URL}/api/resume/improve/${resumeId}`,
        { clerkId: user.id }
      )
      setCredits(res.data.creditsLeft)
      setBullets(res.data.bullets)
    } catch (err) {
      setError(err.response?.data?.error || 'Improvement failed')
    } finally {
      setImproving(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 70) return '#4ade80'
    if (score >= 40) return '#fbbf24'
    return '#f87171'
  }

  const getScoreLabel = (score) => {
    if (score >= 70) return { text: 'ATS Friendly', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' }
    if (score >= 40) return { text: 'Needs Work', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' }
    return { text: 'Poor Match', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' }
  }

  if (!resumeId) {
    return (
      <div style={{ fontFamily: "'Inter', sans-serif", minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>No resume found.</p>
          <button onClick={() => navigate('/')} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: '100vh', background: '#0a0a0f', color: '#fff' }}>

      {/* Navbar */}

      
<nav style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
  
  {/* Left - Logo */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px' }}>ResumeAI</span>
  </div>

  {/* Right - Credits + New Resume + UserButton */}
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    
    {/* Credits Badge */}
    {credits !== null && (
      <div style={{
        fontSize: 12, fontWeight: 600,
        color: credits > 1 ? '#4ade80' : '#f87171',
        background: credits > 1 ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
        border: `1px solid ${credits > 1 ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
        padding: '5px 12px', borderRadius: 20
      }}>
        ⚡ {credits} credits left
      </div>
    )}

    {/* New Resume Button */}
    <button
      onClick={() => navigate('/')}
      style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}
    >
      ← New Resume
    </button>

    {/* User Avatar + Logout */}
    <UserButton afterSignOutUrl="/auth" />

  </div>
</nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>

        {/* File info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 16px' }}>
          <span style={{ fontSize: 20 }}>📄</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500 }}>{fileName}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Resume uploaded successfully</p>
          </div>
          <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }}></div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 6, border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { id: 'ats', icon: '🎯', label: 'ATS Score' },
            { id: 'improve', icon: '✨', label: 'AI Improve' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setError(null) }}
              style={{
                flex: 1, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.35)',
                fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── ATS TAB ── */}
        {activeTab === 'ats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* JD Input */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 10 }}>
                Paste Job Description
              </label>
              <textarea
                rows={6}
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the full job description here..."
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10, padding: '12px', fontSize: 13, color: '#fff', resize: 'none',
                  outline: 'none', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box',
                  lineHeight: 1.6
                }}
              />
              <button
                onClick={handleAnalyze}
                disabled={loading || !jobDesc.trim()}
                style={{
                  marginTop: 12, width: '100%', padding: '13px',
                  background: jobDesc.trim() && !loading ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                  color: jobDesc.trim() && !loading ? '#fff' : 'rgba(255,255,255,0.2)',
                  border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
                  cursor: jobDesc.trim() && !loading ? 'pointer' : 'not-allowed',
                  fontFamily: "'Inter', sans-serif", transition: 'all 0.2s'
                }}
              >
                {loading ? 'Analyzing...' : 'Get ATS Score 🎯'}
              </button>
              {error && <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 8 }}>{error}</p>}
            </div>

            {result && (
              <>
                {/* Score Card */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 28, textAlign: 'center' }}>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 2 }}>ATS Score</p>
                  <div style={{ fontSize: 80, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: getScoreColor(result.totalScore), lineHeight: 1, marginBottom: 12 }}>
                    {result.totalScore}
                  </div>
                  <div style={{ display: 'inline-block', background: getScoreLabel(result.totalScore).bg, border: `1px solid ${getScoreLabel(result.totalScore).border}`, borderRadius: 20, padding: '4px 14px', fontSize: 12, color: getScoreColor(result.totalScore) }}>
                    {getScoreLabel(result.totalScore).text}
                  </div>
                </div>

                {/* Breakdown */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: 'rgba(255,255,255,0.7)' }}>Score Breakdown</p>
                  {[
                    { label: 'Keyword Match', score: result.breakdown.keywords.score, max: 40, color: '#6366f1' },
                    { label: 'Resume Sections', score: result.breakdown.sections.score, max: 25, color: '#8b5cf6' },
                    { label: 'Action Verbs', score: result.breakdown.actionVerbs.score, max: 20, color: '#a78bfa' },
                    { label: 'Resume Length', score: result.breakdown.length.score, max: 15, color: '#c4b5fd' },
                  ].map((item) => (
                    <div key={item.label} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{item.score}<span style={{ color: 'rgba(255,255,255,0.25)' }}>/{item.max}</span></span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(item.score / item.max) * 100}%`, background: item.color, borderRadius: 4, transition: 'width 0.8s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Missing Keywords */}
                {result.missingKeywords.length > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: 'rgba(255,255,255,0.7)' }}>Missing Keywords</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginBottom: 14 }}>Add these to boost your score</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {result.missingKeywords.map((kw) => (
                        <span key={kw} style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#fca5a5', fontSize: 11, padding: '4px 12px', borderRadius: 20 }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Keywords */}
                {result.matchedKeywords.length > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: 'rgba(255,255,255,0.7)' }}>Matched Keywords ✅</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginBottom: 14 }}>Already present in your resume</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {result.matchedKeywords.map((kw) => (
                        <span key={kw} style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#86efac', fontSize: 11, padding: '4px 12px', borderRadius: 20 }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── AI IMPROVE TAB ── */}
        {activeTab === 'improve' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
              <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>AI Bullet Improver ✨</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 16, lineHeight: 1.6 }}>
                Gemini AI will rewrite your weak bullet points into strong, ATS-friendly ones with action verbs and metrics.
              </p>
              <button
                onClick={handleImprove}
                disabled={improving}
                style={{
                  width: '100%', padding: '13px',
                  background: !improving ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.05)',
                  color: !improving ? '#fff' : 'rgba(255,255,255,0.2)',
                  border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
                  cursor: !improving ? 'pointer' : 'not-allowed',
                  fontFamily: "'Inter', sans-serif", transition: 'all 0.2s'
                }}
              >
                {improving ? '✨ Gemini is thinking...' : 'Improve My Bullets with AI 🚀'}
              </button>
              {error && <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 8 }}>{error}</p>}
            </div>

            {bullets && bullets.map((item, index) => (
              <div key={index} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
                {/* Original */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#f87171', textTransform: 'uppercase', letterSpacing: 1 }}>Original</span>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6, lineHeight: 1.6 }}>{item.original}</p>
                </div>
                {/* Improved */}
                <div style={{ padding: '16px 20px', background: 'rgba(99,102,241,0.05)' }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#4ade80', textTransform: 'uppercase', letterSpacing: 1 }}>✨ AI Improved</span>
                  <p style={{ fontSize: 13, color: '#fff', marginTop: 6, lineHeight: 1.6, fontWeight: 500 }}>{item.improved}</p>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  )
}
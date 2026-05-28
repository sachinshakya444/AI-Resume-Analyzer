import { Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
import axios from 'axios'
import Home from './pages/Home'
import Results from './pages/Results'

function SyncUser() {
  const { user, isSignedIn } = useUser()
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    if (isSignedIn && user) {
      axios.post(`${API_URL}/api/user/sync`, {
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress
      })
    }
  }, [isSignedIn, user])

  return null
}

function App() {
  return (
    <>
      <SyncUser />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </>
  )
}

export default App
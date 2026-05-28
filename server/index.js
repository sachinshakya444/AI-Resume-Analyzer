import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import resumeRoutes from './routes/resume.js'   
import userRoutes from './routes/user.js'

console.log('Gemini Key loaded:', process.env.GEMINI_API_KEY ? 'YES ✅' : 'NO ❌')

const app = express()
const PORT = process.env.PORT || 5000

// app.use(cors({ origin: [
//   'http://localhost:5173',
//   'https://ai-resume-analyzer-rxfn.onrender.com'
// ],
// credentials: true
//  }))
app.use(cors())
app.use(express.json())

app.use('/api/resume', resumeRoutes)   // ← ye add karo

app.use('/api/user', userRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Resume Analyzer API is running 🚀' })
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✅')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => console.error('MongoDB error:', err))
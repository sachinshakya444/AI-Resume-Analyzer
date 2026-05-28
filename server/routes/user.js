import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// User sync — jab bhi login ho, user MongoDB mein save ho
router.post('/sync', async (req, res) => {
  try {
    const { clerkId, email } = req.body

    let user = await User.findOne({ clerkId })

    if (!user) {
      // Naya user — 4 credits do
      user = new User({ clerkId, email, credits: 4 })
      await user.save()
    }

    res.json({
      clerkId: user.clerkId,
      email: user.email,
      credits: user.credits
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Credits check karo
router.get('/credits/:clerkId', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ credits: user.credits })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
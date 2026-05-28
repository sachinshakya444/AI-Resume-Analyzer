import { extractText } from 'unpdf'
import Resume from '../models/Resume.js'
import { calculateATSScore } from '../services/atsScorer.js'
import { improveBulletPoints } from '../services/aiService.js'
import User from '../models/User.js'

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Buffer ko Uint8Array mein convert karo
    const uint8Array = new Uint8Array(req.file.buffer)

    // Text extract karo
    const { text } = await extractText(uint8Array, { mergePages: true })

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from PDF' })
    }

    const extractedText = text.trim()

    // MongoDB mein save karo
    const resume = new Resume({
      fileName: req.file.originalname,
      extractedText
    })

    await resume.save()

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resumeId: resume._id,
      fileName: resume.fileName,
      textPreview: extractedText.substring(0, 300) + '...'
    })
    

  } catch (error) {
    console.error('Upload error:', error.message)
    res.status(500).json({ error: error.message })
  }
}

export const analyzeResume = async (req, res) => {
  try {
    const { id } = req.params
    const { jobDescription, clerkId } = req.body  // ← clerkId bhi lo

    if (!jobDescription?.trim()) {
      return res.status(400).json({ error: 'Job description is required' })
    }

    // ── Credit check ──
    const user = await User.findOne({ clerkId })
    if (!user) return res.status(404).json({ error: 'User not found' })
    if (user.credits <= 0) {
      return res.status(403).json({ error: 'NO_CREDITS' })
    }

    const resume = await Resume.findById(id)
    if (!resume) return res.status(404).json({ error: 'Resume not found' })

    const result = calculateATSScore(resume.extractedText, jobDescription)

    // Credit katao
    user.credits -= 1
    await user.save()

    resume.atsScore = result.totalScore
    resume.missingKeywords = result.missingKeywords
    await resume.save()

    res.json({
      resumeId: id,
      fileName: resume.fileName,
      creditsLeft: user.credits,  // ← frontend ko batao
      ...result
    })

  } catch (error) {
    console.error('Analyze error:', error.message)
    res.status(500).json({ error: error.message })
  }
}

export const improveBullets = async (req, res) => {
  try {
    const { id } = req.params
    const { clerkId } = req.body  // ← clerkId lo

    // ── Credit check ──
    const user = await User.findOne({ clerkId })
    if (!user) return res.status(404).json({ error: 'User not found' })
    if (user.credits <= 0) {
      return res.status(403).json({ error: 'NO_CREDITS' })
    }

    const resume = await Resume.findById(id)
    if (!resume) return res.status(404).json({ error: 'Resume not found' })

    const bullets = await improveBulletPoints(resume.extractedText)

    // Credit katao
    user.credits -= 1
    await user.save()

    res.json({
      resumeId: id,
      fileName: resume.fileName,
      creditsLeft: user.credits,
      bullets
    })

  } catch (error) {
    console.error('Improve error:', error.message)
    res.status(500).json({ error: error.message })
  }
}
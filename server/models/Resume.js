import mongoose from 'mongoose'

const resumeSchema = new mongoose.Schema({
  fileName: String,
  extractedText: String,
  atsScore: { type: Number, default: null },
  missingKeywords: [String],
  uploadedAt: { type: Date, default: Date.now }
})

export default mongoose.model('Resume', resumeSchema)
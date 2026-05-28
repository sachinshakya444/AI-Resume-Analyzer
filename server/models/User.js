import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  credits: { type: Number, default: 4 }, // 4 free credits
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('User', userSchema)
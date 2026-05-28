import 'dotenv/config'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)


export const improveBulletPoints = async (resumeText) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const prompt = `You are an expert resume writer. Analyze the following resume text and extract ALL bullet points or achievement statements. Then rewrite each one to be stronger, more impactful, and ATS-friendly.

Rules:
- Start each bullet with a strong action verb
- Add numbers/metrics where possible (estimate if not given)
- Keep each bullet under 20 words
- Make it specific and results-oriented
- Return ONLY a valid JSON array, no extra text, no markdown

Format:
[
  {
    "original": "original bullet point here",
    "improved": "improved version here"
  }
]

Resume Text:
${resumeText}`

  const result = await model.generateContent(prompt)
  const rawText = result.response.text()
  const cleaned = rawText.replace(/```json|```/g, '').trim()
  const bullets = JSON.parse(cleaned)
  return bullets
}
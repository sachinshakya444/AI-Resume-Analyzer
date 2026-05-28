import express from 'express'
import multer from 'multer'
import {
  uploadResume,
  analyzeResume,
  improveBullets     // ← ye add karo
} from '../controllers/resumeController.js'

const router = express.Router()

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files allowed!'), false)
    }
  }
})

router.post('/upload', upload.single('resume'), uploadResume)
router.post('/analyze/:id', analyzeResume)
router.post('/improve/:id', improveBullets)    // ← ye add karo

export default router
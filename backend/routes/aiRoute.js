import express from 'express'
import { recommendDoctor } from '../controllers/aiController.js'

const aiRouter = express.Router()

// POST /api/ai/recommend-doctor
aiRouter.post('/recommend-doctor', recommendDoctor)

export default aiRouter

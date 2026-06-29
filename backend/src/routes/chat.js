import { Router } from 'express'
import { getChatResponse } from '../services/gemini.js'
import { validateChatInput } from '../middleware/validator.js'

const router = Router()

router.post('/', validateChatInput, async (req, res) => {
  try {
    const { category, messages, userMessage } = req.body

    const reply = await getChatResponse(category, messages, userMessage)

    res.json({
      success: true,
      data: {
        reply,
        category,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Groq API error:', error)

    // Groq rate limit error (HTTP 429)
    if (error.status === 429 || error?.error?.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Kuota API habis. Coba lagi dalam beberapa saat.',
        },
      })
    }

    // Groq authentication error
    if (error.status === 401) {
      return res.status(503).json({
        success: false,
        error: {
          code: 'API_AUTH_ERROR',
          message: 'Konfigurasi API tidak valid. Hubungi administrator.',
        },
      })
    }

    res.status(503).json({
      success: false,
      error: {
        code: 'AI_API_ERROR',
        message: 'Layanan AI sedang tidak tersedia. Coba lagi dalam beberapa saat.',
      },
    })
  }
})

export default router

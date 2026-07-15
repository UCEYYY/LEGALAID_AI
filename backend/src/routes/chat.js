import { Router } from 'express'
import { getChatResponse } from '../services/gemini.js'
import { validateChatInput } from '../middleware/validator.js'
import { optionalAuth } from '../middleware/auth.js'
import pool from '../config/db.js'

const router = Router()

router.post('/', optionalAuth, validateChatInput, async (req, res) => {
  try {
    const { category, messages, userMessage, sessionId } = req.body

    const reply = await getChatResponse(category, messages, userMessage)

    if (req.user) {
      let currentSessionId = sessionId

      if (!currentSessionId) {
        const [result] = await pool.execute(
          'INSERT INTO chat_sessions (user_id, category_slug, title) VALUES (?, ?, ?)',
          [req.user.id, category, `Konsultasi ${category} - ${new Date().toLocaleDateString('id-ID')}`]
        )
        currentSessionId = result.insertId
      }

      await pool.execute(
        'INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)',
        [currentSessionId, 'user', userMessage]
      )
      await pool.execute(
        'INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)',
        [currentSessionId, 'assistant', reply]
      )
      await pool.execute('UPDATE chat_sessions SET updated_at = NOW() WHERE id = ?', [currentSessionId])

      return res.json({
        success: true,
        data: {
          reply,
          category,
          sessionId: currentSessionId,
          timestamp: new Date().toISOString(),
        },
      })
    }

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

    if (error.status === 429 || error?.error?.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Kuota API habis. Coba lagi dalam beberapa saat.',
        },
      })
    }

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

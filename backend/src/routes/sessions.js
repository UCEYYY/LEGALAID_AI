import { Router } from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middleware/auth.js'
import { body, validationResult } from 'express-validator'

const router = Router()

router.use(authenticateToken)

const validateSession = [
  body('categorySlug').isString().notEmpty().withMessage('Kategori wajib diisi.'),
  body('title').optional().isString().isLength({ max: 255 }).withMessage('Judul maksimal 255 karakter.'),
]

function handleValidation(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: errors.array()[0].msg },
    })
  }
  return null
}

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10))
    const offset = (page - 1) * limit

    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM chat_sessions WHERE user_id = ?',
      [req.user.id]
    )
    const total = countResult[0].total

    const [sessions] = await pool.execute(
      'SELECT id, category_slug, title, created_at, updated_at FROM chat_sessions WHERE user_id = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?',
      [req.user.id, limit, offset]
    )

    res.json({
      success: true,
      data: {
        sessions,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    })
  } catch (error) {
    console.error('Get sessions error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.post('/', validateSession, async (req, res) => {
  const errResponse = handleValidation(req, res)
  if (errResponse) return

  try {
    const { categorySlug, title } = req.body

    const [result] = await pool.execute(
      'INSERT INTO chat_sessions (user_id, category_slug, title) VALUES (?, ?, ?)',
      [req.user.id, categorySlug, title || null]
    )

    const session = {
      id: result.insertId,
      user_id: req.user.id,
      category_slug: categorySlug,
      title: title || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    res.status(201).json({ success: true, data: { session } })
  } catch (error) {
    console.error('Create session error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const [sessions] = await pool.execute(
      'SELECT id, category_slug, title, created_at, updated_at FROM chat_sessions WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    )

    if (sessions.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Sesi tidak ditemukan.' },
      })
    }

    const [messages] = await pool.execute(
      'SELECT id, role, content, created_at FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC',
      [req.params.id]
    )

    res.json({ success: true, data: { session: sessions[0], messages } })
  } catch (error) {
    console.error('Get session error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const { title } = req.body
    if (!title || typeof title !== 'string') {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Judul wajib diisi.' },
      })
    }

    const [result] = await pool.execute(
      'UPDATE chat_sessions SET title = ? WHERE id = ? AND user_id = ?',
      [title, req.params.id, req.user.id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Sesi tidak ditemukan.' },
      })
    }

    res.json({ success: true, data: { message: 'Sesi berhasil diperbarui.' } })
  } catch (error) {
    console.error('Update session error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM chat_sessions WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Sesi tidak ditemukan.' },
      })
    }

    res.json({ success: true, data: { message: 'Sesi berhasil dihapus.' } })
  } catch (error) {
    console.error('Delete session error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.post('/:id/messages', async (req, res) => {
  try {
    const [sessions] = await pool.execute(
      'SELECT id FROM chat_sessions WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    )

    if (sessions.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Sesi tidak ditemukan.' },
      })
    }

    const { messages } = req.body
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Pesan wajib diisi.' },
      })
    }

    for (const msg of messages) {
      await pool.execute(
        'INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)',
        [req.params.id, msg.role, msg.content]
      )
    }

    await pool.execute('UPDATE chat_sessions SET updated_at = NOW() WHERE id = ?', [req.params.id])

    res.status(201).json({ success: true, data: { message: 'Pesan berhasil disimpan.' } })
  } catch (error) {
    console.error('Add messages error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

export default router

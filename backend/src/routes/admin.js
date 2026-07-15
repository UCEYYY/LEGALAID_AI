import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'
import env from '../config/env.js'
import { requireAdmin } from '../middleware/auth.js'
import { body, validationResult } from 'express-validator'

const router = Router()

router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Email tidak valid.'),
  body('password').notEmpty().withMessage('Password wajib diisi.'),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: errors.array()[0].msg },
    })
  }

  try {
    const { email, password } = req.body

    const [rows] = await pool.execute(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
      [email]
    )

    if (rows.length === 0 || rows[0].role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Email atau password salah.' },
      })
    }

    const admin = rows[0]
    const valid = await bcrypt.compare(password, admin.password_hash)
    if (!valid) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Email atau password salah.' },
      })
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn }
    )

    res.json({
      success: true,
      data: {
        token,
        user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
      },
    })
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [[userCount]] = await pool.execute("SELECT COUNT(*) as total FROM users WHERE role = 'user'")
    const [[sessionCount]] = await pool.execute('SELECT COUNT(*) as total FROM chat_sessions')
    const [[messageCount]] = await pool.execute('SELECT COUNT(*) as total FROM chat_messages')

    const [categoryStats] = await pool.execute(
      'SELECT category_slug, COUNT(*) as count FROM chat_sessions GROUP BY category_slug ORDER BY count DESC'
    )

    const [recentUsers] = await pool.execute(
      "SELECT id, name, email, created_at FROM users WHERE role = 'user' ORDER BY created_at DESC LIMIT 5"
    )

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers: userCount.total,
          totalSessions: sessionCount.total,
          totalMessages: messageCount.total,
        },
        categoryStats,
        recentUsers,
      },
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.get('/users', requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10))
    const offset = (page - 1) * limit
    const search = req.query.search || ''

    let whereClause = "WHERE role = 'user'"
    const params = []

    if (search) {
      whereClause += ' AND (name LIKE ? OR email LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    const [[countResult]] = await pool.execute(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    )

    const [users] = await pool.execute(
      `SELECT id, name, email, role, created_at, updated_at FROM users ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    )

    res.json({
      success: true,
      data: {
        users,
        pagination: { page, limit, total: countResult.total, totalPages: Math.ceil(countResult.total / limit) },
      },
    })
  } catch (error) {
    console.error('Admin users error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.get('/users/:id', requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.params.id]
    )

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Pengguna tidak ditemukan.' },
      })
    }

    const [sessions] = await pool.execute(
      'SELECT id, category_slug, title, created_at, updated_at FROM chat_sessions WHERE user_id = ? ORDER BY updated_at DESC',
      [req.params.id]
    )

    res.json({ success: true, data: { user: users[0], sessions } })
  } catch (error) {
    console.error('Admin user detail error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM users WHERE id = ? AND role = ?', [req.params.id, 'user'])

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Pengguna tidak ditemukan.' },
      })
    }

    res.json({ success: true, data: { message: 'Pengguna berhasil dihapus.' } })
  } catch (error) {
    console.error('Admin delete user error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.get('/sessions', requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10))
    const offset = (page - 1) * limit

    const [[countResult]] = await pool.execute('SELECT COUNT(*) as total FROM chat_sessions')

    const [sessions] = await pool.execute(
      `SELECT cs.id, cs.category_slug, cs.title, cs.created_at, cs.updated_at,
              u.name as user_name, u.email as user_email
       FROM chat_sessions cs
       JOIN users u ON cs.user_id = u.id
       ORDER BY cs.updated_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    )

    res.json({
      success: true,
      data: {
        sessions,
        pagination: { page, limit, total: countResult.total, totalPages: Math.ceil(countResult.total / limit) },
      },
    })
  } catch (error) {
    console.error('Admin sessions error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.get('/sessions/:id', requireAdmin, async (req, res) => {
  try {
    const [sessions] = await pool.execute(
      `SELECT cs.id, cs.category_slug, cs.title, cs.created_at, cs.updated_at,
              u.name as user_name, u.email as user_email
       FROM chat_sessions cs
       JOIN users u ON cs.user_id = u.id
       WHERE cs.id = ?`,
      [req.params.id]
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
    console.error('Admin session detail error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.get('/categories', requireAdmin, async (req, res) => {
  try {
    const [categories] = await pool.execute('SELECT * FROM categories ORDER BY sort_order ASC')
    res.json({ success: true, data: { categories } })
  } catch (error) {
    console.error('Admin categories error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.post('/categories', requireAdmin, [
  body('slug').isString().trim().notEmpty().withMessage('Slug wajib diisi.'),
  body('label').isString().trim().notEmpty().withMessage('Label wajib diisi.'),
  body('description').optional().isString(),
  body('icon').optional().isString(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: errors.array()[0].msg },
    })
  }

  try {
    const { slug, label, description, icon, sort_order } = req.body

    const [existing] = await pool.execute('SELECT id FROM categories WHERE slug = ?', [slug])
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: { code: 'SLUG_EXISTS', message: 'Slug kategori sudah ada.' },
      })
    }

    const [result] = await pool.execute(
      'INSERT INTO categories (slug, label, description, icon, sort_order) VALUES (?, ?, ?, ?, ?)',
      [slug, label, description || null, icon || null, sort_order || 0]
    )

    res.status(201).json({
      success: true,
      data: { id: result.insertId, slug, label, description, icon },
    })
  } catch (error) {
    console.error('Admin create category error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.patch('/categories/:id', requireAdmin, async (req, res) => {
  try {
    const { label, description, icon, sort_order, is_active } = req.body

    const [result] = await pool.execute(
      'UPDATE categories SET label = COALESCE(?, label), description = COALESCE(?, description), icon = COALESCE(?, icon), sort_order = COALESCE(?, sort_order), is_active = COALESCE(?, is_active) WHERE id = ?',
      [label, description, icon, sort_order, is_active, req.params.id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Kategori tidak ditemukan.' },
      })
    }

    res.json({ success: true, data: { message: 'Kategori berhasil diperbarui.' } })
  } catch (error) {
    console.error('Admin update category error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.delete('/categories/:id', requireAdmin, async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM categories WHERE id = ?', [req.params.id])

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Kategori tidak ditemukan.' },
      })
    }

    res.json({ success: true, data: { message: 'Kategori berhasil dihapus.' } })
  } catch (error) {
    console.error('Admin delete category error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.get('/faq', requireAdmin, async (req, res) => {
  try {
    const [faq] = await pool.execute('SELECT * FROM faq ORDER BY sort_order ASC')
    res.json({ success: true, data: { faq } })
  } catch (error) {
    console.error('Admin FAQ error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.post('/faq', requireAdmin, [
  body('question').isString().trim().notEmpty().withMessage('Pertanyaan wajib diisi.'),
  body('answer').isString().trim().notEmpty().withMessage('Jawaban wajib diisi.'),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: errors.array()[0].msg },
    })
  }

  try {
    const { question, answer, category_slug, sort_order } = req.body

    const [result] = await pool.execute(
      'INSERT INTO faq (question, answer, category_slug, sort_order) VALUES (?, ?, ?, ?)',
      [question, answer, category_slug || null, sort_order || 0]
    )

    res.status(201).json({
      success: true,
      data: { id: result.insertId, question, answer },
    })
  } catch (error) {
    console.error('Admin create FAQ error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.patch('/faq/:id', requireAdmin, async (req, res) => {
  try {
    const { question, answer, category_slug, sort_order, is_active } = req.body

    const [result] = await pool.execute(
      'UPDATE faq SET question = COALESCE(?, question), answer = COALESCE(?, answer), category_slug = COALESCE(?, category_slug), sort_order = COALESCE(?, sort_order), is_active = COALESCE(?, is_active) WHERE id = ?',
      [question, answer, category_slug, sort_order, is_active, req.params.id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'FAQ tidak ditemukan.' },
      })
    }

    res.json({ success: true, data: { message: 'FAQ berhasil diperbarui.' } })
  } catch (error) {
    console.error('Admin update FAQ error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.delete('/faq/:id', requireAdmin, async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM faq WHERE id = ?', [req.params.id])

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'FAQ tidak ditemukan.' },
      })
    }

    res.json({ success: true, data: { message: 'FAQ berhasil dihapus.' } })
  } catch (error) {
    console.error('Admin delete FAQ error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

export default router

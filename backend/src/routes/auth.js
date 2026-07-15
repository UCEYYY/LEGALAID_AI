import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'
import env from '../config/env.js'
import { authenticateToken } from '../middleware/auth.js'
import { body, validationResult } from 'express-validator'

const router = Router()

const validateRegister = [
  body('name').isString().trim().isLength({ min: 2, max: 100 }).withMessage('Nama harus 2-100 karakter.'),
  body('email').isEmail().normalizeEmail().withMessage('Email tidak valid.'),
  body('password').isLength({ min: 8, max: 128 }).withMessage('Password harus 8-128 karakter.'),
]

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Email tidak valid.'),
  body('password').notEmpty().withMessage('Password wajib diisi.'),
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

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  )
}

router.post('/register', validateRegister, async (req, res) => {
  const errResponse = handleValidation(req, res)
  if (errResponse) return

  try {
    const { name, email, password } = req.body

    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: { code: 'EMAIL_EXISTS', message: 'Email sudah terdaftar.' },
      })
    }

    const hash = await bcrypt.hash(password, 10)
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, hash, 'user']
    )

    const user = { id: result.insertId, name, email, role: 'user' }
    const token = signToken(user)

    res.status(201).json({
      success: true,
      data: { token, user },
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.post('/login', validateLogin, async (req, res) => {
  const errResponse = handleValidation(req, res)
  if (errResponse) return

  try {
    const { email, password } = req.body

    const [rows] = await pool.execute('SELECT id, name, email, password_hash, role FROM users WHERE email = ?', [email])
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Email atau password salah.' },
      })
    }

    const user = rows[0]
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Email atau password salah.' },
      })
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role })

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    )

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'Pengguna tidak ditemukan.' },
      })
    }

    res.json({ success: true, data: { user: rows[0] } })
  } catch (error) {
    console.error('Profile error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan server.' },
    })
  }
})

export default router

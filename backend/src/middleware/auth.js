import jwt from 'jsonwebtoken'
import env from '../config/env.js'

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Token tidak ditemukan.' },
    })
  }

  try {
    const decoded = jwt.verify(token, env.jwt.secret)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Token tidak valid atau sudah kedaluwarsa.' },
    })
  }
}

export function requireAdmin(req, res, next) {
  authenticateToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Akses ditolak. Hanya admin yang diizinkan.' },
      })
    }
    next()
  })
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    req.user = null
    return next()
  }

  try {
    const decoded = jwt.verify(token, env.jwt.secret)
    req.user = decoded
  } catch {
    req.user = null
  }

  next()
}

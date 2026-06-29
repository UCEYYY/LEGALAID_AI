import rateLimit from 'express-rate-limit'
import env from '../config/env.js'

const rateLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Terlalu banyak permintaan. Coba lagi dalam 1 menit.',
      },
    })
  },
})

export default rateLimiter

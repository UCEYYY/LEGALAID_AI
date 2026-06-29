import 'dotenv/config'

const env = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  groqApiKey: process.env.GROQ_API_KEY || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 20,
  },
}

export default env

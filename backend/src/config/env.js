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
  db: {
    host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
    port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT, 10) || 3306,
    user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'railway',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@legalaid.ai',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },
}

export default env

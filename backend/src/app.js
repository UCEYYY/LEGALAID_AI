import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'
import env from './config/env.js'
import { testConnection } from './config/db.js'
import { migrate } from './db/migrate.js'
import rateLimiter from './middleware/rateLimiter.js'
import errorHandler from './middleware/errorHandler.js'
import chatRoutes from './routes/chat.js'
import healthRoutes from './routes/health.js'
import authRoutes from './routes/auth.js'
import sessionRoutes from './routes/sessions.js'
import adminRoutes from './routes/admin.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()

app.set('trust proxy', 1)

app.use(helmet({
  contentSecurityPolicy: false,
}))
app.use(cors({ origin: env.corsOrigin }))
app.use(express.json({ limit: '10kb' }))

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/chat', rateLimiter, chatRoutes)
app.use('/api/health', healthRoutes)
app.use('/health', healthRoutes)

// Serve frontend static files jika sudah di-build
const frontendDist = join(__dirname, '../../legalaid-frontend/dist')
const frontendDistProd = join(__dirname, '../public/dist')
const distPath = existsSync(frontendDistProd) ? frontendDistProd : (existsSync(frontendDist) ? frontendDist : null)

if (distPath) {
  app.use(express.static(distPath))
  app.get('*', (_req, res) => {
    res.sendFile(join(distPath, 'index.html'))
  })
}

app.use(errorHandler)

async function startServer() {
  await testConnection()
  await migrate()

  app.listen(env.port, () => {
    console.log(`LegalAid API server running on port ${env.port}`)
    if (distPath) {
      console.log(`Serving frontend from ${distPath}`)
    }
  })
}

startServer()

export default app

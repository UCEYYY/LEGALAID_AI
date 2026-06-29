import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'
import env from './config/env.js'
import rateLimiter from './middleware/rateLimiter.js'
import errorHandler from './middleware/errorHandler.js'
import chatRoutes from './routes/chat.js'
import healthRoutes from './routes/health.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP agar Vue app bisa load assets
}))
app.use(cors({ origin: env.corsOrigin }))
app.use(express.json({ limit: '10kb' }))

// API routes
app.use('/api/chat', rateLimiter, chatRoutes)
app.use('/api/health', healthRoutes)
app.use('/health', healthRoutes) // backward compat

// Serve frontend static files jika sudah di-build
const frontendDist = join(__dirname, '../../legalaid-frontend/dist')
const frontendDistProd = join(__dirname, '../public/dist')
const distPath = existsSync(frontendDistProd) ? frontendDistProd : (existsSync(frontendDist) ? frontendDist : null)

if (distPath) {
  app.use(express.static(distPath))
  // Semua route non-API diarahkan ke index.html (Vue Router SPA)
  app.get('*', (_req, res) => {
    res.sendFile(join(distPath, 'index.html'))
  })
}

app.use(errorHandler)

app.listen(env.port, () => {
  console.log(`LegalAid API server running on port ${env.port}`)
  if (distPath) {
    console.log(`Serving frontend from ${distPath}`)
  }
})

export default app

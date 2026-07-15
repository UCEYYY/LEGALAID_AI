import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import pool from '../config/db.js'
import { seed } from './seed.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function migrate() {
  const connection = await pool.getConnection()

  try {
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8')
    const statements = schema.split(';').filter(s => s.trim())

    for (const stmt of statements) {
      if (stmt.trim()) {
        await connection.execute(stmt)
      }
    }

    console.log('Database migration completed')
  } catch (error) {
    console.error('Migration failed:', error.message)
    throw error
  } finally {
    connection.release()
  }

  await seed()
}

export async function runMigration() {
  try {
    await migrate()
  } catch (error) {
    console.error('Failed to run migration:', error.message)
    process.exit(1)
  }
}

const isMainModule = process.argv[1] && process.argv[1].endsWith('migrate.js')
if (isMainModule) {
  runMigration()
}

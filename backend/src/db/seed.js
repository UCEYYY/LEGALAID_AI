import bcrypt from 'bcryptjs'
import pool from '../config/db.js'
import env from '../config/env.js'

const DEFAULT_CATEGORIES = [
  { slug: 'ketenagakerjaan', label: 'Ketenagakerjaan', description: 'Hak pekerja, PHK, upah, dan perjanjian kerja', icon: 'briefcase', sort_order: 1 },
  { slug: 'konsumen', label: 'Perlindungan Konsumen', description: 'Hak konsumen, garansi, dan sengketa belanja', icon: 'shield', sort_order: 2 },
  { slug: 'keluarga', label: 'Hukum Keluarga', description: 'Perceraian, hak asuh, waris, dan pernikahan', icon: 'users', sort_order: 3 },
  { slug: 'pertanahan', label: 'Pertanahan', description: 'Hak milik, sertifikat, dan sengketa tanah', icon: 'map', sort_order: 4 },
  { slug: 'pidana', label: 'Hukum Pidana', description: 'Kasus pidana, pelaporan, dan perlindungan hukum', icon: 'gavel', sort_order: 5 },
  { slug: 'utang_kredit', label: 'Utang & Kredit', description: 'Hutang, kredit macet, dan restrukturisasi', icon: 'credit-card', sort_order: 6 },
]

const DEFAULT_FAQ = [
  {
    question: 'Apakah layanan ini gratis?',
    answer: 'Ya, Layanan Bantuan Hukum AI ini sepenuhnya gratis untuk masyarakat Indonesia.',
    sort_order: 1,
  },
  {
    question: 'Seberapa akurat jawaban AI ini?',
    answer: 'AI kami memberikan informasi hukum umum berdasarkan undang-undang yang berlaku di Indonesia. Namun, ini bukan pengganti konsultasi langsung dengan pengacara untuk kasus spesifik.',
    sort_order: 2,
  },
  {
    question: 'Data saya aman?',
    answer: 'Ya, kami tidak menyimpan data pribadi Anda. Semua percakapan bersifat anonim.',
    sort_order: 3,
  },
  {
    question: 'Jenis kasus hukum apa saja yang bisa ditanyakan?',
    answer: 'Kami mencakup 6 kategori: Ketenagakerjaan, Perlindungan Konsumen, Hukum Keluarga, Pertanahan, Hukum Pidana, dan Utang & Kredit.',
    sort_order: 4,
  },
]

export async function seed() {
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    for (const cat of DEFAULT_CATEGORIES) {
      await connection.execute(
        'INSERT IGNORE INTO categories (slug, label, description, icon, sort_order) VALUES (?, ?, ?, ?, ?)',
        [cat.slug, cat.label, cat.description, cat.icon, cat.sort_order]
      )
    }

    for (const faq of DEFAULT_FAQ) {
      await connection.execute(
        'INSERT IGNORE INTO faq (question, answer, sort_order) VALUES (?, ?, ?)',
        [faq.question, faq.answer, faq.sort_order]
      )
    }

    const adminEmail = env.admin.email
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [adminEmail]
    )

    if (existing.length === 0) {
      const hash = await bcrypt.hash(env.admin.password, 10)
      await connection.execute(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Administrator', adminEmail, hash, 'admin']
      )
      console.log(`Admin account created: ${adminEmail}`)
    }

    await connection.commit()
    console.log('Database seeded successfully')
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

# BAB 3 — Architecture Decision Record (ADR)

**LegalAid AI — Konsultasi Hukum Digital untuk Masyarakat Indonesia**

Setiap keputusan teknis penting dalam pembangunan LegalAid AI didokumentasikan dalam format ADR. Dokumen ini mencatat konteks, keputusan, alasan berbasis kebutuhan sistem, dan konsekuensi dari setiap pilihan teknologi.

---

## ADR-001: Pemilihan Vue.js sebagai Frontend Framework

| Field | Detail |
|---|---|
| **Status** | Accepted |
| **Tanggal** | 1 Juni 2026 |

**Konteks:** Aplikasi membutuhkan framework frontend modern yang mampu membangun antarmuka reaktif dengan komponen yang dapat digunakan ulang, mendukung reaktivitas state management, dan sesuai untuk deployment sebagai SPA.

**Keputusan:** Menggunakan **Vue.js 3** dengan Composition API, sintaks `<script setup>`, dan **Pinia** sebagai state manager.

**Alasan Berbasis Sistem:** (1) Reaktivitas bawaan Vue.js cocok untuk UI chat real-time. (2) Pinia lebih ringan dan mudah diintegrasikan dengan plugin `persistedstate`. (3) SFC mempermudah pemisahan komponen. (4) Vite memberikan HMR yang cepat. (5) Vue Router mendukung navigasi SPA dengan route guards untuk autentikasi.

**Konsekuensi (+):** Development lebih cepat. State management mudah. Bundle lebih kecil dibanding Angular.

**Konsekuensi (-):** Ekosistem komponen enterprise lebih kecil dibanding React.

---

## ADR-002: Pemilihan Groq API (Llama 3.3 70B) sebagai Engine AI

| Field | Detail |
|---|---|
| **Status** | Accepted |
| **Tanggal** | 15 Juli 2026 |
| **Revisi** | Menggantikan ADR asli yang menggunakan Google Gemini API |

**Konteks:** Aplikasi membutuhkan LLM yang mampu menjawab pertanyaan hukum dalam Bahasa Indonesia dengan kualitas memadai, dapat diakses dari server Node.js, dan memiliki free tier yang stabil.

**Keputusan:** Menggunakan **Groq API** dengan model **Llama 3.3 70B Versatile** melalui library `groq-sdk`.

**Alasan Berbasis Sistem:** (1) Groq menawarkan inference speed yang sangat tinggi melalui custom LPU hardware — response time lebih cepat dari provider lain. (2) Free tier Groq memberikan kuota yang cukup untuk development dan demo. (3) Llama 3.3 70B memiliki kualitas Bahasa Indonesia yang baik untuk konteks hukum. (4) API kompatibel dengan format OpenAI, memudahkan integrasi. (5) Tidak memerlukan kartu kredit untuk free tier.

**Opsi yang Dipertimbangkan:** Google Gemini API (digunakan di v1.0, namun free tier kurang stabil), OpenAI GPT-4o (kualitas tinggi namun tidak ada free tier permanen), Anthropic Claude (free tier terbatas).

**Risiko yang Diakui:** Kebijakan free tier Groq dapat berubah. Model Llama 3.3 memiliki training cutoff tertentu.

**Konsekuensi (+):** Response time sangat cepat. Tidak ada biaya selama development. API sederhana.

**Konsekuensi (-):** Bergantung pada layanan eksternal Groq. Model open-source memiliki batasan tertentu dibanding model proprietari.

---

## ADR-003: Pemilihan Node.js + Express sebagai Backend

| Field | Detail |
|---|---|
| **Status** | Accepted |
| **Tanggal** | 1 Juni 2026 |

**Konteks:** Diperlukan backend sebagai proxy aman antara frontend dan AI API, autentikasi pengguna, serta manajemen data.

**Keputusan:** Menggunakan **Node.js** dengan framework **Express.js** sebagai backend.

**Alasan Berbasis Sistem:** (1) API key aman di server-side. (2) Input validation dengan `express-validator`. (3) Rate limiting dengan `express-rate-limit`. (4) Full-stack JavaScript. (5) Middleware pattern untuk autentikasi JWT.

**Konsekuensi (+):** API key aman. Rate limiting, logging, sanitasi input. Stack konsisten.

**Konsekuensi (-):** Satu hop jaringan tambahan.

---

## ADR-004: Pemilihan MySQL (Railway) sebagai Database

| Field | Detail |
|---|---|
| **Status** | Accepted |
| **Tanggal** | 15 Juli 2026 |
| **Revisi** | Menggantikan rencana awal menggunakan Supabase (PostgreSQL) |

**Konteks:** v2.0 membutuhkan database server-side untuk menyimpan data pengguna, sesi konsultasi, dan pesan. Database harus terintegrasi dengan deployment di Railway.

**Keputusan:** Menggunakan **MySQL 8** yang di-manage oleh **Railway** sebagai database server-side.

**Alasan Berbasis Sistem:** (1) Railway menyediakan MySQL managed — zero-ops, auto-backup, terintegrasi dengan backend. (2) mysql2/promise mendukung prepared statements dan connection pooling. (3) Schema relasional sesuai untuk data users, sessions, messages dengan foreign keys dan cascade delete. (4) Indeks pada kolom yang sering di-query (user_id, session_id) memastikan performa. (5) Env vars Railway (MYSQLHOST, MYSQLUSER, dll.) memudahkan konfigurasi.

**Opsi yang Dipertimbangkan:** Supabase/PostgreSQL (rencana awal, namun Railway MySQL lebih terintegrasi), SQLite (tidak cocok untuk cloud deployment), MongoDB (overkill untuk data relasional).

**Konsekuensi (+):** Zero-ops database. Auto-backup. Terintegrasi dengan Railway. Schema relasional yang robust.

**Konsekuensi (-):** Bergantung pada infrastruktur Railway. MySQL prepared statements memiliki batasan tertentu (LIMIT/OFFSET tidak dapat diparameterisasi — menggunakan `pool.query` sebagai workaround).

---

## ADR-005: Pemilihan JWT untuk Autentikasi

| Field | Detail |
|---|---|
| **Status** | Accepted |
| **Tanggal** | 15 Juli 2026 |

**Konteks:** v2.0 membutuhkan autentikasi pengguna untuk membedakan guest dan user terdaftar, serta otorisasi admin.

**Keputusan:** Menggunakan **JWT (JSON Web Token)** dengan `jsonwebtoken` + `bcryptjs` untuk autentikasi.

**Alasan Berbasis Sistem:** (1) Stateless — tidak memerlukan session store di database. (2) JWT berisi payload (id, email, role) yang dapat diverifikasi tanpa query database. (3) bcryptjs untuk hashing password dengan salt rounds yang aman. (4) Token expiry 7 hari via env var. (5) Three middleware: `authenticateToken` (wajib login), `requireAdmin` (wajib admin), `optionalAuth` (login opsional — untuk chat endpoint).

**Implementasi:**
- Register: hash password → insert user → return JWT + user data
- Login: verify password → return JWT + user data
- Middleware: verify JWT di Authorization header → attach user ke req.user
- Role-based: `role` field di JWT payload → `requireAdmin` cek role === 'admin'

**Konsekuensi (+):** Stateless, scalable. Simple implementasi. Cookie-free (localStorage-based).

**Konsekuensi (-):** Token tidak dapat di-revoke selain expiry. Risiko jika JWT secret bocor. Tidak ada refresh token mechanism.

---

## ADR-006: Pemilihan Tailwind CSS sebagai Styling Framework

| Field | Detail |
|---|---|
| **Status** | Accepted |
| **Tanggal** | 1 Juni 2026 |

**Konteks:** Diperlukan styling yang konsisten, responsif, dengan bundle CSS minimal.

**Keputusan:** Menggunakan **Tailwind CSS v3** dengan konfigurasi tema kustom.

**Alasan Berbasis Sistem:** (1) Utility-first untuk UI yang konsisten. (2) PurgeCSS menghasilkan bundle < 20KB. (3) Breakpoint system untuk responsif. (4) Tema kustom: warna navy, royal blue, gold; font Poppins/Inter; custom shadows dan animations.

**Konsekuensi (+):** Developer experience baik. Bundle kecil. Responsif mudah.

**Konsekuensi (-):** Template verbose. Memerlukan konsistensi naming.

---

## ADR-007: Arsitektur Monorepo Backend + Frontend

| Field | Detail |
|---|---|
| **Status** | Accepted |
| **Tanggal** | 15 Juli 2026 |

**Konteks:** Frontend Vue.js perlu di-build dan di-deploy bersama backend Express sebagai satu unit deployment.

**Keputusan:** Monorepo dengan struktur:
```
/
├── backend/          ← Express server + MySQL routes
│   ├── src/
│   └── public/dist/  ← Frontend build output (dari GitHub Actions)
├── legalaid-frontend/ ← Vue.js source code
└── docs/
```

**Alasan Berbasis Sistem:** (1) Frontend di-build ke `legalaid-frontend/dist/`, lalu GitHub Actions workflow menyalin ke `backend/public/dist/`. (2) Express melayani static files dari `backend/public/dist/` — satu URL untuk semua. (3) Deploy Railway hanya perlu satu service (backend) yang sudah include frontend. (4) Mengurangi complexity deployment (tidak perlu CDN terpisah atau reverse proxy).

**Konsekuensi (+):** Deployment simpel — satu Railway service. Satu URL. Tidak perlu CORS antara frontend-backend di production.

**Konsekuensi (-):** Frontend build artifacts ada di repo git. GitHub Actions workflow auto-commit menambah commit noise.

---

## ADR-008: Hybrid Storage — localStorage + MySQL

| Field | Detail |
|---|---|
| **Status** | Accepted |
| **Tanggal** | 15 Juli 2026 |

**Konteks:** Pengguna guest (tanpa login) tetap bisa menggunakan aplikasi tanpa registrasi, namun user terdaftar membutuhkan penyimpanan cloud.

**Keputusan:** Hybrid storage model:
- **Guest:** Riwayat tersimpan di localStorage via Pinia `persistedstate`
- **User terdaftar:** Chat otomatis tersimpan ke MySQL via backend API
- **Chat endpoint** menggunakan `optionalAuth` — jika ada token, simpan ke MySQL; jika tidak, return saja tanpa persist

**Alasan Berbasis Sistem:** (1) Guest tetap bisa menggunakan aplikasi tanpa friction registrasi. (2) User terdaftar mendapat benefit backup cloud dan akses multi-device. (3) `optionalAuth` middleware memungkinkan satu endpoint melayani kedua mode. (4) Frontend `chatStore` (sessionStorage) dan `historyStore` (localStorage) tetap berfungsi untuk guest.

**Konsekuensi (+):** Zero-friction untuk guest. Cloud backup untuk user. Satu endpoint melayani kedua mode.

**Konsekuensi (-):** Dual storage path menambah kompleksitas. Guest kehilangan data jika cache dibersihkan.

---

*LegalAid AI — SDD v2.0 | STMIK Lombok 2026 | Sucianti — SI20230032 & Wulandari — SI20230035*

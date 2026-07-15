# BAB 2 — Context & Constitution

**LegalAid AI — Konsultasi Hukum Digital untuk Masyarakat Indonesia**

---

## 2.1 System Context

LegalAid AI adalah aplikasi web yang berfungsi sebagai perantara antara pengguna (masyarakat umum) dengan layanan kecerdasan buatan (Groq API — Llama 3.3 70B). Sistem dibangun dengan arsitektur full-stack:

- **Frontend** berbasis Vue.js 3 yang berinteraksi langsung dengan pengguna
- **Backend** berbasis Node.js/Express yang berfungsi sebagai proxy AI, autentikasi, dan manajemen data
- **Database** MySQL yang menyimpan data pengguna, sesi konsultasi, pesan, kategori, dan FAQ

---

### 2.1.1 Deskripsi Arsitektur Sistem

| Lapisan | Komponen | Teknologi | Tanggung Jawab |
|---|---|---|---|
| Presentation Layer | UI Aplikasi | Vue.js 3, Tailwind CSS, Pinia, Vue Router | Menampilkan antarmuka chat, admin panel, autentikasi; mengelola state lokal |
| Application Layer | Backend API | Node.js, Express.js | Autentikasi JWT, validasi input, rate limiting, manajemen sesi, admin CRUD |
| AI Service Layer | Groq API Client | Groq SDK (Llama 3.3 70B Versatile) | Memproses prompt hukum dan menghasilkan respons berbahasa Indonesia |
| Storage Layer | Database | MySQL (Railway) | Menyimpan data pengguna, sesi, pesan, kategori, FAQ secara persisten |
| Browser Storage | Client Cache | localStorage + Pinia persistedstate | Menyimpan riwayat percakapan untuk guest (tanpa login) |

---

### 2.1.2 Alur Data Utama (Sequence Description)

#### Alur Konsultasi (Guest — Tanpa Login)

| Langkah | Dari | Ke | Data / Aksi |
|---|---|---|---|
| 1 | Pengguna | Vue.js Frontend | Memilih kategori hukum → mengirim pertanyaan |
| 2 | Vue.js Frontend | Express Backend `POST /api/chat` | JSON body: `{ category, messages, userMessage }` |
| 3 | Express Backend | Groq API | Prompt terstruktur dengan system prompt + conversation history |
| 4 | Groq API | Express Backend | Response text dalam Bahasa Indonesia |
| 5 | Express Backend | Vue.js Frontend | JSON response dengan `reply`, `category`, `timestamp` |
| 6 | Vue.js Frontend | Pengguna | Jawaban AI ditampilkan |
| 7 | Vue.js Frontend | localStorage | Pesan disimpan otomatis ke riwayat percakapan |

#### Alur Konsultasi (User Terdaftar — Dengan Login)

| Langkah | Dari | Ke | Data / Aksi |
|---|---|---|---|
| 1 | Pengguna | Vue.js Frontend | Login → JWT token disimpan di localStorage |
| 2 | Pengguna | Vue.js Frontend | Memilih kategori → mengirim pertanyaan |
| 3 | Vue.js Frontend | Express Backend `POST /api/chat` | Header: `Authorization: Bearer <token>`, Body: `{ category, messages, userMessage, sessionId? }` |
| 4 | Express Backend | Groq API | Prompt + conversation history |
| 5 | Express Backend | MySQL | Menyimpan pesan user + assistant ke `chat_messages` |
| 6 | Express Backend | Vue.js Frontend | JSON response dengan `reply`, `category`, `sessionId`, `timestamp` |
| 7 | Vue.js Frontend | Pengguna | Jawaban AI ditampilkan; sesi tersimpan di server |

#### Alur Autentikasi

| Langkah | Dari | Ke | Data / Aksi |
|---|---|---|---|
| 1 | Pengguna | Vue.js Frontend | Mengisi form registrasi (nama, email, password) |
| 2 | Vue.js Frontend | Express Backend `POST /api/auth/register` | `{ name, email, password }` |
| 3 | Express Backend | MySQL | Cek email unik → hash password → insert user |
| 4 | Express Backend | Vue.js Frontend | JWT token + user data |
| 5 | Vue.js Frontend | localStorage | Simpan token di `legalaid_token` |

---

## 2.2 Daftar Aktor Sistem

| Aktor | Tipe | Status | Deskripsi Interaksi |
|---|---|---|---|
| Pengguna (Guest) | Aktor Utama | **AKTIF** | Membuka aplikasi, memilih kategori, mengirim pertanyaan tanpa login. Riwayat tersimpan di localStorage. |
| Pengguna Terdaftar | Aktor Utama | **AKTIF** | Login/registrasi, konsultasi dengan riwayat tersimpan di MySQL, akses dari multiple device. |
| Admin | Aktor Internal | **AKTIF** | Mengelola sistem: melihat dashboard statistik, mengelola pengguna, sesi, kategori, dan FAQ. |
| Groq API | Sistem Eksternal | **AKTIF** | LLM backend — menerima prompt dan mengembalikan jawaban hukum. |
| MySQL (Railway) | Infrastruktur | **AKTIF** | Database relasional untuk penyimpanan data server-side. |

---

## 2.3 Batasan Sistem

| Kode | Batasan | Implikasi Desain |
|---|---|---|
| B-001 | Kualitas jawaban bergantung pada kemampuan Groq API (Llama 3.3 70B) | Disclaimer wajib ditampilkan. AI tidak dapat menjamin 100% keakuratan hukum. |
| B-002 | Tidak ada integrasi real-time dengan database hukum resmi Indonesia (JDIH) | AI mengandalkan pengetahuan terlatih dengan training cutoff. Regulasi terbaru mungkin tidak tercakup. |
| B-003 | Sistem hanya mendukung Bahasa Indonesia | Input dan output dikunci ke Bahasa Indonesia melalui system prompt. |
| B-004 | AI rentan terhadap hallucination — memberikan referensi hukum yang tidak akurat | System prompt memerintahkan AI mengakui ketidakpastian. Disclaimer mencantumkan risiko ini. |
| B-005 | Rate limiting Groq API (free tier) | Maksimal 20 request per IP per menit. Error 429 ditangani dengan pesan informatif. |
| B-006 | Guest tidak memiliki backup data | Riwayat guest hilang jika cache browser dibersihkan. User terdaftar memiliki backup di MySQL. |

---

## 2.4 Analisis Risiko AI Hukum

| Risiko | Probabilitas | Dampak | Mitigasi |
|---|---|---|---|
| AI memberikan referensi pasal yang tidak ada (hallucination) | Sedang | Tinggi | System prompt memerintahkan AI mengakui ketidakpastian; disclaimer wajib |
| AI mengacu pada regulasi yang sudah dicabut atau diubah | Sedang | Tinggi | Disclaimer bahwa informasi bersifat umum; rekomendasi verifikasi ke JDIH |
| Pengguna mengambil tindakan hukum berdasarkan saran AI tanpa konsultasi profesional | Rendah | Sangat Tinggi | AI merekomendasikan LBH untuk kasus kompleks; disclaimer pada setiap sesi |
| Prompt injection — pengguna memanipulasi AI keluar dari konteks hukum | Sedang | Rendah | Validasi input, system prompt dengan instruksi penolakan topik di luar hukum |

---

## 2.5 Aturan Konten AI (Content Rules)

| Kode | Aturan | Implementasi |
|---|---|---|
| CON-001 | AI **TIDAK BOLEH** mengklaim sebagai pengacara atau konsultan hukum resmi | Ditegaskan dalam system prompt per kategori |
| CON-002 | Setiap respons AI **HARUS** mencantumkan sumber regulasi JIKA yakin; jika tidak yakin, menyatakan ketidakpastian | Instruksi dua arah dalam system prompt |
| CON-003 | Jawaban **HARUS** selalu dalam Bahasa Indonesia | Instruksi bahasa dalam system prompt |
| CON-004 | AI **HARUS** merekomendasikan LBH untuk kasus yang membutuhkan representasi hukum aktif | Instruksi dalam system prompt per kategori |
| CON-005 | AI **WAJIB** menolak pertanyaan di luar 6 kategori hukum yang didefinisikan | Instruksi penolakan dengan pesan redirect yang ramah |

---

## 2.6 Aturan Performa (Performance Rules)

| Kode | Aturan | Target |
|---|---|---|
| PER-001 | Waktu respons end-to-end (kirim hingga karakter pertama muncul) | < 5 detik pada jaringan 4G/WiFi stabil |
| PER-002 | First Contentful Paint (Lighthouse throttling) | < 4 detik |
| PER-003 | Standar aksesibilitas | WCAG 2.1 Level AA |
| PER-004 | Ukuran bundle frontend (gzip) | < 500KB |

---

## 2.7 Teknologi Deployment

| Komponen | Platform | Keterangan |
|---|---|---|
| Backend (Express) | Railway | Containerized Node.js app, auto-deploy dari GitHub |
| Database (MySQL) | Railway (managed) | MySQL 8, terhubung ke backend via env vars |
| Frontend | GitHub Actions → backend/public/dist/ | Build Vue → copy dist → auto-commit → Railway deploy |
| AI Engine | Groq API | Llama 3.3 70B Versatile, via groq-sdk |

---

*LegalAid AI — SDD v2.0 | STMIK Lombok 2026 | Sucianti — SI20230032 & Wulandari — SI20230035*

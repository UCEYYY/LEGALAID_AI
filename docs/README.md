# LegalAid AI — System Design Document (SDD) v1.0

**Konsultasi Hukum Digital untuk Masyarakat Indonesia**

| Field | Detail |
|---|---|
| Mata Kuliah | Front-End Web Development |
| Dosen Pengampu | Jihadul Akbar, S.Kom., M.Kom. |
| Disusun Oleh | Sucianti — SI20230032 & Wulandari — SI20230035 |
| Institusi | STMIK Lombok — Program Studi Sistem Informasi |
| Tahun | 2026 |

---

## Daftar Dokumen

| No | File | Deskripsi |
|---|---|---|
| 1 | [01-PRD.md](./01-PRD.md) | Product Requirement Document — overview produk, problem statement, fitur, user stories, dan success metrics |
| 2 | [02-Context-and-Constitution.md](./02-Context-and-Constitution.md) | Context & Constitution — arsitektur sistem, aktor, batasan, analisis risiko, dan aturan konten AI |
| 3 | [03-ADR.md](./03-ADR.md) | Architecture Decision Records — keputusan teknis pemilihan Vue.js, Gemini API, Node.js, localStorage, Tailwind CSS, dan arsitektur proxy |
| 4 | [04-Database-Schema.md](./04-Database-Schema.md) | Database Schema — struktur data localStorage (v1.0) dan rancangan database PostgreSQL/Supabase (v2.0) |
| 5 | [05-API-Design.md](./05-API-Design.md) | Desain API — spesifikasi endpoint `POST /api/chat` dan `GET /health` beserta validasi, error codes, dan rate limiting |
| 6 | [06-Prompt-Engineering.md](./06-Prompt-Engineering.md) | Desain Prompt Engineering — arsitektur prompt, base system prompt, category context injection, dan strategi mitigasi hallucination |
| 7 | [07-User-Roles-and-Permissions.md](./07-User-Roles-and-Permissions.md) | User Roles & Permissions — permission matrix, alur autentikasi (v2.0), dan roadmap role |

---

## Tech Stack Ringkas

| Layer | Teknologi |
|---|---|
| Frontend | Vue.js 3, Tailwind CSS, Pinia |
| Backend | Node.js, Express.js |
| AI Engine | Google Gemini 1.5 Flash |
| Storage (v1.0) | localStorage + pinia-plugin-persistedstate |
| Storage (v2.0) | Supabase (PostgreSQL) |
| Build Tool | Vite |

---

*SDG 16 — Perdamaian, Keadilan, dan Kelembagaan yang Tangguh*

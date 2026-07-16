# LegalAid AI — System Design Document (SDD) v2.0

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
| 3 | [03-ADR.md](./03-ADR.md) | Architecture Decision Records — keputusan teknis: Vue.js, Groq API, MySQL, JWT auth, admin panel, Tailwind CSS |
| 4 | [04-Database-Schema.md](./04-Database-Schema.md) | Database Schema — struktur MySQL (5 tabel): users, categories, chat_sessions, chat_messages, faq |
| 5 | [05-API-Design.md](./05-API-Design.md) | Desain API — spesifikasi endpoint autentikasi, admin, sesi, chat, dan health check |
| 6 | [06-Prompt-Engineering.md](./06-Prompt-Engineering.md) | Desain Prompt Engineering — arsitektur prompt, base system prompt, category context injection, dan mitigasi hallucination |
| 7 | [07-User-Roles-and-Permissions.md](./07-User-Roles-and-Permissions.md) | User Roles & Permissions — permission matrix Guest/User/Admin, alur autentikasi JWT, dan admin panel |
| 8 | [08-Use-Case-Diagram.md](./08-Use-Case-Diagram.md) | Use Case Diagram — diagram use case seluruh fitur aplikasi (Mermaid), deskripsi 20 use case, dan relasi antar use case |

---

## Tech Stack Ringkas

| Layer | Teknologi |
|---|---|
| Frontend | Vue.js 3, Tailwind CSS, Pinia, Vue Router |
| Backend | Node.js, Express.js |
| AI Engine | Groq API (Llama 3.3 70B) |
| Database | MySQL (Railway) |
| Autentikasi | JWT (jsonwebtoken + bcryptjs) |
| Build Tool | Vite |
| CI/CD | GitHub Actions (frontend build → backend/public/dist/) |
| Deployment | Railway (backend + MySQL) |

---

*SDG 16 — Perdamaian, Keadilan, dan Kelembagaan yang Tangguh*

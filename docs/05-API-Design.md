# BAB 5 — Desain API

**LegalAid AI — Konsultasi Hukum Digital untuk Masyarakat Indonesia**

---

## Informasi Umum

| Field | Detail |
|---|---|
| Base URL (Development) | `http://localhost:3000` |
| Base URL (Production) | `https://legalaid-api.railway.app` |
| Content-Type | `application/json` |
| Autentikasi | JWT Bearer Token (untuk endpoint yang dilindungi) |

---

## 5.1 Autentikasi

### 5.1.1 `POST /api/auth/register`

Registrasi pengguna baru.

**Request Body:**

| Field | Tipe | Required | Validasi |
|---|---|---|---|
| `name` | String | Ya | 2–100 karakter |
| `email` | String | Ya | Format email valid, unique |
| `password` | String | Ya | Minimal 6 karakter |

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": 1, "name": "Budi", "email": "budi@mail.com", "role": "user" }
  }
}
```

**Error Responses:**

| HTTP Status | Kode | Penyebab |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Validasi input gagal |
| 409 | `EMAIL_EXISTS` | Email sudah terdaftar |

---

### 5.1.2 `POST /api/auth/login`

Login pengguna.

**Request Body:**

| Field | Tipe | Required |
|---|---|---|
| `email` | String | Ya |
| `password` | String | Ya |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": 1, "name": "Budi", "email": "budi@mail.com", "role": "user" }
  }
}
```

**Error Responses:**

| HTTP Status | Kode | Penyebab |
|---|---|---|
| 401 | `INVALID_CREDENTIALS` | Email atau password salah |

---

### 5.1.3 `GET /api/auth/me`

Mendapatkan profil pengguna yang sedang login.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "name": "Budi", "email": "budi@mail.com", "role": "user" }
  }
}
```

---

## 5.2 Chat

### 5.2.1 `POST /api/chat`

Mengirim pesan ke AI dan mendapatkan respons.

**Headers:** `Authorization: Bearer <token>` (opsional — untuk user terdaftar)

**Request Body:**

| Field | Tipe | Required | Deskripsi |
|---|---|---|---|
| `category` | String | Ya | Kategori hukum: `'ketenagakerjaan'`, `'konsumen'`, `'keluarga'`, `'pertanahan'`, `'pidana'`, `'utang_kredit'` |
| `messages` | Array | Ya | Riwayat percakapan. Maksimal 20 item. |
| `userMessage` | String | Ya | Pesan terbaru. Maksimal 2000 karakter. |
| `sessionId` | Number | Tidak | ID sesi yang sudah ada (untuk melanjutkan sesi) |

**Contoh Request:**

```json
{
  "category": "ketenagakerjaan",
  "messages": [
    { "role": "user", "content": "Saya di-PHK tanpa surat peringatan." },
    { "role": "assistant", "content": "Pemecatan tanpa SP merupakan pelanggaran..." }
  ],
  "userMessage": "Berapa pesangon yang seharusnya saya terima?"
}
```

**Response (200 OK) — Guest:**

```json
{
  "success": true,
  "data": {
    "reply": "Berdasarkan UU Cipta Kerja No. 11/2020...",
    "category": "ketenagakerjaan",
    "timestamp": "2026-07-15T09:05:00.000Z"
  }
}
```

**Response (200 OK) — User Terdaftar:**

```json
{
  "success": true,
  "data": {
    "reply": "Berdasarkan UU Cipta Kerja No. 11/2020...",
    "category": "ketenagakerjaan",
    "sessionId": 42,
    "timestamp": "2026-07-15T09:05:00.000Z"
  }
}
```

**Error Responses:**

| HTTP Status | Kode | Penyebab |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Validasi input gagal |
| 429 | `RATE_LIMIT_EXCEEDED` | Kuota API habis |
| 503 | `AI_API_ERROR` | Groq API tidak tersedia |

---

## 5.3 Sesi (User Terdaftar)

Semua endpoint di bawah ini memerlukan `Authorization: Bearer <token>`.

### 5.3.1 `GET /api/sessions`

Mendapatkan daftar sesi pengguna yang sedang login.

**Query Params:** `page` (default: 1), `limit` (default: 10, max: 50)

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "sessions": [
      { "id": 1, "category_slug": "ketenagakerjaan", "title": "Konsultasi ketenagakerjaan", "created_at": "...", "updated_at": "..." }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 }
  }
}
```

### 5.3.2 `POST /api/sessions`

Membuat sesi baru.

**Request Body:** `{ "categorySlug": "ketenagakerjaan", "title": "Judul Sesi" }`

### 5.3.3 `GET /api/sessions/:id`

Mendapatkan detail sesi beserta semua pesan.

### 5.3.4 `PATCH /api/sessions/:id`

Memperbarui judul sesi.

### 5.3.5 `DELETE /api/sessions/:id`

Menghapus sesi dan semua pesannya (CASCADE).

### 5.3.6 `POST /api/sessions/:id/messages`

Menambahkan pesan ke sesi yang sudah ada.

---

## 5.4 Admin

Semua endpoint admin memerlukan `Authorization: Bearer <token>` dengan role `admin`.

### 5.4.1 `POST /api/admin/login`

Login admin (endpoint terpisah dari login user).

**Request Body:** `{ "email": "admin@legalaid.ai", "password": "admin123" }`

**Response:** JWT token dengan `role: 'admin'`

### 5.4.2 `GET /api/admin/stats`

Statistik dashboard: total pengguna, sesi, pesan, distribusi kategori, 5 pengguna terbaru.

### 5.4.3 `GET /api/admin/users`

Daftar semua pengguna (role: user) dengan pencarian dan paginasi.

**Query Params:** `page`, `limit`, `search`

### 5.4.4 `GET /api/admin/users/:id`

Detail pengguna beserta daftar sesi konsultasinya.

### 5.4.5 `DELETE /api/admin/users/:id`

Menghapus pengguna dan semua sesi/pesan terkait (CASCADE).

### 5.4.6 `GET /api/admin/sessions`

Semua sesi konsultasi dari semua pengguna, dengan paginasi.

### 5.4.7 `GET /api/admin/sessions/:id`

Detail sesi beserta semua pesan.

### 5.4.8 Manajemen Kategori

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/admin/categories` | Daftar semua kategori |
| POST | `/api/admin/categories` | Buat kategori baru |
| PATCH | `/api/admin/categories/:id` | Perbarui kategori |
| DELETE | `/api/admin/categories/:id` | Hapus kategori |

### 5.4.9 Manajemen FAQ

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/admin/faq` | Daftar semua FAQ |
| POST | `/api/admin/faq` | Buat FAQ baru |
| PATCH | `/api/admin/faq/:id` | Perbarui FAQ |
| DELETE | `/api/admin/faq/:id` | Hapus FAQ |

---

## 5.5 Health Check

### `GET /health` atau `GET /api/health`

**Response (200 OK):**

```json
{
  "status": "ok",
  "version": "2.0.0",
  "timestamp": "2026-07-15T09:00:00.000Z"
}
```

---

## 5.6 Aturan Validasi Input

| Field | Validasi | Kode Error |
|---|---|---|
| `category` | Harus salah satu dari 6 nilai valid | `INVALID_CATEGORY` |
| `userMessage` | Tidak boleh kosong; maksimal 2000 karakter | `MESSAGE_TOO_LONG` |
| `messages` | Array; maksimal 20 item | `INVALID_MESSAGES` |
| `messages[].role` | Harus `'user'` atau `'assistant'` | `INVALID_ROLE` |
| `email` | Format email valid | `VALIDATION_ERROR` |
| `password` | Minimal 6 karakter (register) | `VALIDATION_ERROR` |

---

## 5.7 Rate Limiting

| Aturan | Nilai |
|---|---|
| Endpoint | `POST /api/chat` |
| Maksimal request per IP | 20 request per menit |
| Window reset | 60 detik |
| HTTP status saat limit | `429 Too Many Requests` |

---

## 5.8 Keamanan Backend

| Mekanisme | Detail |
|---|---|
| API Key Storage | Groq API key di `.env` server-side, tidak pernah dikirim ke client |
| JWT Secret | Di `.env`, digunakan untuk sign/verify token |
| Password Hashing | bcryptjs, 10 salt rounds |
| CORS | Hanya mengizinkan origin frontend |
| Rate Limiting | `express-rate-limit` — 20 req/menit untuk `/api/chat` |
| Input Validation | `express-validator` — validasi semua field request |
| Helmet | HTTP security headers |
| Trust Proxy | `app.set('trust proxy', 1)` — untuk rate limiting di Railway |
| Admin Route Guard | `requireAdmin` middleware — verifikasi JWT + role check |

---

*LegalAid AI — SDD v2.0 | STMIK Lombok 2026 | Sucianti — SI20230032 & Wulandari — SI20230035*

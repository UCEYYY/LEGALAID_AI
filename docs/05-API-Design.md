# BAB 5 — Desain API

**LegalAid AI — Konsultasi Hukum Digital untuk Masyarakat Indonesia**

---

## Informasi Umum

| Field | Detail |
|---|---|
| Base URL (Development) | `http://localhost:3000` |
| Base URL (Production) | `https://legalaid-api.railway.app` |
| Content-Type | `application/json` |
| Autentikasi | Tidak diperlukan (v1.0 — Guest only) |

---

## 5.1 Endpoint: `POST /api/chat`

Mengirim pesan pengguna ke backend, yang kemudian meneruskannya ke Google Gemini API dan mengembalikan respons AI.

---

### 5.1.1 Request

**Method:** `POST`  
**URL:** `/api/chat`

#### Request Body

| Field | Tipe | Required | Deskripsi |
|---|---|---|---|
| `category` | `String` | Ya | Kategori hukum aktif. Nilai valid: `'ketenagakerjaan'`, `'konsumen'`, `'keluarga'`, `'pertanahan'`, `'pidana'`, `'utang_kredit'` |
| `messages` | `Array<{role: string, content: string}>` | Ya | Riwayat percakapan sebelumnya. `role`: `'user'` atau `'assistant'`. Maksimal 20 pesan terakhir. |
| `userMessage` | `String` | Ya | Pesan terbaru dari pengguna. Maksimal 2000 karakter. |

#### Contoh Request Body

```json
{
  "category": "ketenagakerjaan",
  "messages": [
    {
      "role": "user",
      "content": "Saya baru saja di-PHK tanpa surat peringatan."
    },
    {
      "role": "assistant",
      "content": "Pemecatan tanpa SP merupakan pelanggaran..."
    }
  ],
  "userMessage": "Berapa besaran pesangon yang seharusnya saya terima?"
}
```

---

### 5.1.2 Response — Success (HTTP 200)

#### Response Body

| Field | Tipe | Deskripsi |
|---|---|---|
| `success` | `Boolean` | Selalu `true` jika HTTP 200 |
| `data.reply` | `String` | Teks jawaban AI dalam Bahasa Indonesia |
| `data.category` | `String` | Kategori hukum yang digunakan dalam respons ini |
| `data.timestamp` | `String (ISO 8601)` | Waktu respons dibuat di server |

#### Contoh Response Body (200 OK)

```json
{
  "success": true,
  "data": {
    "reply": "Berdasarkan UU Cipta Kerja No. 11 Tahun 2020 dan PP No. 35 Tahun 2021, besaran pesangon yang Anda terima dihitung berdasarkan masa kerja...",
    "category": "ketenagakerjaan",
    "timestamp": "2026-06-01T09:05:00.000Z"
  }
}
```

---

### 5.1.3 Response — Error

| HTTP Status | Kode Error | Penyebab | Contoh Response Body |
|---|---|---|---|
| `400 Bad Request` | `INVALID_CATEGORY` | Nilai `category` tidak valid atau kosong | `{ "success": false, "error": { "code": "INVALID_CATEGORY", "message": "Kategori hukum tidak valid." } }` |
| `400 Bad Request` | `MESSAGE_TOO_LONG` | `userMessage` melebihi 2000 karakter | `{ "success": false, "error": { "code": "MESSAGE_TOO_LONG", "message": "Pesan terlalu panjang. Maksimal 2000 karakter." } }` |
| `429 Too Many Requests` | `RATE_LIMIT_EXCEEDED` | IP mengirim lebih dari 20 request per menit | `{ "success": false, "error": { "code": "RATE_LIMIT_EXCEEDED", "message": "Terlalu banyak permintaan. Coba lagi dalam 1 menit." } }` |
| `503 Service Unavailable` | `GEMINI_API_ERROR` | Google Gemini API tidak merespons atau error | `{ "success": false, "error": { "code": "GEMINI_API_ERROR", "message": "Layanan AI sedang tidak tersedia. Coba lagi dalam beberapa saat." } }` |
| `500 Internal Server Error` | `INTERNAL_ERROR` | Error tidak terduga di server | `{ "success": false, "error": { "code": "INTERNAL_ERROR", "message": "Terjadi kesalahan internal. Hubungi administrator." } }` |

#### Format Error Response (Standar)

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Pesan error yang dapat ditampilkan ke pengguna."
  }
}
```

---

## 5.2 Endpoint: `GET /health`

Endpoint health check untuk memverifikasi bahwa backend berjalan dan dapat terhubung ke Gemini API.

| Field | Detail |
|---|---|
| **Method** | `GET` |
| **URL** | `/health` |
| **Autentikasi** | Tidak diperlukan |

### Response (200 OK — Sistem Normal)

```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-06-01T09:00:00.000Z"
}
```

### Response (503 Service Unavailable — Gemini Tidak Dapat Dijangkau)

```json
{
  "status": "degraded",
  "error": "Cannot reach Gemini API"
}
```

---

## 5.3 Aturan Validasi Input

| Field | Validasi | Kode Error |
|---|---|---|
| `category` | Harus salah satu dari 6 nilai yang valid | `INVALID_CATEGORY` |
| `userMessage` | Tidak boleh kosong; maksimal 2000 karakter | `MESSAGE_TOO_LONG` |
| `messages` | Array; maksimal 20 item; setiap item memiliki field `role` dan `content` | `INVALID_MESSAGES` |
| `messages[].role` | Harus `'user'` atau `'assistant'` | `INVALID_ROLE` |

---

## 5.4 Rate Limiting

| Aturan | Nilai |
|---|---|
| Maksimal request per IP | 20 request per menit |
| Window reset | 60 detik |
| Header respons saat limit tercapai | `Retry-After: 60` |
| HTTP status saat limit tercapai | `429 Too Many Requests` |

---

## 5.5 Keamanan Backend

| Mekanisme | Detail |
|---|---|
| API Key Storage | Disimpan di `.env` server-side, tidak pernah dikirim ke client |
| CORS | Hanya mengizinkan origin frontend yang terdaftar |
| Input Sanitasi | Strip karakter kontrol; batasi panjang input |
| Rate Limiting | `express-rate-limit` — 20 req/menit per IP |
| Input Validation | `express-validator` — validasi semua field request |

---

*LegalAid AI — SDD v1.0 | STMIK Lombok 2026 | Sucianti — SI20230032 & Wulandari — SI20230035*

# BAB 4 — Database Schema

**LegalAid AI — Konsultasi Hukum Digital untuk Masyarakat Indonesia**

> Pada versi 1.0, LegalAid AI **tidak menggunakan database server-side**. Semua data percakapan tersimpan di localStorage browser. Bagian ini mendokumentasikan struktur data di sisi klien (v1.0) dan rancangan database relasional untuk versi mendatang (v2.0).

---

## 4.1 Struktur Data localStorage (Versi 1.0)

Data disimpan dalam dua Pinia store yang disinkronisasi ke localStorage secara otomatis oleh `pinia-plugin-persistedstate`.

---

### 4.1.1 Objek: `chatStore`

| Field | Tipe Data | Nilai Default | Keterangan |
|---|---|---|---|
| `messages` | `Array<Message>` | `[]` | Array semua pesan dalam sesi aktif (percakapan yang sedang berjalan) |
| `category` | `String \| null` | `null` | Kategori hukum yang sedang aktif (`'ketenagakerjaan'`, `'konsumen'`, `'keluarga'`, `'pertanahan'`, `'pidana'`, `'utang_kredit'`) |
| `isLoading` | `Boolean` | `false` | Status menunggu respons streaming dari Gemini API |

---

### 4.1.2 Objek: `Message`

> **Catatan revisi:** Field `id` kini menggunakan UUID yang sesungguhnya (format RFC 4122), bukan string timestamp. Field `role` distandardisasi menjadi `'user' | 'assistant'` di seluruh codebase (localStorage dan API payload).

| Field | Tipe Data | Contoh Nilai | Keterangan |
|---|---|---|---|
| `id` | `String (UUID v4)` | `"550e8400-e29b-41d4-a716-446655440000"` | Identifier unik per pesan — generated dengan `crypto.randomUUID()` atau library `uuid` |
| `role` | `String (Enum)` | `"user" \| "assistant"` | Pengirim pesan. **STANDAR TUNGGAL:** `'user'` untuk pengguna, `'assistant'` untuk AI. Saat mengirim ke Gemini API, `'assistant'` ditransformasi menjadi `'model'` di layer backend. |
| `content` | `String` | `"Apa hak saya jika di-PHK?"` | Isi teks pesan |
| `timestamp` | `String (ISO 8601)` | `"2026-06-01T09:00:00.000Z"` | Waktu pesan dibuat — generated dengan `new Date().toISOString()` |
| `category` | `String` | `"ketenagakerjaan"` | Konteks hukum saat pesan dibuat — disimpan untuk referensi riwayat |

> **Catatan transformasi role:** Frontend menggunakan `'user'`/`'assistant'`. Backend men-transform `'assistant'` → `'model'` saat membangun conversation history untuk Gemini API. Transformasi dilakukan di satu tempat (backend adapter) untuk menghindari inkonsistensi.

---

### 4.1.3 Objek: `Session` (historyStore)

| Field | Tipe Data | Contoh Nilai | Keterangan |
|---|---|---|---|
| `id` | `String (UUID v4)` | `"a1b2c3d4-e5f6-7890-abcd-ef1234567890"` | Identifier unik sesi — generated dengan `crypto.randomUUID()` |
| `category` | `String` | `"ketenagakerjaan"` | Kategori hukum sesi |
| `title` | `String` | `"Konsultasi 01 Jun 2026 09:00"` | Judul otomatis sesi — generated dari kategori + timestamp |
| `messages` | `Array<Message>` | `[...]` | Semua pesan dalam sesi ini (snapshot saat sesi disimpan) |
| `createdAt` | `String (ISO 8601)` | `"2026-06-01T09:00:00.000Z"` | Waktu sesi dibuat |
| `updatedAt` | `String (ISO 8601)` | `"2026-06-01T09:30:00.000Z"` | Waktu pesan terakhir ditambahkan |

---

## 4.2 Rancangan Database Server (Versi 2.0 — Future)

Rancangan skema database relasional untuk pengembangan fitur autentikasi dan penyimpanan cloud menggunakan **Supabase (PostgreSQL)**.

---

### 4.2.1 ERD — Deskripsi Relasi Antar Entitas

| Entitas | Primary Key | Atribut Utama | Relasi |
|---|---|---|---|
| `users` | `id (UUID, PK)` | `email (VARCHAR, UNIQUE)`, `created_at` (TIMESTAMPTZ), `last_active` (TIMESTAMPTZ), `is_active` (BOOLEAN) | 1 user → MANY sessions (one-to-many) |
| `sessions` | `id (UUID, PK)` | `user_id` (UUID, FK → users.id), `category` (VARCHAR, NOT NULL), `title` (VARCHAR, NOT NULL), `created_at` (TIMESTAMPTZ), `updated_at` (TIMESTAMPTZ) | 1 session → MANY messages (one-to-many); MANY sessions → 1 user |
| `messages` | `id (UUID, PK)` | `session_id` (UUID, FK → sessions.id ON DELETE CASCADE), `role` (VARCHAR CHECK IN ('user','model')), `content` (TEXT, NOT NULL), `timestamp` (TIMESTAMPTZ) | MANY messages → 1 session |

**Kardinalitas relasi:** `users(1) ─── sessions(N) ─── messages(N)`

Satu pengguna dapat memiliki banyak sesi. Satu sesi dapat memiliki banyak pesan. Penghapusan sesi otomatis menghapus semua pesan dalam sesi tersebut (CASCADE).

---

### 4.2.2 Tabel: `users`

```sql
CREATE TABLE users (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  email      VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ  DEFAULT NOW() NOT NULL,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  is_active  BOOLEAN      DEFAULT TRUE NOT NULL
);
```

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Identifier unik pengguna |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email pengguna untuk autentikasi Supabase |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW(), NOT NULL | Waktu registrasi |
| `last_active` | TIMESTAMPTZ | DEFAULT NOW() | Terakhir kali aktif — diupdate setiap login |
| `is_active` | BOOLEAN | DEFAULT TRUE, NOT NULL | Status akun — FALSE jika dinonaktifkan admin |

---

### 4.2.3 Tabel: `sessions`

```sql
CREATE TABLE sessions (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category   VARCHAR(50) NOT NULL CHECK (
               category IN (
                 'ketenagakerjaan','konsumen','keluarga',
                 'pertanahan','pidana','utang_kredit'
               )
             ),
  title      VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Identifier unik sesi |
| `user_id` | UUID | FOREIGN KEY REFERENCES `users(id)` ON DELETE CASCADE, NOT NULL | Pengguna pemilik sesi |
| `category` | VARCHAR(50) | NOT NULL, CHECK enum | Kategori hukum sesi |
| `title` | VARCHAR(255) | NOT NULL | Judul sesi konsultasi |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW(), NOT NULL | Waktu sesi dibuat |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Waktu update terakhir (auto-update via trigger) |

---

### 4.2.4 Tabel: `messages`

```sql
CREATE TABLE messages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID        NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  role       VARCHAR(20) NOT NULL CHECK (role IN ('user', 'model')),
  content    TEXT        NOT NULL,
  timestamp  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Identifier unik pesan |
| `session_id` | UUID | FOREIGN KEY REFERENCES `sessions(id)` ON DELETE CASCADE, NOT NULL | Sesi pemilik pesan |
| `role` | VARCHAR(20) | NOT NULL, CHECK IN `('user', 'model')` | Pengirim pesan: `'user'` untuk pengguna, `'model'` untuk Gemini |
| `content` | TEXT | NOT NULL | Isi teks pesan |
| `timestamp` | TIMESTAMPTZ | DEFAULT NOW(), NOT NULL | Waktu pesan dikirim |

---

## 4.3 Ringkasan Perbandingan Penyimpanan

| Aspek | v1.0 (localStorage) | v2.0 (Supabase PostgreSQL) |
|---|---|---|
| Lokasi data | Browser pengguna | Server cloud |
| Autentikasi diperlukan | Tidak | Ya (Supabase Auth) |
| Akses multi-device | Tidak | Ya |
| Backup otomatis | Tidak | Ya |
| Risiko kehilangan data | Tinggi (clear cache) | Rendah |
| Biaya infrastruktur | Nol | Supabase free tier |
| Privasi | Lokal, tidak ada transmisi | Data di server Supabase |

---

*LegalAid AI — SDD v1.0 | STMIK Lombok 2026 | Sucianti — SI20230032 & Wulandari — SI20230035*

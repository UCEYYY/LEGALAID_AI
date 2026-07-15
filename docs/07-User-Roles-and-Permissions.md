# BAB 7 — User Roles & Permissions

**LegalAid AI — Konsultasi Hukum Digital untuk Masyarakat Indonesia**

> Pada versi 2.0, LegalAid AI telah mengimplementasikan sistem autentikasi JWT dengan tiga role: Guest, User, dan Admin. Semua role telah aktif dan berfungsi.

---

## 7.1 Daftar Role

| Role | Kode | Deskripsi | Status |
|---|---|---|---|
| Tamu (Guest) | `ROLE_GUEST` | Pengguna yang belum login. Dapat mengakses chat tanpa registrasi. Riwayat tersimpan di localStorage. | **AKTIF** |
| Pengguna Terdaftar | `ROLE_USER` | Pengguna yang telah registrasi. Riwayat tersimpan di MySQL. Dapat diakses dari multiple device. | **AKTIF** |
| Administrator | `ROLE_ADMIN` | Pengelola sistem. Akses ke dashboard statistik, manajemen pengguna, sesi, kategori, dan FAQ. | **AKTIF** |

---

## 7.2 Permission Matrix (Versi 2.0 — Aktual)

| Fitur / Aksi | Guest | User | Admin |
|---|---|---|---|
| Melihat halaman beranda | ✅ | ✅ | ✅ |
| Memilih kategori hukum | ✅ | ✅ | ✅ |
| Melakukan konsultasi AI | ✅ | ✅ | ✅ |
| Menyimpan riwayat di browser (localStorage) | ✅ | ✅ | ✅ |
| Menghapus riwayat di browser | ✅ | ✅ | ✅ |
| Salin teks jawaban AI | ✅ | ✅ | ✅ |
| Reset percakapan | ✅ | ✅ | ✅ |
| Registrasi & Login | ✅ | ✅ | ✅ |
| Menyimpan sesi ke MySQL (server) | ❌ | ✅ | ✅ |
| Melihat riwayat dari database | ❌ | ✅ | ✅ |
| Melihat dashboard admin | ❌ | ❌ | ✅ |
| Memantau statistik server | ❌ | ❌ | ✅ |
| Mengelola pengguna (lihat, hapus) | ❌ | ❌ | ✅ |
| Mengelola sesi konsultasi (lihat) | ❌ | ❌ | ✅ |
| Mengelola kategori (CRUD) | ❌ | ❌ | ✅ |
| Mengelola FAQ (CRUD) | ❌ | ❌ | ✅ |
| Login admin (endpoint terpisah) | ❌ | ❌ | ✅ |

---

## 7.3 Alur Autentikasi

### 7.3.1 Registrasi

| Langkah | Aksi | Detail Teknis |
|---|---|---|
| 1 | Pengguna membuka `/register` dan mengisi form | Nama, email, password, konfirmasi password |
| 2 | Frontend mengirim ke `POST /api/auth/register` | Body: `{ name, email, password }` |
| 3 | Backend memvalidasi input | express-validator: email valid, password >= 6 char, nama 2–100 char |
| 4 | Backend mengecek email unik di MySQL | `SELECT id FROM users WHERE email = ?` |
| 5 | Backend hash password dengan bcryptjs | `bcrypt.hash(password, 10)` |
| 6 | Backend insert user baru | `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')` |
| 7 | Backend generate JWT | Payload: `{ id, email, role }`, expiry: 7 hari |
| 8 | Frontend simpan token | `localStorage.setItem('legalaid_token', token)` |
| 9 | Frontend fetch profile | `GET /api/auth/me` → update authStore |

### 7.3.2 Login

| Langkah | Aksi | Detail Teknis |
|---|---|---|
| 1 | Pengguna membuka `/login` dan mengisi email + password | |
| 2 | Frontend mengirim ke `POST /api/auth/login` | Body: `{ email, password }` |
| 3 | Backend query user dari MySQL | `SELECT id, name, email, password_hash, role FROM users WHERE email = ?` |
| 4 | Backend verifikasi password | `bcrypt.compare(password, user.password_hash)` |
| 5 | Backend generate JWT | Payload: `{ id, email, role }` |
| 6 | Frontend simpan token + redirect | Ke `/chat` untuk user, ke `/admin/dashboard` untuk admin |

### 7.3.3 Login Admin

| Langkah | Aksi | Detail Teknis |
|---|---|---|
| 1 | Admin membuka `/admin/login` | Halaman login khusus admin (dark theme) |
| 2 | Frontend mengirim ke `POST /api/admin/login` | Body: `{ email, password }` |
| 3 | Backend verifikasi + cek role === 'admin' | Jika bukan admin, return 401 |
| 4 | Backend generate JWT | Payload: `{ id, email, role: 'admin' }` |
| 5 | Frontend simpan token + redirect | Ke `/admin/dashboard` |

---

## 7.4 Middleware Autentikasi

| Middleware | Fungsi | Digunakan Di |
|---|---|---|
| `authenticateToken` | Verifikasi JWT wajib. Return 401 jika token tidak ada/invalid. | `/api/auth/me`, `/api/sessions/*` |
| `requireAdmin` | Verifikasi JWT + cek `role === 'admin'`. Return 403 jika bukan admin. | `/api/admin/*` |
| `optionalAuth` | Verifikasi JWT jika ada. Jika tidak ada, set `req.user = null` dan lanjut. | `POST /api/chat` |

### Implementasi

```javascript
// backend/src/middleware/auth.js
export function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token tidak ditemukan.' })
  
  try {
    req.user = jwt.verify(token, env.jwt.secret)
    next()
  } catch {
    return res.status(401).json({ error: 'Token tidak valid.' })
  }
}

export function requireAdmin(req, res, next) {
  authenticateToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Akses ditolak.' })
    }
    next()
  })
}

export function optionalAuth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]
  try { req.user = jwt.verify(token, env.jwt.secret) }
  catch { req.user = null }
  next()
}
```

---

## 7.5 Frontend Route Guards

Vue Router menggunakan `meta` field untuk mengontrol akses halaman:

| Meta | Guard Logic | Halaman |
|---|---|---|
| `requiresAuth: true` | Jika tidak login → redirect ke `/login` | `/chat`, `/history` |
| `requiresAdmin: true` | Jika tidak login → redirect ke `/admin/login`; jika login tapi bukan admin → redirect ke `/` | Semua `/admin/*` |
| `guestOnly: true` | Jika sudah login → redirect ke `/chat` | `/login`, `/register` |

```javascript
// legalaid-frontend/src/router/index.js
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('legalaid_token')
  
  if (to.meta.requiresAuth && !token) return next('/login')
  if (to.meta.requiresAdmin && !token) return next('/admin/login')
  if (to.meta.guestOnly && token) return next('/chat')
  next()
})
```

---

## 7.6 Data Flow Autentikasi

```
┌─────────────┐     POST /api/auth/login      ┌─────────────┐
│   Frontend   │ ──────────────────────────→   │   Backend    │
│   (Vue.js)   │                               │  (Express)   │
│              │  ←──────────────────────────  │              │
│              │   { token, user }             │              │
└──────┬──────┘                               └──────┬──────┘
       │                                              │
       │ localStorage.setItem('legalaid_token')       │ MySQL SELECT
       │                                              │ bcrypt.compare
       │                                              │ jwt.sign
       ▼                                              ▼
┌─────────────┐                               ┌─────────────┐
│  localStorage│                               │    MySQL     │
│   token      │                               │   users      │
└──────┬──────┘                               └─────────────┘
       │
       │ Authorization: Bearer <token>
       ▼
┌─────────────┐
│  Protected   │
│  Endpoints   │
└─────────────┘
```

---

## 7.7 Admin Default

| Field | Nilai |
|---|---|
| Email | `admin@legalaid.ai` |
| Password | `admin123` |
| Role | `admin` |
| Dibuat oleh | `seed.js` saat migrasi database pertama kali |

> **Catatan keamanan:** Password admin default harus diubah di production. Saat ini masih menggunakan default untuk kemudahan testing.

---

*LegalAid AI — SDD v2.0 | STMIK Lombok 2026 | Sucianti — SI20230032 & Wulandari — SI20230035*

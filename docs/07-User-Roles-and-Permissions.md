# BAB 7 — User Roles & Permissions

**LegalAid AI — Konsultasi Hukum Digital untuk Masyarakat Indonesia**

> **Catatan revisi penting:** Bab ini direvisi untuk menghilangkan inkonsistensi antara scope v1.0 dan fitur masa depan. Role Admin dan autentikasi JWT secara eksplisit ditandai sebagai 'Direncanakan v2.0' dan tidak memiliki implementasi aktif di v1.0.

---

## 7.1 Daftar Role

| Role | Kode | Deskripsi | Status di v1.0 |
|---|---|---|---|
| Tamu (Guest) | `ROLE_GUEST` | Pengguna yang belum login. Seluruh fitur v1.0 tersedia untuk role ini. | **AKTIF** — satu-satunya role di v1.0 |
| Pengguna Terdaftar | `ROLE_USER` | Pengguna yang telah registrasi. Dapat menyimpan riwayat di cloud dan mengakses dari multiple device. | **DIRENCANAKAN v2.0** — belum diimplementasikan |
| Administrator | `ROLE_ADMIN` | Pengelola sistem. Akses ke dashboard monitoring dan konfigurasi system prompt. | **DIRENCANAKAN v2.0** — belum diimplementasikan |

> **Mengapa Admin tidak ada di v1.0:** Karena tidak ada database server-side di v1.0, tidak ada data yang dapat dipantau. Statistik penggunaan tidak dapat dihitung tanpa server-side logging. Dashboard admin hanya akan bermakna setelah v2.0 dengan Supabase diimplementasikan.

---

## 7.2 Permission Matrix (Versi 1.0 — Aktual)

| Fitur / Aksi | Guest (v1.0) | User (v2.0) | Admin (v2.0) |
|---|---|---|---|
| Melihat halaman beranda | ✅ Aktif | ✅ | ✅ |
| Memilih kategori hukum | ✅ Aktif | ✅ | ✅ |
| Melakukan konsultasi AI | ✅ Aktif | ✅ | ✅ |
| Menyimpan riwayat di browser (localStorage) | ✅ Aktif | ✅ | ✅ |
| Menghapus riwayat di browser | ✅ Aktif | ✅ | ✅ |
| Salin teks jawaban AI | ✅ Aktif | ✅ | ✅ |
| Reset percakapan | ✅ Aktif | ✅ | ✅ |
| Menyimpan riwayat di cloud (server) | ❌ Tidak tersedia | ✅ v2.0 | ✅ v2.0 |
| Akses riwayat dari device lain | ❌ Tidak tersedia | ✅ v2.0 | ✅ v2.0 |
| Mengakses dashboard admin | ❌ Tidak ada | ❌ Tidak ada | ✅ v2.0 |
| Memantau statistik server | ❌ Tidak ada data server | ❌ Tidak ada | ✅ v2.0 |
| Konfigurasi system prompt | ❌ Tidak ada | ❌ Tidak ada | ✅ v2.0 |

---

## 7.3 Alur Autentikasi (Direncanakan v2.0)

Alur autentikasi menggunakan Supabase Auth yang direncanakan untuk v2.0:

| Langkah | Aksi | Detail Teknis |
|---|---|---|
| 1 | Pengguna membuka halaman Login dan memasukkan email + password | Vue Router guard mengarahkan pengguna yang belum login ke `/login` |
| 2 | Frontend mengirim kredensial ke Supabase Auth | `supabase.auth.signInWithPassword({ email, password })` |
| 3 | Supabase memverifikasi dan mengembalikan JWT token + refresh token | JWT disimpan secara otomatis di Supabase client library |
| 4 | Setiap request ke backend menyertakan JWT di Authorization header | `Authorization: Bearer <jwt_token>` |
| 5 | Backend memverifikasi JWT sebelum memproses request ke endpoint protected | Middleware `verifyJWT` menggunakan Supabase Admin SDK |
| 6 | Jika token expired, Supabase client melakukan refresh token otomatis | `supabase.auth.onAuthStateChange()` menangani refresh otomatis |

> **Implementasi v1.0 tidak memerlukan autentikasi.** Semua endpoint `/api/chat` dapat diakses tanpa JWT. Endpoint `/api/admin/*` tidak ada di v1.0 dan hanya akan dibuat saat v2.0 dikembangkan.

---

*LegalAid AI — SDD v1.0 | STMIK Lombok 2026 | Sucianti — SI20230032 & Wulandari — SI20230035*

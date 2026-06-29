# BAB 2 — Context & Constitution

**LegalAid AI — Konsultasi Hukum Digital untuk Masyarakat Indonesia**

---

## 2.1 System Context

LegalAid AI adalah aplikasi web yang berfungsi sebagai perantara antara pengguna (masyarakat umum) dengan layanan kecerdasan buatan (Google Gemini API). Sistem dirancang dalam dua lapisan:

- **Frontend** berbasis Vue.js yang berinteraksi langsung dengan pengguna
- **Backend** berbasis Node.js/Express yang berfungsi sebagai proxy aman ke API eksternal

---

### 2.1.1 Deskripsi Arsitektur Sistem

| Lapisan | Komponen | Teknologi | Tanggung Jawab |
|---|---|---|---|
| Presentation Layer | UI Aplikasi | Vue.js 3, Tailwind CSS, Pinia | Menampilkan antarmuka chat, menerima input pengguna, mengelola state lokal |
| Application Layer | Backend Proxy | Node.js, Express.js | Meneruskan request ke Gemini API, menyembunyikan API key, validasi dan sanitasi input |
| AI Service Layer | Gemini API Client | Google Gemini 1.5 Flash (via `@google/generative-ai`) | Memproses prompt hukum dan menghasilkan respons berbahasa Indonesia |
| Storage Layer | Browser Storage | localStorage + Pinia persistedstate | Menyimpan riwayat percakapan di sisi klien (tidak ada data ke server di v1.0) |

---

### 2.1.2 Alur Data Utama (Sequence Description)

Alur request konsultasi hukum (happy path):

| Langkah | Dari | Ke | Data / Aksi |
|---|---|---|---|
| 1 | Pengguna | Vue.js Frontend | Memilih kategori hukum → mengirim pertanyaan melalui form chat |
| 2 | Vue.js Frontend | Express Backend `POST /api/chat` | JSON body: `{ category, messages, userMessage }` |
| 3 | Express Backend | Google Gemini API | Prompt terstruktur dengan system prompt + conversation history |
| 4 | Google Gemini API | Express Backend | Streaming response text dalam Bahasa Indonesia |
| 5 | Express Backend | Vue.js Frontend | Streaming response diteruskan ke client (SSE atau chunked response) |
| 6 | Vue.js Frontend | Pengguna | Jawaban AI ditampilkan secara bertahap (streaming UI) |
| 7 | Vue.js Frontend | localStorage | Pesan disimpan otomatis ke riwayat percakapan |

---

## 2.2 Daftar Aktor Sistem

> **Catatan penting:** Pada versi 1.0, **hanya aktor Pengguna (Guest) dan Google Gemini API yang aktif**. Aktor Admin dan Firebase bersifat opsional dan direncanakan untuk versi mendatang.

| Aktor | Tipe | Status di v1.0 | Deskripsi Interaksi |
|---|---|---|---|
| Pengguna (Guest) | Aktor Utama | **AKTIF** | Membuka aplikasi, memilih kategori, mengirim pertanyaan, membaca jawaban, melihat/menghapus riwayat di browser |
| Google Gemini API | Sistem Eksternal | **AKTIF** | Menerima prompt terstruktur dari backend dan mengembalikan jawaban hukum dalam Bahasa Indonesia |
| Browser/Device | Infrastruktur | **AKTIF** | Menyimpan riwayat chat via localStorage; menjalankan frontend Vue.js |
| Admin | Aktor Internal | **TIDAK AKTIF** (Direncanakan v2.0) | Akan mengelola system prompt, memantau statistik (membutuhkan database server-side yang belum ada di v1.0) |
| Firebase / Supabase | Sistem Eksternal | **TIDAK AKTIF** (Direncanakan v2.0) | Autentikasi dan penyimpanan cloud — hanya relevan setelah fitur login diimplementasikan |

---

## 2.3 Batasan Sistem

| Kode | Batasan | Implikasi Desain |
|---|---|---|
| B-001 | Sistem tidak menyimpan data percakapan di server — semua tersimpan di browser pengguna | Tidak ada database percakapan di backend. Statistik server-side tidak dapat dihitung di v1.0. Admin dashboard tidak relevan. |
| B-002 | Sistem tidak melakukan autentikasi pengguna pada versi 1.0 | Tidak ada JWT, tidak ada session management. Fitur admin dinonaktifkan sepenuhnya. |
| B-003 | Kualitas dan akurasi jawaban bergantung pada kemampuan Google Gemini API | Sistem tidak dapat menjamin 100% keakuratan hukum. Disclaimer wajib ditampilkan. |
| B-004 | Tidak ada integrasi real-time dengan database hukum resmi Indonesia (JDIH) | AI mengandalkan pengetahuan terlatih yang memiliki batas waktu (training cutoff). Regulasi terbaru mungkin tidak tercakup. |
| B-005 | Sistem hanya mendukung Bahasa Indonesia | Input dan output dikunci ke Bahasa Indonesia melalui system prompt. |
| B-006 | AI rentan terhadap hallucination — memberikan referensi hukum yang tidak akurat atau tidak ada | System prompt dirancang untuk meminimalkan hallucination dengan instruksi verifikasi. Disclaimer mencantumkan risiko ini secara eksplisit. |

---

## 2.4 Analisis Risiko AI Hukum

> Aplikasi yang memberikan informasi hukum berbasis AI memiliki profil risiko berbeda dari chatbot biasa.

| Risiko | Probabilitas | Dampak | Mitigasi |
|---|---|---|---|
| AI memberikan referensi pasal yang tidak ada (hallucination) | Sedang | Tinggi — pengguna dapat mengambil tindakan berdasarkan informasi salah | Disclaimer wajib; system prompt memerintahkan AI untuk mengakui ketidakpastian; pengguna diarahkan memverifikasi ke sumber resmi |
| AI mengacu pada regulasi yang sudah dicabut atau diubah | Tinggi — hukum Indonesia sering berubah | Tinggi | Disclaimer bahwa informasi bersifat umum dan tidak diperbarui real-time; rekomendasi untuk memverifikasi ke JDIH Kemenkumham |
| Pengguna mengambil tindakan hukum berdasarkan saran AI tanpa konsultasi profesional | Rendah–Sedang | Sangat Tinggi | Disclaimer pada setiap sesi; AI secara aktif merekomendasikan LBH untuk kasus kompleks; pesan penutup selalu menyarankan konsultasi profesional |
| Prompt injection — pengguna memanipulasi AI untuk keluar dari konteks hukum | Sedang | Rendah–Sedang | Backend melakukan sanitasi input; system prompt memiliki instruksi penolakan topik di luar hukum; panjang prompt dibatasi |

---

## 2.5 Aturan Konten AI (Content Rules)

| Kode | Aturan | Implementasi | Alasan |
|---|---|---|---|
| CON-001 | AI **TIDAK BOLEH** mengklaim sebagai pengacara atau konsultan hukum resmi | Ditegaskan dalam system prompt dengan contoh kalimat penolakan | Mencegah pengguna menganggap AI sebagai pengganti pengacara berlisensi |
| CON-002 | Setiap respons AI **HARUS** mencantumkan sumber regulasi JIKA AI yakin dengan referensinya; jika tidak yakin, AI harus secara eksplisit menyatakan bahwa referensi perlu diverifikasi | Instruksi dua arah dalam system prompt: sebut referensi jika ada, nyatakan ketidakpastian jika tidak | Menyeimbangkan kegunaan referensi hukum dengan risiko hallucination |
| CON-003 | Jawaban **HARUS** selalu dalam Bahasa Indonesia | Instruksi bahasa dalam system prompt + validasi di backend | Konsistensi pengguna dan scope produk |
| CON-004 | AI **HARUS** merekomendasikan LBH untuk kasus yang membutuhkan representasi hukum aktif | Instruksi dalam system prompt dengan kriteria kasus 'kompleks' | Melindungi pengguna dari over-reliance pada AI |
| CON-005 | Panjang jawaban dibatasi 400–600 kata untuk pertanyaan umum, dan dapat lebih panjang untuk pertanyaan prosedural yang memerlukan langkah-langkah detail | Instruksi panjang adaptif di system prompt berdasarkan jenis pertanyaan | Menggantikan batas 300 kata yang terlalu kaku dan tidak menjamin kelengkapan jawaban untuk kasus kompleks |
| CON-006 | AI **WAJIB** menolak pertanyaan di luar 6 kategori hukum yang didefinisikan | Instruksi penolakan dalam system prompt dengan pesan redirect yang ramah | Menjaga fokus aplikasi dan menghindari misuse |

---

## 2.6 Aturan Performa (Performance Rules)

| Kode | Aturan | Target | Catatan Realisme |
|---|---|---|---|
| PER-001 | Waktu respons end-to-end (dari kirim hingga karakter pertama muncul) | < 5 detik pada jaringan 4G/WiFi stabil | Target ini bergantung pada latensi Gemini API yang dikontrol Google. Dalam kondisi normal, Gemini Flash mengembalikan token pertama dalam 1-3 detik. Target tidak dapat dijamin saat Google API degradasi. |
| PER-002 | First Contentful Paint pada simulasi 3G (Lighthouse throttling) | < 4 detik | Target direvisi dari 3 detik karena Vue.js + Tailwind memiliki bundle yang lebih besar dari pure HTML. Dioptimasi dengan lazy loading route dan code splitting Vite. |
| PER-003 | Standar aksesibilitas | WCAG 2.1 Level AA | Termasuk: contrast ratio >= 4.5:1, semua elemen interaktif dapat diakses keyboard, label ARIA pada form input. |
| PER-004 | Ukuran bundle frontend (gzip) | < 500KB | Dicapai dengan Vite tree-shaking, hanya mengimpor komponen Tailwind yang digunakan (PurgeCSS), dan lazy loading halaman. |

---

*LegalAid AI — SDD v1.0 | STMIK Lombok 2026 | Sucianti — SI20230032 & Wulandari — SI20230035*

# BAB 3 — Architecture Decision Record (ADR)

**LegalAid AI — Konsultasi Hukum Digital untuk Masyarakat Indonesia**

Setiap keputusan teknis penting dalam pembangunan LegalAid AI didokumentasikan dalam format ADR. Dokumen ini mencatat konteks, keputusan, alasan berbasis kebutuhan sistem, dan konsekuensi dari setiap pilihan teknologi.

## ADR-001: Pemilihan Vue.js sebagai Frontend Framework

| Field | Detail |
|---|---|
| **Status** | Accepted |
| **Tanggal** | 1 Juni 2026 |

**Konteks:** Aplikasi membutuhkan framework frontend modern yang mampu membangun antarmuka reaktif dengan komponen yang dapat digunakan ulang, mendukung reaktivitas state management, dan sesuai untuk deployment sebagai SPA.

**Keputusan:** Menggunakan **Vue.js 3** dengan Composition API, sintaks `<script setup>`, dan **Pinia** sebagai state manager.

**Alasan Berbasis Sistem:** (1) Reaktivitas bawaan Vue.js cocok untuk UI chat real-time yang memerlukan state update otomatis saat pesan baru masuk. (2) Pinia lebih ringan dan lebih mudah diintegrasikan dengan plugin `persistedstate` untuk sinkronisasi ke localStorage dibanding Redux/Vuex. (3) Single File Component (SFC) mempermudah pemisahan komponen chat, sidebar, dan header secara modular. (4) Vite sebagai build tool memberikan Hot Module Replacement (HMR) yang cepat selama development. (5) Ekosistem Vue Router mendukung navigasi SPA tanpa full page reload.

**Opsi yang Dipertimbangkan:** React (lebih mature, ekosistem lebih besar namun boilerplate lebih tinggi), Svelte (lebih ringan namun ekosistem lebih kecil dan kurang familiar), Vanilla JS (tidak memiliki reaktivitas dan state management yang memadai untuk aplikasi chat).

**Konsekuensi (+):** Development lebih cepat dengan template Vue yang ekspresif. State management percakapan mudah dikelola dengan Pinia. Bundle lebih kecil dibanding Angular.

**Konsekuensi (-):** Ekosistem komponen enterprise lebih kecil dibanding React untuk fitur-fitur advanced yang mungkin dibutuhkan di v2.0+.

---

## ADR-002: Pemilihan Google Gemini API sebagai Engine AI

| Field | Detail |
|---|---|
| **Status** | Accepted |
| **Tanggal** | 1 Juni 2026 |

**Konteks:** Aplikasi membutuhkan LLM yang mampu menjawab pertanyaan hukum dalam Bahasa Indonesia dengan kualitas yang memadai, dapat diakses dari server Node.js, dan sesuai untuk konteks penelitian skripsi (tanpa anggaran API berbayar).

**Keputusan:** Menggunakan **Google Gemini 1.5 Flash** melalui library `@google/generative-ai`.

**Alasan Berbasis Sistem:** (1) Kualitas pemahaman Bahasa Indonesia: Gemini dilatih dengan dataset multibahasa termasuk teks hukum Indonesia, menghasilkan respons yang natural dan relevan secara kontekstual. (2) Kemampuan instruction following: Gemini Flash menunjukkan kemampuan mengikuti system prompt panjang dan terstruktur dengan baik — penting untuk mengontrol persona, format, dan batasan konten. (3) Free tier yang cukup untuk development: paket gratis menyediakan kuota request yang cukup untuk development dan pengujian skala kecil tanpa persyaratan kartu kredit. (4) Dukungan streaming response: API mendukung streaming token, memungkinkan UI menampilkan jawaban secara bertahap dan meningkatkan persepsi performa pengguna.

**Opsi yang Dipertimbangkan:** OpenAI GPT-4o (kualitas tinggi namun tidak ada free tier permanen, membutuhkan biaya), Anthropic Claude Haiku (free tier terbatas, kualitas baik namun dokumentasi integrasi Node.js lebih sedikit), LLM lokal via Ollama (tidak membutuhkan API key namun membutuhkan hardware khusus, tidak praktis untuk deployment publik).

**Risiko yang Diakui:** Kebijakan free tier Google dapat berubah sewaktu-waktu. Jawaban AI dapat berubah antar versi model. Bergantung pada ketersediaan layanan pihak ketiga (uptime Google).

**Konsekuensi (+):** Tidak ada biaya selama development. Kualitas Bahasa Indonesia sangat baik. Mendukung streaming.

**Konsekuensi (-):** Bergantung pada layanan eksternal Google. Model cutoff date membatasi pengetahuan regulasi terbaru.

---

## ADR-003: Pemilihan Node.js + Express sebagai Backend

| Field | Detail |
|---|---|
| **Status** | Accepted |
| **Tanggal** | 1 Juni 2026 |

**Konteks:** Diperlukan backend sebagai proxy aman antara frontend dan Gemini API untuk menyembunyikan API key dari kode sisi klien, melakukan validasi input, dan menerapkan rate limiting.

**Keputusan:** Menggunakan **Node.js** dengan framework **Express.js** sebagai backend minimal.

**Alasan Berbasis Sistem:** (1) Keamanan API key: API key Gemini disimpan di environment variable server-side (`.env`), tidak pernah dikirim ke browser. (2) Input validation & sanitasi: Express middleware (`express-validator`) memvalidasi dan membersihkan input sebelum diteruskan ke Gemini — mencegah prompt injection dan input berbahaya. (3) Rate limiting: Middleware `express-rate-limit` dapat mencegah abuse API dan melindungi kuota Gemini. (4) Konsistensi bahasa: Full-stack JavaScript memungkinkan berbagi tipe data (TypeScript interfaces) antara frontend dan backend tanpa konversi. (5) Library support: `@google/generative-ai` tersedia secara native untuk Node.js dengan dukungan TypeScript.

**Konsekuensi (+):** API key aman. Backend dapat menerapkan rate limiting, logging, dan sanitasi input. Stack JavaScript konsisten.

**Konsekuensi (-):** Menambah satu hop jaringan (latensi < 50ms dalam kondisi normal). Tidak seoptimal bahasa statically-typed untuk performa tinggi, namun memadai untuk skala proyek ini.

---

## ADR-004: Pemilihan localStorage untuk Penyimpanan Riwayat

| Field | Detail |
|---|---|
| **Status** | Accepted |
| **Tanggal** | 1 Juni 2026 |

**Konteks:** Aplikasi perlu menyimpan riwayat percakapan agar dapat diakses kembali tanpa login, sesuai dengan batasan v1.0 yang tidak memiliki database server-side.

**Keputusan:** Menggunakan **localStorage** browser dengan Pinia plugin `pinia-plugin-persistedstate` untuk sinkronisasi otomatis.

**Alasan Berbasis Sistem:** (1) Tidak memerlukan database eksternal atau autentikasi — konsisten dengan scope v1.0. (2) Data tersimpan lokal di device pengguna — secara inheren privat tanpa konfigurasi tambahan. (3) Kapasitas localStorage (5-10MB per origin) cukup untuk menyimpan ratusan sesi percakapan teks. (4) Pinia `persistedstate` plugin menyinkronisasi store secara otomatis tanpa boilerplate kode.

**Konsekuensi (+):** Privasi pengguna terjaga. Zero infrastruktur database. Implementasi cepat.

**Konsekuensi (-):** Riwayat hilang jika pengguna membersihkan cache/storage browser. Tidak dapat diakses dari device lain. Tidak ada backup.

---

## ADR-005: Pemilihan Tailwind CSS sebagai Styling Framework

| Field | Detail |
|---|---|
| **Status** | Accepted |
| **Tanggal** | 1 Juni 2026 |

**Konteks:** Diperlukan pendekatan styling yang konsisten, dapat menghasilkan desain responsif dengan cepat, dan menghasilkan bundle CSS yang minimal setelah production build.

**Keputusan:** Menggunakan **Tailwind CSS v3** dengan konfigurasi tema kustom (warna brand, tipografi).

**Alasan Berbasis Sistem:** (1) Utility-first memungkinkan pembuatan komponen UI chat yang konsisten tanpa menulis CSS kustom yang berlebihan. (2) PurgeCSS bawaan Tailwind menghapus class yang tidak digunakan — menghasilkan bundle CSS < 20KB dalam production. (3) Breakpoint system (`sm:`, `md:`, `lg:`) mempermudah implementasi desain responsif untuk F-006. (4) Integrasi native dengan Vite menghasilkan build yang optimal.

**Konsekuensi (+):** Developer experience sangat baik. Bundle CSS production sangat kecil. Desain responsif mudah diimplementasikan.

**Konsekuensi (-):** Template Vue/HTML menjadi verbose karena banyak class utility. Memerlukan konvensi penamaan komponen yang konsisten.

---

## ADR-006: Arsitektur Proxy Backend untuk Keamanan API

| Field | Detail |
|---|---|
| **Status** | Accepted |
| **Tanggal** | 1 Juni 2026 |

**Konteks:** API key Google Gemini tidak boleh terekspos ke kode frontend karena dapat dengan mudah diekstrak dari browser DevTools dan disalahgunakan.

**Keputusan:** Semua permintaan ke Gemini API dilakukan melalui backend Express sebagai proxy — tidak ada pemanggilan Gemini langsung dari browser.

**Implementasi Keamanan:** (1) API key disimpan di file `.env` di server, tidak pernah dikirim ke client. (2) Backend memvalidasi format dan panjang input sebelum diteruskan ke Gemini. (3) Rate limiting: maksimal 20 request per IP per menit untuk mencegah abuse. (4) Input sanitasi: strip karakter kontrol, batasi panjang input (maksimal 2000 karakter) untuk mencegah prompt injection yang panjang. (5) CORS dikonfigurasi hanya mengizinkan origin frontend yang sah.

**Konsekuensi (+):** API key aman dari eksposur publik. Rate limiting melindungi kuota Gemini. Input validation mengurangi risiko prompt injection.

**Konsekuensi (-):** Satu hop jaringan tambahan (latensi < 50ms). Membutuhkan deployment backend terpisah dari frontend.

---

*LegalAid AI — SDD v1.0 | STMIK Lombok 2026 | Sucianti — SI20230032 & Wulandari — SI20230035*

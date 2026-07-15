# BAB 1 — Product Requirement Document (PRD)

**LegalAid AI — Konsultasi Hukum Digital untuk Masyarakat Indonesia**

---

## 1.1 Overview Produk

| Field | Detail |
|---|---|
| Nama Aplikasi | LegalAid AI |
| Tagline | Konsultasi Hukum Gratis untuk Semua Orang |
| Versi | 2.0.0 |
| Platform | Web Application (Responsive) |
| Bahasa | Bahasa Indonesia |
| SDG Target | SDG 16 — Perdamaian, Keadilan, dan Kelembagaan yang Tangguh |

---

## 1.1.1 Problem Statement

Akses terhadap bantuan hukum di Indonesia masih sangat tidak merata. Berdasarkan data Badan Pembinaan Hukum Nasional (BPHN) Kemenkumham, pada tahun 2023 terdapat 619 Organisasi Bantuan Hukum (OBH) yang terakreditasi di seluruh Indonesia untuk melayani lebih dari 270 juta penduduk. Meski Lembaga Bantuan Hukum (LBH) secara resmi memberikan layanan gratis untuk masyarakat tidak mampu berdasarkan UU No. 16 Tahun 2011, hambatan utama yang masih ada adalah:

| No. | Masalah | Dampak |
|---|---|---|
| 1 | Keterbatasan geografis — sebagian besar LBH terkonsentrasi di kota besar (Jakarta, Surabaya, Bandung) | Masyarakat pedesaan sulit mengakses layanan |
| 2 | Rendahnya literasi hukum — masyarakat tidak mengetahui hak-hak dasar mereka sebelum dapat mencari bantuan | Banyak kasus tidak ditangani karena korban tidak sadar dirinya memiliki hak |
| 3 | Birokrasi dan proses verifikasi OBH yang memerlukan waktu | Penanganan lambat untuk kasus yang mendesak |
| 4 | Stigma dan kekhawatiran biaya konsultasi awal | Banyak masyarakat enggan mendekati layanan hukum formal |

> **Catatan:** Permasalahan bukan semata tentang biaya pengacara, melainkan lebih kepada literasi hukum, aksesibilitas geografis, dan hambatan psikologis untuk mencari bantuan hukum.
> Sumber: Laporan BPHN 2023, Indeks Pembangunan Hukum Indonesia.

---

## 1.1.2 Solusi yang Ditawarkan

LegalAid AI hadir sebagai aplikasi web berbasis AI yang berfungsi sebagai titik masuk pertama (**first point of contact**) bagi masyarakat yang membutuhkan panduan hukum dasar — sebelum mereka memutuskan untuk berkonsultasi ke LBH atau pengacara.

Sistem **tidak bertujuan menggantikan pengacara**, melainkan meningkatkan literasi hukum masyarakat.

---

## 1.2 Tujuan Produk

| No. | Tujuan | Indikator Keberhasilan |
|---|---|---|
| T-001 | Memberikan akses informasi hukum dasar secara gratis melalui platform digital berbasis AI | 100% fitur Must Have terimplementasi dan berjalan tanpa error |
| T-002 | Membantu masyarakat memahami hak-hak hukum dalam bahasa yang mudah dimengerti | Skor readability jawaban AI rata-rata berada di level SMP–SMA (Flesch Reading Ease > 60) |
| T-003 | Menyediakan disclaimer dan batas tanggung jawab sistem yang jelas | Disclaimer tampil pada setiap sesi dan setiap jawaban AI yang mengandung saran spesifik |
| T-004 | Mengarahkan pengguna ke LBH atau pengacara pro-bono saat kasus melebihi kemampuan AI | AI merekomendasikan LBH pada ≥ 90% kasus yang dikategorikan "kompleks" dalam sampel evaluasi |

---

## 1.3 Target Pengguna & Persona

| Persona | Deskripsi | Pain Point | Kebutuhan Utama |
|---|---|---|---|
| Pekerja Formal | Usia 22–45 thn, karyawan swasta atau buruh pabrik | Tidak tahu hak saat di-PHK, upah tidak dibayar, atau kontrak kerja merugikan | Panduan hukum ketenagakerjaan yang akurat dan mudah dipahami |
| Konsumen Awam | Usia 18–50 thn, pengguna e-commerce atau jasa | Tertipu, terima produk cacat, tidak tahu cara komplain secara legal | Informasi hak konsumen dan langkah-langkah pelaporan ke BPSK |
| Kepala Keluarga | Usia 30–60 thn, menghadapi masalah keluarga | Menghadapi perceraian, sengketa warisan, atau KDRT tanpa panduan prosedural | Penjelasan prosedur hukum keluarga yang sederhana dan tidak menghakimi |
| Pelaku UMKM | Usia 25–55 thn, pemilik usaha kecil | Konflik kontrak bisnis, sengketa dengan mitra, atau masalah perizinan usaha | Pemahaman hukum bisnis dasar dan opsi penyelesaian sengketa |

---

## 1.4 Fitur & Scope

### 1.4.1 Fitur Utama (Must Have — Versi 2.0)

| No | Kode | Fitur | Deskripsi | Status |
|---|---|---|---|---|
| 1 | F-001 | Pemilihan Kategori Hukum | 6 kategori: Ketenagakerjaan, Konsumen, Keluarga, Pertanahan, Pidana, Utang & Kredit | ✅ Implemented |
| 2 | F-002 | Chat Konsultasi AI | Dialog interaktif menggunakan Groq API (Llama 3.3 70B) dengan system prompt berbasis kategori | ✅ Implemented |
| 3 | F-003 | Konteks Kategori Otomatis | System prompt disesuaikan secara dinamis berdasarkan kategori yang dipilih pengguna | ✅ Implemented |
| 4 | F-004 | Riwayat Percakapan | Penyimpanan riwayat chat di localStorage (guest) dan MySQL (user terdaftar) | ✅ Implemented |
| 5 | F-005 | Disclaimer Hukum Otomatis | Pemberitahuan bahwa aplikasi bukan pengganti pengacara — tampil di awal sesi | ✅ Implemented |
| 6 | F-006 | Responsif Mobile | Tampilan optimal di semua ukuran layar dengan breakpoint Tailwind CSS | ✅ Implemented |
| 7 | F-011 | Autentikasi Pengguna | Registrasi dan login dengan JWT, password hashing bcryptjs | ✅ Implemented |
| 8 | F-012 | Simpan Sesi ke Server | Chat otomatis tersimpan ke MySQL saat user login | ✅ Implemented |
| 9 | F-013 | Riwayat Berbasis Server | Melihat semua riwayat konsultasi dari database | ✅ Implemented |
| 10 | F-014 | Dashboard Admin | Statistik pengguna, sesi, pesan, distribusi kategori | ✅ Implemented |
| 11 | F-015 | Manajemen Pengguna (Admin) | Melihat daftar, detail, dan menghapus pengguna | ✅ Implemented |
| 12 | F-016 | Manajemen Sesi (Admin) | Melihat semua sesi konsultasi dan pesan di dalamnya | ✅ Implemented |
| 13 | F-017 | Manajemen Kategori (Admin) | CRUD kategori hukum dengan toggle aktif/nonaktif | ✅ Implemented |
| 14 | F-018 | Manajemen FAQ (Admin) | CRUD FAQ untuk pertanyaan umum | ✅ Implemented |

### 1.4.2 Fitur Tambahan (Should Have)

| No | Kode | Fitur | Deskripsi | Status |
|---|---|---|---|---|
| 1 | F-007 | Salin Teks Jawaban | Tombol copy pada setiap bubble jawaban AI | ✅ Implemented |
| 2 | F-008 | Reset Percakapan | Tombol mulai percakapan baru tanpa reload halaman | ✅ Implemented |
| 3 | F-009 | Hapus Riwayat | Pengguna dapat menghapus riwayat chat | ✅ Implemented |
| 4 | F-010 | Contoh Pertanyaan | Chips pertanyaan contoh untuk onboarding pengguna baru | ✅ Implemented |

### 1.4.3 Out of Scope (Tidak Dikembangkan)

| Fitur | Alasan | Target Versi |
|---|---|---|
| Integrasi pembayaran atau berlangganan | Aplikasi dirancang sebagai layanan gratis | v3.0 |
| Layanan video call dengan pengacara | Membutuhkan infrastruktur WebRTC yang kompleks | v3.0+ |
| Pembuatan dokumen hukum otomatis | Membutuhkan validasi hukum dari ahli | v3.0+ |
| Integrasi real-time database hukum resmi (JDIH) | API JDIH belum tersedia dalam format yang mudah diintegrasikan | v3.0+ |

---

## 1.5 User Stories

| ID | Sebagai... | Saya ingin... | Agar... | Status |
|---|---|---|---|---|
| US-001 | Pengguna awam | Memilih kategori hukum yang relevan sebelum mulai bertanya | AI memahami konteks masalah saya | ✅ |
| US-002 | Pekerja yang di-PHK | Bertanya tentang hak pesangon dan prosedur klaim | Saya tahu langkah apa yang harus dilakukan | ✅ |
| US-003 | Korban penipuan online | Mengetahui dasar hukum dan langkah pelaporan | Saya dapat melaporkan kasus dengan prosedur yang benar | ✅ |
| US-004 | Pengguna terdaftar | Melihat riwayat percakapan lama dari mana saja | Saya tidak perlu mengulangi pertanyaan yang sama | ✅ |
| US-005 | Pengguna dengan masalah kompleks | Mendapat rekomendasi LBH atau pengacara pro-bono | Saya dapat melanjutkan ke bantuan hukum profesional | ✅ |
| US-006 | Admin | Memantau statistik penggunaan sistem | Saya dapat mengambil keputusan berbasis data | ✅ |
| US-007 | Admin | Mengelola pengguna dan sesi konsultasi | Saya dapat menjaga kualitas layanan | ✅ |

---

## 1.6 Success Metrics

| Metrik | Target | Definisi Operasional | Cara Pengukuran |
|---|---|---|---|
| Response Time AI | < 5 detik | Waktu antara pengguna menekan tombol kirim hingga karakter pertama jawaban AI muncul | Log timestamp di backend |
| Akurasi Konteks Hukum | > 80% | Jawaban relevan dengan kategori, menyertakan referensi regulasi, tidak bertentangan dengan regulasi | Evaluasi manual 30 pertanyaan per kategori |
| Mobile Usability Score | > 85/100 | Skor Lighthouse Performance + Accessibility + Best Practices | Google Lighthouse Audit |
| Error Rate API | < 5% | Persentase request ke `/api/chat` yang mengembalikan HTTP >= 400 atau timeout | Log error Express.js |
| Kelengkapan Fitur | 100% Must Have | Semua fitur F-001 hingga F-018 berfungsi sesuai definisi | Checklist pengujian manual |

---

## 1.7 Deployment & Infrastructure

| Komponen | Teknologi | URL |
|---|---|---|
| Backend + MySQL | Railway | `https://legalaid-api.railway.app` |
| Frontend | Static files served by Express (dist dari GitHub Actions) | `https://legalaid-api.railway.app` |
| Database | MySQL (Railway managed) | Internal Railway network |
| AI Engine | Groq API (Llama 3.3 70B Versatile) | `https://api.groq.com` |
| CI/CD | GitHub Actions | Build frontend → copy to backend/public/dist/ → auto-commit |

---

*LegalAid AI — SDD v2.0 | STMIK Lombok 2026 | Sucianti — SI20230032 & Wulandari — SI20230035*

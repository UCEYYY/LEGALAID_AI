# BAB 1 — Product Requirement Document (PRD)

**LegalAid AI — Konsultasi Hukum Digital untuk Masyarakat Indonesia**

---

## 1.1 Overview Produk

| Field | Detail |
|---|---|
| Nama Aplikasi | LegalAid AI |
| Tagline | Konsultasi Hukum Gratis untuk Semua Orang |
| Versi | 1.0.0 |
| Platform | Web Application (Responsive, PWA) |
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

### 1.4.1 Fitur Utama (Must Have — Versi 1.0)

| No | Kode | Fitur | Deskripsi | Prioritas |
|---|---|---|---|---|
| 1 | F-001 | Pemilihan Kategori Hukum | 6 kategori: Ketenagakerjaan, Konsumen, Keluarga, Pertanahan, Pidana, Utang & Kredit | Must Have |
| 2 | F-002 | Chat Konsultasi AI | Dialog interaktif menggunakan Google Gemini API dengan system prompt berbasis kategori | Must Have |
| 3 | F-003 | Konteks Kategori Otomatis | System prompt disesuaikan secara dinamis berdasarkan kategori yang dipilih pengguna | Must Have |
| 4 | F-004 | Riwayat Percakapan | Penyimpanan otomatis riwayat chat di localStorage browser | Must Have |
| 5 | F-005 | Disclaimer Hukum Otomatis | Pemberitahuan bahwa aplikasi bukan pengganti pengacara — tampil di awal sesi dan pada jawaban yang mengandung saran spesifik | Must Have |
| 6 | F-006 | Responsif Mobile | Tampilan optimal di semua ukuran layar dengan breakpoint Tailwind CSS | Must Have |

### 1.4.2 Fitur Tambahan (Should Have)

| No | Kode | Fitur | Deskripsi | Prioritas |
|---|---|---|---|---|
| 1 | F-007 | Salin Teks Jawaban | Tombol copy pada setiap bubble jawaban AI | Should Have |
| 2 | F-008 | Reset Percakapan | Tombol mulai percakapan baru tanpa reload halaman | Should Have |
| 3 | F-009 | Hapus Riwayat | Pengguna dapat menghapus semua riwayat chat tersimpan di browser | Should Have |
| 4 | F-010 | Contoh Pertanyaan | Chips pertanyaan contoh untuk memandu pengguna pertama kali (onboarding) | Nice to Have |

### 1.4.3 Out of Scope (Tidak Dikembangkan di Versi 1.0)

Fitur berikut secara eksplisit tidak termasuk dalam scope versi 1.0 dan akan dipertimbangkan untuk versi selanjutnya:

| Fitur | Alasan Tidak Dimasukkan | Target Versi |
|---|---|---|
| Autentikasi / login pengguna | Menambah kompleksitas di luar scope mata kuliah Front-End; privasi terjaga dengan localStorage | v2.0 |
| Integrasi pembayaran atau berlangganan | Aplikasi dirancang sebagai layanan gratis; monetisasi bukan tujuan proyek ini | v3.0 |
| Layanan video call dengan pengacara | Membutuhkan infrastruktur WebRTC dan matching system yang kompleks | v3.0+ |
| Pembuatan dokumen hukum otomatis | Membutuhkan validasi hukum dari ahli; risiko tinggi jika salah | v3.0+ |
| Dashboard Admin & statistik server | Tidak ada server-side storage di v1.0; admin hanya relevan setelah database diterapkan | v2.0 |
| Integrasi real-time database hukum resmi | API hukum Indonesia (JDIH) belum tersedia dalam format yang dapat diintegrasikan secara mudah | v2.0+ |

---

## 1.5 User Stories

| ID | Sebagai... | Saya ingin... | Agar... |
|---|---|---|---|
| US-001 | Pengguna awam | Memilih kategori hukum yang relevan sebelum mulai bertanya | AI memahami konteks masalah saya dan memberikan jawaban yang tepat sasaran |
| US-002 | Pekerja yang di-PHK | Bertanya tentang hak pesangon dan prosedur klaim | Saya tahu berapa yang seharusnya saya terima dan langkah apa yang harus dilakukan |
| US-003 | Korban penipuan online | Mengetahui dasar hukum dan langkah pelaporan ke Bareskrim atau BPSK | Saya dapat melaporkan kasus dengan prosedur yang benar |
| US-004 | Pengguna yang pernah berkonsultasi | Melihat riwayat percakapan lama di browser saya | Saya tidak perlu mengulangi pertanyaan yang sama |
| US-005 | Pengguna dengan masalah kompleks | Mendapat rekomendasi LBH atau pengacara pro-bono terdekat | Saya dapat melanjutkan ke bantuan hukum profesional |

---

## 1.6 Success Metrics

| Metrik | Target | Definisi Operasional | Cara Pengukuran |
|---|---|---|---|
| Response Time AI | < 5 detik | Waktu antara pengguna menekan tombol kirim hingga karakter pertama jawaban AI muncul di layar (Time-to-First-Token) | `performance.now()` di frontend, log timestamp di backend |
| Akurasi Konteks Hukum | > 80% | Jawaban AI dianggap 'akurat konteks' jika: (a) relevan dengan kategori hukum yang dipilih, (b) menyertakan setidaknya satu referensi regulasi, dan (c) tidak bertentangan secara nyata dengan regulasi yang berlaku. Dinilai oleh 2 reviewer | Evaluasi manual 30 pertanyaan per kategori (total 180 sampel) |
| Mobile Usability Score | > 85/100 | Skor Lighthouse kategori Performance + Accessibility + Best Practices di perangkat mobile simulasi | Google Lighthouse Audit (Chrome DevTools) |
| Error Rate API | < 5% | Persentase request ke `/api/chat` yang mengembalikan HTTP status >= 400 atau timeout | Log error Express.js, dihitung dari total request dalam sesi pengujian |
| Kelengkapan Fitur | 100% Must Have | Semua 6 fitur F-001 hingga F-006 berfungsi sesuai definisi dalam User Stories | Checklist pengujian manual terhadap setiap acceptance criteria |

> **Catatan revisi:** Target akurasi diturunkan dari >85% menjadi >80% karena ukuran sampel evaluasi yang lebih besar (180 vs 50 pertanyaan sebelumnya) memberikan estimasi yang lebih konservatif namun valid secara metodologis. Definisi 'akurasi' kini dijelaskan secara operasional.

---

*LegalAid AI — SDD v1.0 | STMIK Lombok 2026 | Sucianti — SI20230032 & Wulandari — SI20230035*

# BAB 8 — Use Case Diagram

**LegalAid AI — Konsultasi Hukum Digital untuk Masyarakat Indonesia**

---

## 8.1 Use Case Diagram (Mermaid)

```mermaid
useCaseDiagram
    actor "Pengguna\n(Guest)" as Guest
    actor "Pengguna\nTerdaftar" as User
    actor "Admin" as Admin
    actor "Groq API\n(LLM)" as Groq
    actor "MySQL\nDatabase" as DB

    package "LegalAid AI System" {
        usecase "Memilih Kategori Hukum" as UC1
        usecase "Konsultasi AI\n(Chat)" as UC2
        usecase "Menampilkan Disclaimer Hukum" as UC3
        usecase "Salin Teks Jawaban" as UC4
        usecase "Reset Percakapan" as UC5
        usecase "Melihat Contoh Pertanyaan" as UC6

        usecase "Menyimpan Riwayat\nke Browser (localStorage)" as UC7
        usecase "Melihat Riwayat\nLokal" as UC8
        usecase "Menghapus Riwayat\nLokal" as UC9

        usecase "Registrasi Akun" as UC10
        usecase "Login Pengguna" as UC11

        usecase "Menyimpan Sesi\nke Server (MySQL)" as UC12
        usecase "Melihat Riwayat\ndari Server" as UC13
        usecase "Menghapus Riwayat\ndari Server" as UC14

        usecase "Login Admin" as UC15
        usecase "Melihat Dashboard\nStatistik" as UC16
        usecase "Mengelola Pengguna\n(Lihat & Hapus)" as UC17
        usecase "Mengelola Sesi\nKonsultasi" as UC18
        usecase "Mengelola Kategori\nHukum (CRUD)" as UC19
        usecase "Mengelola FAQ\n(CRUD)" as UC20
    }

    Guest --> UC1
    Guest --> UC2
    Guest --> UC3
    Guest --> UC4
    Guest --> UC5
    Guest --> UC6
    Guest --> UC7
    Guest --> UC8
    Guest --> UC9
    Guest --> UC10
    Guest --> UC11

    User --|> Guest : <<extend>>

    User --> UC12
    User --> UC13
    User --> UC14

    Admin --> UC15
    Admin --> UC16
    Admin --> UC17
    Admin --> UC18
    Admin --> UC19
    Admin --> UC20

    UC2 ..> Groq : <<include>>
    UC12 ..> DB : <<include>>
    UC13 ..> DB : <<include>>
    UC14 ..> DB : <<include>>
    UC16 ..> DB : <<include>>
    UC17 ..> DB : <<include>>
    UC18 ..> DB : <<include>>
    UC19 ..> DB : <<include>>
    UC20 ..> DB : <<include>>
```

---

## 8.2 Daftar Aktor

| Aktor | Tipe | Deskripsi |
|---|---|---|
| Pengguna (Guest) | Primer | Pengguna yang belum login. Dapat mengakses konsultasi AI tanpa registrasi. Riwayat tersimpan di localStorage browser. |
| Pengguna Terdaftar | Primer | Pengguna yang telah melakukan registrasi dan login. Memiliki semua kemampuan Guest ditambah penyimpanan riwayat ke server. |
| Admin | Sekunder | Pengelola sistem. Memiliki akses ke dashboard statistik dan seluruh modul manajemen (pengguna, sesi, kategori, FAQ). |
| Groq API (LLM) | Eksternal | Layanan AI berbasis Groq (Llama 3.3 70B) yang memproses prompt hukum dan menghasilkan jawaban. |
| MySQL Database | Eksternal | Database relasional (Railway) yang menyimpan data pengguna, sesi, pesan, kategori, dan FAQ secara persisten. |

---

## 8.3 Deskripsi Use Case

### UC-001: Memilih Kategori Hukum

| Field | Deskripsi |
|---|---|
| **ID** | UC-001 |
| **Nama** | Memilih Kategori Hukum |
| **Actor** | Guest, User |
| **Prekondisi** | Pengguna membuka halaman utama aplikasi |
| **Postkondisi** | Kategori hukum dipilih, konteks chat disesuaikan |
| **Alur** | 1. Pengguna melihat 6 kartu kategori di halaman utama. 2. Pengguna memilih salah satu kategori (Ketenagakerjaan, Konsumen, Keluarga, Pertanahan, Pidana, Utang & Kredit). 3. Sistem menyesuaikan system prompt berdasarkan kategori. 4. Pengguna diarahkan ke halaman chat. |

### UC-002: Konsultasi AI (Chat)

| Field | Deskripsi |
|---|---|
| **ID** | UC-002 |
| **Nama** | Konsultasi AI (Chat) |
| **Actor** | Guest, User |
| **Include** | UC-001 (wajib memilih kategori terlebih dahulu) |
| **Include** | Mengirim pesan ke Groq API |
| **Prekondisi** | Kategori hukum sudah dipilih |
| **Postkondisi** | Pengguna menerima jawaban AI dalam Bahasa Indonesia |
| **Alur** | 1. Pengguna mengetik pertanyaan di chat input. 2. Sistem mengirim request ke `POST /api/chat` beserta category, messages, dan userMessage. 3. Backend meneruskan prompt ke Groq API (Llama 3.3 70B). 4. Groq API mengembalikan respons teks. 5. Backend mengembalikan JSON response ke frontend. 6. Jawaban AI ditampilkan dalam chat bubble. 7. Pesan disimpan otomatis ke riwayat. |

### UC-003: Menampilkan Disclaimer Hukum

| Field | Deskripsi |
|---|---|
| **ID** | UC-003 |
| **Nama** | Menampilkan Disclaimer Hukum |
| **Actor** | Guest, User |
| **Prekondisi** | Pengguna membuka sesi chat baru |
| **Postkondisi** | Pengguna menyadari bahwa AI bukan pengganti pengacara |
| **Alur** | 1. Sistem menampilkan banner disclaimer di awal sesi chat. 2. Disclaimer menjelaskan bahwa aplikasi bersifat edukatif dan bukan pengganti konsultasi hukum profesional. 3. Pengguna dapat menutup disclaimer. |

### UC-004: Salin Teks Jawaban

| Field | Deskripsi |
|---|---|
| **ID** | UC-004 |
| **Nama** | Salin Teks Jawaban |
| **Actor** | Guest, User |
| **Prekondisi** | AI telah menghasilkan jawaban |
| **Postkondisi** | Teks jawaban tersalin ke clipboard |
| **Alur** | 1. Pengguna menekan tombol copy pada bubble jawaban AI. 2. Sistem menyalin teks ke clipboard browser. 3. Muncul notifikasi bahwa teks berhasil disalin. |

### UC-005: Reset Percakapan

| Field | Deskripsi |
|---|---|
| **ID** | UC-005 |
| **Nama** | Reset Percakapan |
| **Actor** | Guest, User |
| **Prekondisi** | Sesi chat sedang aktif |
| **Postkondisi** | Percakapan di-reset, pengguna memulai sesi baru |
| **Alur** | 1. Pengguna menekan tombol "Mulai Percakapan Baru". 2. Sistem mengosongkan array messages. 3. Pengguna dapat memilih kategori baru dan memulai chat baru. |

### UC-006: Melihat Contoh Pertanyaan

| Field | Deskripsi |
|---|---|
| **ID** | UC-006 |
| **Nama** | Melihat Contoh Pertanyaan |
| **Actor** | Guest, User |
| **Prekondisi** | Pengguna baru membuka chat |
| **Postkondisi** | Pengguna terinspirasi untuk mengajukan pertanyaan |
| **Alur** | 1. Sistem menampilkan chips pertanyaan contoh saat sesi kosong. 2. Pengguna dapat mengklik salah satu contoh pertanyaan. 3. Pertanyaan otomatis masuk ke input chat. |

### UC-007: Menyimpan Riwayat ke Browser (localStorage)

| Field | Deskripsi |
|---|---|
| **ID** | UC-007 |
| **Nama** | Menyimpan Riwayat ke Browser |
| **Actor** | Guest |
| **Prekondisi** | Pengguna mengirim pesan dalam sesi chat |
| **Postkondisi** | Riwayat percakapan tersimpan di localStorage |
| **Alur** | 1. Setelah pesan terkirim dan jawaban diterima, sistem otomatis menyimpan sesi. 2. Data tersimpan di localStorage dengan key sesuai kategori. 3. Riwayat dapat diakses kembali saat pengguna membuka halaman riwayat. |

### UC-008: Melihat Riwayat Lokal

| Field | Deskripsi |
|---|---|
| **ID** | UC-008 |
| **Nama** | Melihat Riwayat Lokal |
| **Actor** | Guest |
| **Prekondisi** | Terdapat riwayat percakapan di localStorage |
| **Postkondisi** | Pengguna melihat daftar sesi konsultasi sebelumnya |
| **Alur** | 1. Pengguna mengakses halaman riwayat. 2. Sistem membaca data dari localStorage. 3. Menampilkan daftar sesi yang tersimpan (judul, kategori, waktu). 4. Pengguna dapat memilih sesi untuk melihat detail percakapan. |

### UC-009: Menghapus Riwayat Lokal

| Field | Deskripsi |
|---|---|
| **ID** | UC-009 |
| **Nama** | Menghapus Riwayat Lokal |
| **Actor** | Guest |
| **Prekondisi** | Terdapat riwayat percakapan di localStorage |
| **Postkondisi** | Riwayat terpilih terhapus dari localStorage |
| **Alur** | 1. Pengguna menekan tombol hapus pada sesi tertentu. 2. Sistem menghapus data sesi dari localStorage. 3. Daftar riwayat diperbarui. |

### UC-010: Registrasi Akun

| Field | Deskripsi |
|---|---|
| **ID** | UC-010 |
| **Nama** | Registrasi Akun |
| **Actor** | Guest |
| **Prekondisi** | Pengguna belum memiliki akun |
| **Postkondisi** | Akun baru dibuat, pengguna otomatis login |
| **Alur** | 1. Pengguna mengakses halaman registrasi (`/register`). 2. Mengisi form: nama, email, password, konfirmasi password. 3. Frontend mengirim ke `POST /api/auth/register`. 4. Backend memvalidasi input, mengecek email unik, hash password. 5. User baru diinsert ke MySQL. 6. JWT token dikembalikan. 7. Token disimpan di localStorage, pengguna diarahkan ke chat. |

### UC-011: Login Pengguna

| Field | Deskripsi |
|---|---|
| **ID** | UC-011 |
| **Nama** | Login Pengguna |
| **Actor** | Guest |
| **Prekondisi** | Pengguna memiliki akun terdaftar |
| **Postkondisi** | Pengguna terautentikasi, sesi chat tersimpan ke server |
| **Alur** | 1. Pengguna mengakses halaman login (`/login`). 2. Mengisi email dan password. 3. Frontend mengirim ke `POST /api/auth/login`. 4. Backend memverifikasi kredensial dengan bcrypt. 5. JWT token dikembalikan. 6. Token disimpan di localStorage. 7. Pengguna diarahkan ke halaman chat. |

### UC-012: Menyimpan Sesi ke Server (MySQL)

| Field | Deskripsi |
|---|---|
| **ID** | UC-012 |
| **Nama** | Menyimpan Sesi ke Server |
| **Actor** | User |
| **Include** | Komunikasi dengan MySQL Database |
| **Prekondisi** | Pengguna terdaftar sedang dalam sesi chat |
| **Postkondisi** | Sesi konsultasi tersimpan di MySQL |
| **Alur** | 1. Saat pengguna terdaftar mengirim pesan, backend memeriksa token JWT. 2. Jika valid, backend membuat atau memperbarui sesi di MySQL. 3. Pesan user dan assistant disimpan ke tabel `chat_messages`. 4. Sesi dapat diakses dari multiple device. |

### UC-013: Melihat Riwayat dari Server

| Field | Deskripsi |
|---|---|
| **ID** | UC-013 |
| **Nama** | Melihat Riwayat dari Server |
| **Actor** | User |
| **Include** | Komunikasi dengan MySQL Database |
| **Prekondisi** | Pengguna terdaftar memiliki sesi tersimpan di MySQL |
| **Postkondisi** | Pengguna melihat daftar sesi konsultasi dari server |
| **Alur** | 1. Pengguna mengakses halaman riwayat (`/history`). 2. Frontend mengirim `GET /api/sessions` dengan JWT. 3. Backend mengambil data sesi dari MySQL. 4. Menampilkan daftar sesi dengan judul, kategori, dan waktu. 5. Pengguna dapat memilih sesi untuk melihat detail percakapan. |

### UC-014: Menghapus Riwayat dari Server

| Field | Deskripsi |
|---|---|
| **ID** | UC-014 |
| **Nama** | Menghapus Riwayat dari Server |
| **Actor** | User |
| **Include** | Komunikasi dengan MySQL Database |
| **Prekondisi** | Pengguna terdaftar memiliki sesi tersimpan di MySQL |
| **Postkondisi** | Sesi dan pesan terkait terhapus dari MySQL (CASCADE) |
| **Alur** | 1. Pengguna menekan tombol hapus pada sesi tertentu. 2. Frontend mengirim `DELETE /api/sessions/:id` dengan JWT. 3. Backend menghapus sesi dan semua pesan terkait dari MySQL. 4. Daftar riwayat diperbarui. |

### UC-015: Login Admin

| Field | Deskripsi |
|---|---|
| **ID** | UC-015 |
| **Nama** | Login Admin |
| **Actor** | Admin |
| **Prekondisi** | Admin memiliki akun admin |
| **Postkondisi** | Admin terautentikasi dengan role admin |
| **Alur** | 1. Admin mengakses halaman login khusus (`/admin/login`). 2. Mengisi email dan password. 3. Frontend mengirim ke `POST /api/admin/login`. 4. Backend memverifikasi kredensial + memastikan role === 'admin'. 5. JWT token dengan role admin dikembalikan. 6. Admin diarahkan ke dashboard (`/admin/dashboard`). |

### UC-016: Melihat Dashboard Statistik

| Field | Deskripsi |
|---|---|
| **ID** | UC-016 |
| **Nama** | Melihat Dashboard Statistik |
| **Actor** | Admin |
| **Include** | Komunikasi dengan MySQL Database |
| **Prekondisi** | Admin telah login |
| **Postkondisi** | Admin melihat ringkasan statistik sistem |
| **Alur** | 1. Admin mengakses dashboard (`/admin/dashboard`). 2. Frontend mengirim `GET /api/admin/stats`. 3. Backend mengambil data dari MySQL: total pengguna, total sesi, total pesan, distribusi kategori, 5 pengguna terbaru. 4. Statistik ditampilkan dalam bentuk kartu dan grafik. |

### UC-017: Mengelola Pengguna (Lihat & Hapus)

| Field | Deskripsi |
|---|---|
| **ID** | UC-017 |
| **Nama** | Mengelola Pengguna |
| **Actor** | Admin |
| **Include** | Komunikasi dengan MySQL Database |
| **Prekondisi** | Admin telah login |
| **Postkondisi** | Data pengguna dikelola (dilihat/dihapus) |
| **Alur** | 1. Admin mengakses halaman manajemen pengguna (`/admin/users`). 2. Frontend mengirim `GET /api/admin/users` dengan paginasi dan pencarian. 3. Backend mengambil daftar pengguna dari MySQL. 4. Admin dapat melihat detail pengguna (`/admin/users/:id`). 5. Admin dapat menghapus pengguna → `DELETE /api/admin/users/:id`. 6. Pengguna dan semua sesi/pesan terkait terhapus (CASCADE). |

### UC-018: Mengelola Sesi Konsultasi

| Field | Deskripsi |
|---|---|
| **ID** | UC-018 |
| **Nama** | Mengelola Sesi Konsultasi |
| **Actor** | Admin |
| **Include** | Komunikasi dengan MySQL Database |
| **Prekondisi** | Admin telah login |
| **Postkondisi** | Admin memantau sesi konsultasi pengguna |
| **Alur** | 1. Admin mengakses halaman manajemen sesi (`/admin/sessions`). 2. Frontend mengirim `GET /api/admin/sessions` dengan paginasi. 3. Backend mengambil semua sesi dari semua pengguna. 4. Admin dapat melihat detail sesi beserta semua pesan (`/admin/sessions/:id`). |

### UC-019: Mengelola Kategori Hukum (CRUD)

| Field | Deskripsi |
|---|---|
| **ID** | UC-019 |
| **Nama** | Mengelola Kategori Hukum |
| **Actor** | Admin |
| **Include** | Komunikasi dengan MySQL Database |
| **Prekondisi** | Admin telah login |
| **Postkondisi** | Data kategori hukum diperbarui |
| **Alur** | 1. Admin mengakses halaman manajemen kategori (`/admin/categories`). 2. Melihat daftar kategori: `GET /api/admin/categories`. 3. Membuat kategori baru: `POST /api/admin/categories`. 4. Memperbarui kategori: `PATCH /api/admin/categories/:id` (termasuk toggle aktif/nonaktif). 5. Menghapus kategori: `DELETE /api/admin/categories/:id`. |

### UC-020: Mengelola FAQ (CRUD)

| Field | Deskripsi |
|---|---|
| **ID** | UC-020 |
| **Nama** | Mengelola FAQ |
| **Actor** | Admin |
| **Include** | Komunikasi dengan MySQL Database |
| **Prekondisi** | Admin telah login |
| **Postkondisi** | Data FAQ diperbarui |
| **Alur** | 1. Admin mengakses halaman manajemen FAQ (`/admin/faq`). 2. Melihat daftar FAQ: `GET /api/admin/faq`. 3. Membuat FAQ baru: `POST /api/admin/faq`. 4. Memperbarui FAQ: `PATCH /api/admin/faq/:id`. 5. Menghapus FAQ: `DELETE /api/admin/faq/:id`. |

---

## 8.4 Relasi Antar Use Case

| Relasi | Dari | Ke | Tipe | Keterangan |
|---|---|---|---|---|
| 1 | Konsultasi AI (UC-002) | Memilih Kategori (UC-001) | `<<include>>` | Konsultasi AI selalu memerlukan pemilihan kategori terlebih dahulu |
| 2 | Konsultasi AI (UC-002) | Groq API | `<<include>>` | Setiap konsultasi melibatkan pemrosesan prompt ke Groq API |
| 3 | Menyimpan Sesi ke Server (UC-012) | MySQL Database | `<<include>>` | Penyimpanan sesi memerlukan akses database |
| 4 | Melihat Riwayat Server (UC-013) | MySQL Database | `<<include>>` | Pengambilan data riwayat dari database |
| 5 | Menghapus Riwayat Server (UC-014) | MySQL Database | `<<include>>` | Penghapusan data dari database |
| 6 | Pengguna Terdaftar | Pengguna (Guest) | `<<extend>>` | Pengguna Terdaftar mewarisi semua fitur Guest |
| 7 | Registrasi (UC-010) | Login Pengguna (UC-011) | `<<extend>>` | Setelah registrasi, pengguna otomatis login |
| 8 | Melihat Dashboard (UC-016) | MySQL Database | `<<include>>` | Statistik diambil dari database |
| 9 | Mengelola Pengguna (UC-017) | MySQL Database | `<<include>>` | CRUD pengguna di database |
| 10 | Mengelola Kategori (UC-019) | MySQL Database | `<<include>>` | CRUD kategori di database |
| 11 | Mengelola FAQ (UC-020) | MySQL Database | `<<include>>` | CRUD FAQ di database |

---

## 8.5 Batasan Use Case

| Kode | Batasan | Use Case Terdampak |
|---|---|---|
| B-UC-001 | Guest tidak memiliki backup data di server; riwayat hilang jika cache browser dibersihkan | UC-007, UC-008, UC-009 |
| B-UC-002 | Chat hanya mendukung 6 kategori hukum yang didefinisikan | UC-001, UC-002 |
| B-UC-003 | Maksimal 20 item riwayat percakapan dalam satu sesi chat | UC-002 |
| B-UC-004 | Maksimal 2000 karakter per pesan | UC-002 |
| B-UC-005 | Rate limiting: maksimal 20 request per menit per IP untuk chat | UC-002 |
| B-UC-006 | Kualitas jawaban bergantung pada Groq API (Llama 3.3 70B) | UC-002 |

---

*LegalAid AI — SDD v2.0 | STMIK Lombok 2026 | Sucianti — SI20230032 & Wulandari — SI20230035*

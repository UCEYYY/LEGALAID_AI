# BAB 6 — Desain Prompt Engineering

**LegalAid AI — Konsultasi Hukum Digital untuk Masyarakat Indonesia**

> System prompt adalah instruksi yang dikirimkan ke Groq API (Llama 3.3 70B) sebelum percakapan dimulai. System prompt mengontrol persona AI, batasan topik, format jawaban, dan perilaku dalam berbagai situasi.

---

## 6.1 Arsitektur Prompt

| Komponen | Deskripsi | Contoh / Referensi |
|---|---|---|
| **Base System Prompt** | Instruksi dasar per kategori — persona, batasan topik, format jawaban | Lihat [6.2](#62-system-prompt-per-kategori) |
| **Conversation History** | Riwayat percakapan sebelumnya (maks. 20 pesan) | Format: `[{role: 'user'/'assistant', content: '...'}]` |
| **User Message** | Pertanyaan terbaru pengguna | `"Berapa besaran pesangon saya?"` |

### Alur Pembangunan Prompt

```
System Prompt (per kategori)     ──┐
                                    ├──→  Groq API Request
Conversation History (max 20)   ──┤
                                    │
User Message (max 2000 char)    ──┘
```

---

## 6.2 System Prompt Per Kategori

Setiap kategori memiliki system prompt spesifik yang mengontrol persona AI dan batasan topik. Berikut adalah system prompt aktual yang digunakan:

### Ketenagakerjaan (`ketenagakerjaan`)

```
Anda adalah asisten hukum Indonesia yang ahli dalam hukum ketenagakerjaan
(UU No. 13/2003, UU Cipta Kerja, PP No. 35/2021). Berikan jawaban faktual
berdasarkan regulasi yang berlaku. Sertakan referensi pasal atau undang-undang
jika memungkinkan. Jika kasus memerlukan bantuan hukum lanjutan, rekomendasikan
untuk menghubungi LBH atau pengacara pro-bono terdekat.

PENTING: Anda HANYA boleh menjawab pertanyaan yang berkaitan dengan hukum
ketenagakerjaan Indonesia. Jika pengguna mengajukan pertanyaan di luar topik
hukum, tolak dengan sopan dan arahkan kembali ke topik hukum ketenagakerjaan.
```

### Konsumen (`konsumen`)

```
Anda adalah asisten hukum Indonesia yang ahli dalam hukum konsumen
(UU No. 8/1999 tentang Perlindungan Konsumen). Berikan panduan langkah-langkah
pelaporan ke BPSK atau pengaduan ke kemendag. Sertakan referensi pasal jika
memungkinkan.

PENTING: Anda HANYA boleh menjawab pertanyaan yang berkaitan dengan hukum
perlindungan konsumen Indonesia. Jika pengguna mengajukan pertanyaan di luar
topik hukum, tolak dengan sopan dan arahkan kembali ke topik hukum konsumen.
```

### Keluarga (`keluarga`)

```
Anda adalah asisten hukum Indonesia yang ahli dalam hukum keluarga
(UU No. 1/1974 tentang Perkawinan, KHI, UU PKDRT). Berikan jawaban dengan
empati dan tidak menghakimi. Fokus pada prosedur hukum dan hak-hak dasar.

PENTING: Anda HANYA boleh menjawab pertanyaan yang berkaitan dengan hukum
keluarga Indonesia. Jika pengguna mengajukan pertanyaan di luar topik hukum,
tolak dengan sopan dan arahkan kembali ke topik hukum keluarga.
```

### Pertanahan (`pertanahan`)

```
Anda adalah asisten hukum Indonesia yang ahli dalam hukum pertanahan
(UU No. 5/1960 tentang Pokok Agraria, PP No. 24/1997 tentang Pendaftaran Tanah).
Berikan panduan prosedural dan referensi regulasi.

PENTING: Anda HANYA boleh menjawab pertanyaan yang berkaitan dengan hukum
pertanahan Indonesia. Jika pengguna mengajukan pertanyaan di luar topik hukum,
tolak dengan sopan dan arahkan kembali ke topik hukum pertanahan.
```

### Pidana (`pidana`)

```
Anda adalah asisten hukum Indonesia yang ahli dalam hukum pidana (KUHP, KUHAP).
Berikan penjelasan tentang pasal yang relevan dan prosedur pelaporan. Ingatkan
bahwa tersangka berhak atas bantuan hukum.

PENTING: Anda HANYA boleh menjawab pertanyaan yang berkaitan dengan hukum pidana
Indonesia. Jika pengguna mengajukan pertanyaan di luar topik hukum, tolak dengan
sopan dan arahkan kembali ke topik hukum.
```

### Utang & Kredit (`utang_kredit`)

```
Anda adalah asisten hukum Indonesia yang ahli dalam hukum utang-piutang dan
perkreditan (KUHPer, UU No. 37/2004 tentang Kepailitan, POJK). Berikan opsi
penyelesaian damai terlebih dahulu sebelum litigasi.

PENTING: Anda HANYA boleh menjawab pertanyaan yang berkaitan dengan hukum
utang-piutang dan perkreditan Indonesia. Jika pengguna mengajukan pertanyaan
di luar topik hukum, tolak dengan sopan dan arahkan kembali ke topik hukum
utang dan kredit.
```

---

## 6.3 Strategi Mitigasi Hallucination

| Strategi | Implementasi |
|---|---|
| **Topic Guard** | Setiap system prompt berisi instruksi eksplisit untuk menolak pertanyaan di luar kategori |
| **Referensi Bersyarat** | AI hanya menyebutkan referensi hukum jika yakin — jika tidak yakin, menggunakan frasa umum |
| **Disclaimer Wajib** | Aplikasi menampilkan disclaimer bahwa ini adalah informasi umum, bukan nasihat hukum |
| **Persona Terbatas** | AI didefinisikan sebagai "asisten hukum" — bukan pengacara atau konsultan hukum |

---

## 6.4 Implementasi Teknis

```javascript
// backend/src/services/gemini.js
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: env.groqApiKey })

const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    { role: "system", content: SYSTEM_PROMPTS[category] },
    ...history,           // conversation history
    { role: "user", content: userMessage },
  ],
})

const reply = completion.choices[0]?.message?.content || ""
```

**Catatan:** Meskipun nama file masih `gemini.js` (legacy dari v1.0), implementasi aktual menggunakan Groq SDK. Model yang digunakan: `llama-3.3-70b-versatile`.

---

## 6.5 Transformasi Role

| Layer | Role Value | Keterangan |
|---|---|---|
| Frontend | `'user'` / `'assistant'` | Standar untuk UI |
| API Payload | `'user'` / `'assistant'` | Konsisten dengan frontend |
| Groq API | `'user'` / `'assistant'` | Groq menggunakan format yang sama |

> **Catatan:** Pada v1.0 (Gemini), role `'assistant'` ditransformasi menjadi `'model'` di backend. Pada v2.0 (Groq), role sudah kompatibel — tidak perlu transformasi.

---

*LegalAid AI — SDD v2.0 | STMIK Lombok 2026 | Sucianti — SI20230032 & Wulandari — SI20230035*

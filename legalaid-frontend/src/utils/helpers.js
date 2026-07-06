export function generateId() {
  return crypto.randomUUID()
}

export function formatDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Deteksi kategori otomatis berdasarkan kata kunci dalam teks pertanyaan
export function detectCategory(text) {
  const lower = text.toLowerCase()

  const keywords = {
    ketenagakerjaan: [
      'phk', 'pesangon', 'kerja', 'karyawan', 'pegawai', 'gaji', 'upah', 'kontrak kerja',
      'pkwt', 'pkwtt', 'bpjs ketenagakerjaan', 'buruh', 'pekerja', 'lembur', 'cuti',
      'resign', 'dipecat', 'pemutusan hubungan', 'thr', 'tenaga kerja', 'slip gaji',
      'majikan', 'perusahaan memecat', 'mogok kerja', 'serikat pekerja',
    ],
    konsumen: [
      'konsumen', 'penipuan online', 'barang cacat', 'produk rusak', 'belanja online',
      'marketplace', 'toko online', 'refund', 'pengembalian', 'garansi', 'bpsk',
      'perlindungan konsumen', 'jual beli', 'tipu', 'tidak dikirim', 'tidak sesuai',
      'komplain', 'merchant', 'seller', 'e-commerce',
    ],
    keluarga: [
      'cerai', 'perceraian', 'nikah', 'pernikahan', 'kawin', 'hak asuh', 'anak',
      'kdrt', 'kekerasan rumah tangga', 'warisan', 'waris', 'nafkah', 'talak',
      'gugat cerai', 'poligami', 'perwalian', 'adopsi', 'hibah', 'wasiat',
      'perkawinan', 'suami', 'istri', 'pasangan',
    ],
    pertanahan: [
      'tanah', 'sertifikat', 'shm', 'shgb', 'hgb', 'hak guna', 'sengketa tanah',
      'batas tanah', 'jual beli tanah', 'kavling', 'lahan', 'properti', 'bpn',
      'agraria', 'girik', 'letter c', 'sporadik', 'ukur tanah', 'rumah',
      'perumahan', 'kpr', 'akta jual beli',
    ],
    pidana: [
      'polisi', 'laporan', 'ditangkap', 'tersangka', 'terdakwa', 'penjara',
      'kuhp', 'pidana', 'kejahatan', 'tindak pidana', 'penganiayaan', 'pencurian',
      'penipuan', 'korupsi', 'narkoba', 'pemerkosaan', 'penggelapan', 'fitnah',
      'pencemaran nama', 'ite', 'ujaran kebencian', 'lapor polisi', 'jaksa',
      'hakim', 'sidang', 'vonis', 'ditahan', 'penangkapan',
    ],
    utang_kredit: [
      'utang', 'kredit', 'pinjaman', 'cicilan', 'angsuran', 'penagih', 'debt collector',
      'pailit', 'kepailitan', 'kpr macet', 'kredit macet', 'bunga', 'leasing',
      'pinjol', 'pinjaman online', 'fintech', 'ojk', 'bank', 'kartu kredit',
      'restrukturisasi', 'nunggak', 'gagal bayar',
    ],
  }

  // Hitung skor untuk setiap kategori
  const scores = {}
  for (const [category, words] of Object.entries(keywords)) {
    scores[category] = words.filter(word => lower.includes(word)).length
  }

  // Ambil kategori dengan skor tertinggi
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]

  // Jika tidak ada kata kunci yang cocok, default ke pidana (paling umum)
  return best[1] > 0 ? best[0] : 'pidana'
}

export const CATEGORIES = [
  {
    id: 'ketenagakerjaan',
    label: 'Ketenagakerjaan',
    description: 'PHK, pesangon, kontrak kerja, upah, BPJS Ketenagakerjaan',
    icon: 'briefcase',
  },
  {
    id: 'konsumen',
    label: 'Konsumen',
    description: 'Hak konsumen, produk cacat, penipuan online, BPSK',
    icon: 'shopping-cart',
  },
  {
    id: 'keluarga',
    label: 'Keluarga',
    description: 'Pernikahan, perceraian, hak asuh anak, KDRT, warisan',
    icon: 'users',
  },
  {
    id: 'pertanahan',
    label: 'Pertanahan',
    description: 'Sertifikat tanah, sengketa batas, jual beli tanah',
    icon: 'home',
  },
  {
    id: 'pidana',
    label: 'Pidana',
    description: 'Hak tersangka, prosedur laporan polisi, KUHP',
    icon: 'scale',
  },
  {
    id: 'utang_kredit',
    label: 'Utang & Kredit',
    description: 'Surat utang, perjanjian kredit, penagihan, kepailitan',
    icon: 'credit-card',
  },
]

export const EXAMPLE_QUESTIONS = {
  ketenagakerjaan: [
    'Apa hak saya jika di-PHK tanpa surat peringatan?',
    'Berapa besaran pesangon yang saya terima?',
    'Apa perbedaan PKWT dan PKWTT?',
  ],
  konsumen: [
    'Bagaimana cara melaporkan penipuan online?',
    'Barang yang saya beli cacat, apa yang bisa saya lakukan?',
    'Apa saja hak saya sebagai konsumen?',
  ],
  keluarga: [
    'Bagaimana prosedur mengajukan cerai?',
    'Apa yang harus dilakukan jika mengalami KDRT?',
    'Bagaimana aturan hak asuh anak?',
  ],
  pertanahan: [
    'Bagaimana cara mengurus sertifikat tanah?',
    'Tanah saya disengketakan tetangga, apa yang harus dilakukan?',
    'Apa itu Hak Guna Bangunan?',
  ],
  pidana: [
    'Apa yang harus dilakukan jika ditangkap polisi?',
    'Bagaimana cara melaporkan tindak pidana?',
    'Apa saja hak saya sebagai tersangka?',
  ],
  utang_kredit: [
    'Penagih utang datang ke rumah, apa yang boleh mereka lakukan?',
    'Bagaimana cara restrukturisasi kredit?',
    'Apa itu kepailitan dan bagaimana prosesnya?',
  ],
}

export const CATEGORY_LABELS = {
  ketenagakerjaan: 'Ketenagakerjaan',
  konsumen: 'Konsumen',
  keluarga: 'Keluarga',
  pertanahan: 'Pertanahan',
  pidana: 'Pidana',
  utang_kredit: 'Utang & Kredit',
}

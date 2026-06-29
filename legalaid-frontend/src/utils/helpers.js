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

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '../stores/chatStore'
import { useHistoryStore } from '../stores/historyStore'
import { generateId, CATEGORY_LABELS, EXAMPLE_QUESTIONS } from '../utils/helpers'
import { sendChatMessage } from '../services/api'
import ChatMessage from '../components/ChatMessage.vue'
import ChatInput from '../components/ChatInput.vue'

const router = useRouter()
const chatStore = useChatStore()
const historyStore = useHistoryStore()

const messagesEnd = ref(null)
const chatContainer = ref(null)
const disclaimerVisible = ref(true)
const sidebarOpen = ref(false)
const showHistory = ref(false)

const hasMessages = computed(() => chatStore.hasMessages)
const currentCategory = computed(() => chatStore.category)
const recentSessions = computed(() => historyStore.sortedSessions.slice(0, 10))

const categoryMeta = {
  ketenagakerjaan: {
    label: 'Ketenagakerjaan', icon: 'briefcase',
    description: 'Informasi tentang PHK, pesangon, kontrak kerja, upah, BPJS Ketenagakerjaan, dan hak-hak pekerja.',
    tips: 'Siapkan dokumen seperti kontrak kerja, slip gaji, dan surat PHK untuk hasil konsultasi yang lebih optimal.',
    related: ['Kontrak Kerja', 'PHK & Pesangon', 'BPJS Ketenagakerjaan', 'Upah Minimum'],
  },
  konsumen: {
    label: 'Konsumen', icon: 'shopping-cart',
    description: 'Informasi tentang hak konsumen, produk cacat, penipuan online, dan pengaduan BPSK.',
    tips: 'Simpan bukti pembelian, screenshot percakapan, dan dokumentasi produk untuk memudahkan konsultasi.',
    related: ['Hak Konsumen', 'Penipuan Online', 'Produk Cacat', 'BPSK'],
  },
  keluarga: {
    label: 'Keluarga', icon: 'users',
    description: 'Informasi tentang pernikahan, perceraian, hak asuh anak, KDRT, dan warisan.',
    tips: 'Konsultasi ini bersifat informatif. Untuk kasus keluarga yang kompleks, sebaiknya berkonsultasi langsung dengan pengacara.',
    related: ['Perceraian', 'Hak Asuh Anak', 'KDRT', 'Warisan'],
  },
  pertanahan: {
    label: 'Pertanahan', icon: 'home',
    description: 'Informasi tentang sertifikat tanah, sengketa batas tanah, dan prosedur jual beli tanah.',
    tips: 'Siapkan nomor sertifikat tanah, letak tanah, dan dokumen kepemilikan untuk konsultasi yang lebih akurat.',
    related: ['Sertifikat Tanah', 'Sengketa Tanah', 'Jual Beli Tanah', 'HGB'],
  },
  pidana: {
    label: 'Pidana', icon: 'scale',
    description: 'Informasi tentang hak tersangka, prosedur laporan polisi, KUHP, dan proses hukum pidana.',
    tips: 'Jika Anda terlibat kasus pidana, segera konsultasi dengan pengacara. AI hanya memberikan informasi umum.',
    related: ['Hak Tersangka', 'Laporan Polisi', 'KUHP', 'Bantuan Hukum'],
  },
  utang_kredit: {
    label: 'Utang & Kredit', icon: 'credit-card',
    description: 'Informasi tentang surat utang, perjanjian kredit, penagihan utang, dan kepailitan.',
    tips: 'Catat jumlah utang, bunga, dan jangka waktu. Hindari janji pembayaran yang tidak bisa dipenuhi.',
    related: ['Penagihan Utang', 'Restrukturisasi', 'Kepailitan', 'Kredit Macet'],
  },
}

const iconPaths = {
  briefcase: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'shopping-cart': 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z',
  users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  scale: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
  'credit-card': 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
}

onMounted(() => {
  if (!chatStore.category) {
    router.push('/')
    return
  }
  scrollToBottom()
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  // Only save to history — do NOT fullReset here because this also fires on refresh.
  // fullReset is called explicitly in handleChangeCategory and handleReset.
  if (chatStore.messages.length > 1) {
    historyStore.saveSession(chatStore.category, chatStore.messages)
  }
})

function handleBeforeUnload() {
  // Persist current state to sessionStorage so refresh restores the session
  if (chatStore.category && chatStore.messages.length > 0) {
    try {
      sessionStorage.setItem('legalaid_chat_session', JSON.stringify({
        category: chatStore.category,
        messages: chatStore.messages,
      }))
    } catch {
      // ignore
    }
  }
}

watch(() => chatStore.messages.length, () => {
  nextTick(scrollToBottom)
})

function scrollToBottom() {
  if (messagesEnd.value) {
    messagesEnd.value.scrollIntoView({ behavior: 'smooth' })
  }
}

async function sendMessage(text) {
  const userMsg = {
    id: generateId(), role: 'user', content: text,
    timestamp: new Date().toISOString(), category: chatStore.category,
  }
  chatStore.addMessage(userMsg)
  chatStore.setLoading(true)

  const historyMessages = chatStore.messages
    .filter(m => !m.isStreaming).slice(0, -1)
    .map(m => ({ role: m.role, content: m.content }))

  const assistantMsg = {
    id: generateId(), role: 'assistant', content: '',
    timestamp: new Date().toISOString(), category: chatStore.category,
    isStreaming: true,
  }
  chatStore.addMessage(assistantMsg)
  scrollToBottom()

  try {
    const result = await sendChatMessage(chatStore.category, historyMessages, text)
    const lastMsg = chatStore.messages[chatStore.messages.length - 1]
    if (lastMsg && lastMsg.isStreaming) {
      lastMsg.content = result.data.reply
      lastMsg.isStreaming = false
      lastMsg.timestamp = result.data.timestamp || new Date().toISOString()
    }
  } catch (error) {
    const lastMsg = chatStore.messages[chatStore.messages.length - 1]
    if (lastMsg && lastMsg.isStreaming) {
      lastMsg.content = `Maaf, terjadi kesalahan: ${error.message}. Silakan coba lagi.`
      lastMsg.isStreaming = false
    }
  } finally {
    chatStore.setLoading(false)
    scrollToBottom()
  }
}

function handleExampleSelect(question) { sendMessage(question) }

function handleReset() {
  if (chatStore.messages.length > 1) historyStore.saveSession(chatStore.category, chatStore.messages)
  chatStore.resetChat()
  disclaimerVisible.value = true
}

function handleChangeCategory() {
  if (chatStore.messages.length > 1) historyStore.saveSession(chatStore.category, chatStore.messages)
  chatStore.fullReset()
  router.push('/')
}

const quickQuestions = [
  'Hak saya jika terkena PHK?',
  'Cara melaporkan penipuan online?',
  'Prosedur perceraian?',
  'Cara mengurus sertifikat tanah?',
  'Hak konsumen atas barang rusak?',
  'Prosedur membuat laporan polisi?',
]

function loadSession(sessionId) {
  const session = historyStore.getSession(sessionId)
  if (!session) return
  if (chatStore.messages.length > 1) {
    historyStore.saveSession(chatStore.category, chatStore.messages)
  }
  chatStore.fullReset()
  chatStore.setCategory(session.category)
  chatStore.messages = session.messages.map(m => ({ ...m }))
  showHistory.value = false
  sidebarOpen.value = false
  nextTick(scrollToBottom)
}

function getCategoryColor(cat) {
  const colors = {
    ketenagakerjaan: 'bg-blue-100 text-blue-700',
    konsumen: 'bg-emerald-100 text-emerald-700',
    keluarga: 'bg-pink-100 text-pink-700',
    pertanahan: 'bg-amber-100 text-amber-700',
    pidana: 'bg-red-100 text-red-700',
    utang_kredit: 'bg-purple-100 text-purple-700',
  }
  return colors[cat] || 'bg-gray-100 text-gray-700'
}
</script>

<template>
  <div class="flex h-[calc(100vh-4rem)] bg-[#F8FAFC] overflow-hidden">
    <!-- Mobile sidebar overlay -->
    <transition name="fade">
      <div v-if="sidebarOpen" class="fixed inset-0 z-30 bg-black/30 lg:hidden" @click="sidebarOpen = false" />
    </transition>

    <!-- Sidebar -->
    <aside
      class="fixed lg:relative inset-y-0 left-0 z-40 w-[280px] md:w-[300px] xl:w-[340px] bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Sidebar header with close button (mobile) -->
      <div class="flex items-center justify-between p-4 border-b border-gray-100 lg:hidden">
        <span class="font-semibold text-sm text-navy-900">Panel Informasi</span>
        <button @click="sidebarOpen = false" class="w-8 h-8 rounded-xl flex items-center justify-center text-navy-500 hover:bg-navy-50 transition-colors">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>

      <!-- Tab switcher -->
      <div class="flex border-b border-gray-100 px-3 pt-3 gap-1">
        <button
          @click="showHistory = false"
          class="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-t-xl text-xs font-medium transition-all duration-200"
          :class="!showHistory ? 'bg-royal-50 text-royal-700 border-b-2 border-royal-500' : 'text-navy-400 hover:text-navy-600'"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Info
        </button>
        <button
          @click="showHistory = true"
          class="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-t-xl text-xs font-medium transition-all duration-200"
          :class="showHistory ? 'bg-royal-50 text-royal-700 border-b-2 border-royal-500' : 'text-navy-400 hover:text-navy-600'"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Riwayat
          <span v-if="recentSessions.length > 0" class="bg-royal-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">{{ recentSessions.length }}</span>
        </button>
      </div>

      <!-- Tab: Info -->
      <div v-if="!showHistory" class="flex-1 overflow-y-auto p-5 space-y-5">
        <div v-if="currentCategory" class="space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-royal-500 to-royal-700 flex items-center justify-center shadow-md shadow-royal-500/20 shrink-0">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path :d="iconPaths[categoryMeta[currentCategory]?.icon] || iconPaths.briefcase" />
              </svg>
            </div>
            <div>
              <h2 class="font-semibold text-navy-900 text-sm">{{ categoryMeta[currentCategory]?.label }}</h2>
              <p class="text-xs text-navy-400">{{ chatStore.messages.length }} pesan</p>
            </div>
          </div>
          <p class="text-sm text-navy-500 leading-relaxed">{{ categoryMeta[currentCategory]?.description }}</p>
        </div>

        <hr class="border-gray-100" />

        <div v-if="currentCategory">
          <h3 class="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3">Contoh Pertanyaan</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(q, i) in EXAMPLE_QUESTIONS[currentCategory] || []" :key="i"
              @click="handleExampleSelect(q)"
              class="text-xs text-left bg-navy-50 hover:bg-royal-50 hover:text-royal-700 hover:border-royal-200 text-navy-600 px-3.5 py-2 rounded-2xl border border-navy-100/60 transition-all duration-200"
            >{{ q }}</button>
          </div>
        </div>

        <hr class="border-gray-100" />

        <div v-if="currentCategory">
          <h3 class="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3">Topik Terkait</h3>
          <div class="space-y-1.5">
            <button
              v-for="topic in categoryMeta[currentCategory]?.related" :key="topic"
              @click="handleExampleSelect(`Jelaskan tentang ${topic.toLowerCase()}`)"
              class="w-full text-left text-sm text-navy-500 hover:text-royal-600 hover:bg-royal-50 px-3 py-2 rounded-2xl transition-all duration-200 flex items-center gap-2"
            >
              <svg class="w-3.5 h-3.5 text-navy-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              {{ topic }}
            </button>
          </div>
        </div>

        <hr class="border-gray-100" />

        <div v-if="currentCategory">
          <h3 class="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3">Tips Konsultasi</h3>
          <div class="bg-royal-50/60 rounded-2xl p-4 border border-royal-100/50">
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-lg bg-royal-100 flex items-center justify-center shrink-0">
                <svg class="w-3.5 h-3.5 text-royal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              </div>
              <p class="text-xs text-navy-600 leading-relaxed">{{ categoryMeta[currentCategory]?.tips }}</p>
            </div>
          </div>
        </div>

        <hr class="border-gray-100" />

        <div>
          <h3 class="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3">Informasi Penting</h3>
          <div class="bg-gold-50/60 rounded-2xl p-4 border border-gold-100/50">
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-lg bg-gold-100 flex items-center justify-center shrink-0">
                <svg class="w-3.5 h-3.5 text-gold-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              </div>
              <p class="text-xs text-gold-800 leading-relaxed">Jawaban AI bersifat informatif dan <strong>bukan nasihat hukum</strong> yang mengikat. Untuk kasus kompleks, konsultasikan dengan pengacara profesional.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Riwayat -->
      <div v-else class="flex-1 overflow-y-auto p-4 space-y-2">
        <!-- Empty state -->
        <div v-if="recentSessions.length === 0" class="text-center py-10">
          <div class="w-12 h-12 rounded-2xl bg-navy-50 flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-navy-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <p class="text-xs text-navy-400 leading-relaxed">Belum ada riwayat konsultasi</p>
        </div>

        <!-- Session list -->
        <div v-else>
          <p class="text-xs text-navy-400 mb-3">Klik untuk melanjutkan sesi sebelumnya</p>
          <div
            v-for="session in recentSessions"
            :key="session.id"
            @click="loadSession(session.id)"
            class="group w-full text-left bg-white hover:bg-royal-50 hover:border-royal-200 border border-gray-100 rounded-2xl p-3.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
          >
            <div class="flex items-start gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-royal-500 to-royal-700 flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-medium mb-1" :class="getCategoryColor(session.category)">
                  {{ categoryMeta[session.category]?.label || session.category }}
                </span>
                <p class="text-xs text-navy-600 leading-relaxed line-clamp-2 group-hover:text-royal-700 transition-colors">
                  {{ session.messages.find(m => m.role === 'user')?.content || 'Konsultasi hukum' }}
                </p>
                <p class="text-[10px] text-navy-400 mt-1">{{ session.messages.length }} pesan</p>
              </div>
            </div>
          </div>

          <button
            @click="router.push('/history')"
            class="w-full mt-2 text-xs text-royal-600 hover:text-royal-800 font-medium py-2 rounded-xl hover:bg-royal-50 transition-colors"
          >
            Lihat semua riwayat →
          </button>
        </div>
      </div>

      <div class="p-4 border-t border-gray-100">
        <button @click="handleChangeCategory" class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border-2 border-navy-200 text-navy-600 font-medium text-sm hover:bg-navy-50 hover:border-royal-300 hover:text-royal-700 transition-all duration-200">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" /></svg>
          Pilih Kategori Lain
        </button>
      </div>
    </aside>

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Mobile top bar with sidebar toggle -->
      <div class="flex items-center gap-3 px-4 pt-3 pb-0 lg:hidden">
        <button @click="sidebarOpen = true" class="w-8 h-8 rounded-xl flex items-center justify-center text-navy-500 hover:bg-navy-50 transition-colors">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        <span class="text-sm font-medium text-navy-900">{{ categoryMeta[currentCategory]?.label }}</span>
      </div>

      <!-- Disclaimer Banner -->
      <transition name="slide-down">
        <div v-if="disclaimerVisible" class="px-3 sm:px-4 md:px-6 pt-2 pb-0">
          <div class="bg-gold-50/90 backdrop-blur-sm border border-gold-200/60 rounded-2xl px-4 py-2.5 flex items-center gap-3">
            <div class="w-7 h-7 rounded-xl bg-gold-100 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-gold-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            </div>
            <p class="text-xs text-gold-800 flex-1 leading-relaxed">LegalAid AI adalah asisten informasi hukum berbasis AI dan <strong>bukan pengganti advokat</strong>. Informasi bersifat informatif berdasarkan regulasi Indonesia.</p>
            <button @click="disclaimerVisible = false" class="text-xs font-medium text-gold-700 hover:text-gold-900 bg-gold-100 hover:bg-gold-200 px-3 py-1.5 rounded-xl transition-all duration-200 shrink-0">Saya Mengerti</button>
          </div>
        </div>
      </transition>

      <!-- Chat Messages -->
      <div ref="chatContainer" class="flex-1 overflow-y-auto min-h-0">
        <div class="max-w-[900px] xl:max-w-[1000px] mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-5 space-y-5 md:space-y-6">
          <!-- Bottom spacer to ensure 20-32px gap between last message and footer -->
          <div class="h-4 md:h-6" />

          <!-- Quick Questions -->
          <div v-if="!hasMessages" class="animate-fade-in-up">
            <div class="text-center mb-6 md:mb-8">
              <div class="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-royal-50 shadow-sm border border-royal-100/50 mb-3 md:mb-4">
                <svg class="w-7 h-7 md:w-8 h-8 text-royal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
              </div>
              <h2 class="text-lg md:text-xl font-semibold text-navy-900">Mulai Konsultasi {{ categoryMeta[currentCategory]?.label }}</h2>
              <p class="text-sm text-navy-500 mt-1.5 max-w-md mx-auto">Ajukan pertanyaan tentang masalah hukum Anda, atau pilih salah satu pertanyaan di bawah ini</p>
            </div>
            <div class="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              <button v-for="(q, i) in quickQuestions" :key="i" @click="handleExampleSelect(q)" class="group text-left bg-white hover:bg-royal-50 hover:border-royal-200 border border-gray-100/80 rounded-2xl p-4 card-shadow transition-all duration-200 hover:-translate-y-0.5">
                <p class="text-sm text-navy-700 group-hover:text-royal-700 leading-relaxed">{{ q }}</p>
              </button>
            </div>
          </div>

          <!-- Messages -->
          <ChatMessage v-for="(msg, i) in chatStore.messages" :key="msg.id" :message="msg" :style="{ animationDelay: `${i * 0.05}s` }" />

          <div ref="messagesEnd" />
        </div>
      </div>

      <!-- Sticky Input Footer -->
      <ChatInput :disabled="chatStore.isLoading" @send="sendMessage" />
    </div>
  </div>
</template>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

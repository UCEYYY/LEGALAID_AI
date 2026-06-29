<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '../stores/historyStore'
import { useChatStore } from '../stores/chatStore'
import HistoryListItem from '../components/HistoryListItem.vue'

const router = useRouter()
const historyStore = useHistoryStore()
const chatStore = useChatStore()

const searchQuery = ref('')
const filterCategory = ref('')
const filterTime = ref('')
const showConfirmDeleteAll = ref(false)
const showMobileFilters = ref(false)
const currentPage = ref(1)
const perPage = 10

const categoryOptions = [
  { value: '', label: 'Semua Kategori' },
  { value: 'ketenagakerjaan', label: 'Ketenagakerjaan' },
  { value: 'konsumen', label: 'Konsumen' },
  { value: 'keluarga', label: 'Keluarga' },
  { value: 'pertanahan', label: 'Pertanahan' },
  { value: 'pidana', label: 'Pidana' },
  { value: 'utang_kredit', label: 'Utang & Kredit' },
]

const timeFilters = [
  { value: '', label: 'Semua Waktu' },
  { value: 'today', label: 'Hari Ini' },
  { value: 'yesterday', label: 'Kemarin' },
  { value: 'week', label: '7 Hari Terakhir' },
  { value: 'month', label: '30 Hari Terakhir' },
]

const filteredSessions = computed(() => {
  let result = historyStore.sortedSessions

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.messages.some(m => m.content && m.content.toLowerCase().includes(q))
    )
  }

  if (filterCategory.value) {
    result = result.filter(s => s.category === filterCategory.value)
  }

  if (filterTime.value) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    result = result.filter(s => {
      const d = new Date(s.updatedAt)
      const sessionDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
      const diffDays = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24))
      switch (filterTime.value) {
        case 'today': return diffDays === 0
        case 'yesterday': return diffDays === 1
        case 'week': return diffDays < 7
        case 'month': return diffDays < 30
        default: return true
      }
    })
  }

  return result
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredSessions.value.length / perPage)))

const paginatedSessions = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredSessions.value.slice(start, start + perPage)
})

const filteredCount = computed(() => filteredSessions.value.length)

function selectSession(sessionId) {
  const session = historyStore.getSession(sessionId)
  if (!session) return
  chatStore.fullReset()
  chatStore.setCategory(session.category)
  chatStore.messages = session.messages.map(m => ({ ...m }))
  router.push('/chat')
}

function deleteSession(sessionId) {
  historyStore.deleteSession(sessionId)
}

function deleteAllSessions() {
  historyStore.deleteAllSessions()
  showConfirmDeleteAll.value = false
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC]">
    <div class="max-w-[1100px] xl:max-w-[1200px] mx-auto px-4 sm:px-6 py-6 md:py-8 lg:py-10">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-sm text-navy-400 mb-5">
        <button @click="router.push('/')" class="hover:text-navy-600 transition-colors">Beranda</button>
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        <span class="text-navy-900 font-medium">Riwayat Konsultasi</span>
      </div>

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
          <button @click="router.push('/')" class="w-9 h-9 rounded-2xl flex items-center justify-center text-navy-500 hover:bg-navy-50 transition-colors shrink-0">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div>
            <h1 class="text-xl md:text-2xl font-bold text-navy-900 tracking-tight">Riwayat Konsultasi</h1>
            <p class="text-sm text-navy-500 mt-0.5">{{ historyStore.sessionCount }} sesi tersimpan</p>
          </div>
        </div>
        <button
          v-if="historyStore.sessionCount > 0"
          @click="showConfirmDeleteAll = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 border-red-200 text-red-500 font-medium text-sm hover:bg-red-50 hover:border-red-300 transition-all duration-200 shrink-0"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
          Hapus Semua
        </button>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white rounded-3xl p-4 md:p-5 border border-gray-100/80 card-shadow mb-6">
        <div class="flex flex-col md:flex-row gap-3">
          <div class="flex-1 relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari berdasarkan judul atau isi konsultasi..."
              class="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200/80 bg-[#F8FAFC] text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 transition-all"
            />
          </div>
          <div class="hidden md:flex items-center gap-3">
            <select v-model="filterCategory" class="px-4 py-2.5 rounded-2xl border border-gray-200/80 bg-[#F8FAFC] text-sm text-navy-700 focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 transition-all appearance-none cursor-pointer">
              <option v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
            <select v-model="filterTime" class="px-4 py-2.5 rounded-2xl border border-gray-200/80 bg-[#F8FAFC] text-sm text-navy-700 focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 transition-all appearance-none cursor-pointer">
              <option v-for="opt in timeFilters" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <button @click="showMobileFilters = !showMobileFilters" class="md:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200/80 text-sm text-navy-600 hover:bg-navy-50 transition-all">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" /></svg>
            Filter
          </button>
        </div>

        <!-- Mobile Filters -->
        <transition name="slide-down">
          <div v-if="showMobileFilters" class="md:hidden flex flex-col gap-3 mt-3 pt-3 border-t border-gray-100">
            <select v-model="filterCategory" class="w-full px-4 py-2.5 rounded-2xl border border-gray-200/80 bg-[#F8FAFC] text-sm text-navy-700 focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 transition-all appearance-none cursor-pointer">
              <option v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
            <select v-model="filterTime" class="w-full px-4 py-2.5 rounded-2xl border border-gray-200/80 bg-[#F8FAFC] text-sm text-navy-700 focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 transition-all appearance-none cursor-pointer">
              <option v-for="opt in timeFilters" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
        </transition>
      </div>

      <!-- Results info -->
      <div v-if="filteredSessions.length > 0" class="flex items-center justify-between mb-4">
        <p class="text-sm text-navy-500">Menampilkan {{ paginatedSessions.length }} dari {{ filteredCount }} hasil</p>
        <p v-if="searchQuery || filterCategory || filterTime" class="text-xs text-navy-400">
          <button @click="searchQuery = ''; filterCategory = ''; filterTime = ''" class="text-royal-500 hover:text-royal-700 transition-colors">Reset filter</button>
        </p>
      </div>

      <!-- Empty State -->
      <div v-if="historyStore.sessionCount === 0" class="text-center py-16 md:py-20 animate-fade-in-up">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-navy-50 border border-navy-100/60 mb-5">
          <svg class="w-10 h-10 text-navy-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-navy-900 mb-2">Belum Ada Riwayat Konsultasi</h3>
        <p class="text-sm text-navy-500 max-w-sm mx-auto mb-6 leading-relaxed">
          Riwayat konsultasi akan muncul di sini setelah Anda selesai berkonsultasi dengan LegalAid AI.
        </p>
        <button
          @click="router.push('/')"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-royal-500 text-white font-semibold text-sm shadow-lg shadow-royal-500/25 hover:bg-royal-600 hover:shadow-xl hover:shadow-royal-500/30 active:scale-[0.98] transition-all duration-200"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Mulai Konsultasi Sekarang
        </button>
      </div>

      <!-- No results after filter -->
      <div v-else-if="filteredSessions.length === 0" class="text-center py-16 animate-fade-in-up">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-navy-50 border border-navy-100/60 mb-4">
          <svg class="w-8 h-8 text-navy-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        </div>
        <h3 class="text-lg font-semibold text-navy-900 mb-1">Hasil Tidak Ditemukan</h3>
        <p class="text-sm text-navy-500 mb-4">Tidak ada riwayat yang sesuai dengan filter Anda.</p>
        <button @click="searchQuery = ''; filterCategory = ''; filterTime = ''" class="text-sm text-royal-500 hover:text-royal-700 font-medium transition-colors">Reset semua filter</button>
      </div>

      <!-- Session List -->
      <transition-group v-else name="list" tag="div" class="space-y-3 md:space-y-4">
        <HistoryListItem
          v-for="session in paginatedSessions"
          :key="session.id"
          :session="session"
          @select="selectSession"
          @delete="deleteSession"
        />
      </transition-group>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-3 mt-8">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded-2xl border border-gray-200/80 text-sm font-medium transition-all"
          :class="currentPage === 1 ? 'text-navy-300 bg-gray-50 cursor-not-allowed' : 'text-navy-600 hover:bg-navy-50 hover:border-navy-300'"
        >
          Sebelumnya
        </button>
        <div class="flex items-center gap-1.5">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            class="w-9 h-9 rounded-2xl text-sm font-medium transition-all"
            :class="page === currentPage ? 'bg-royal-500 text-white shadow-md shadow-royal-500/20' : 'text-navy-500 hover:bg-navy-50'"
          >{{ page }}</button>
        </div>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 rounded-2xl border border-gray-200/80 text-sm font-medium transition-all"
          :class="currentPage === totalPages ? 'text-navy-300 bg-gray-50 cursor-not-allowed' : 'text-navy-600 hover:bg-navy-50 hover:border-navy-300'"
        >
          Selanjutnya
        </button>
      </div>
    </div>

    <!-- Confirm Delete All Dialog -->
    <transition name="fade">
      <div v-if="showConfirmDeleteAll" class="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="showConfirmDeleteAll = false" />
        <div class="relative bg-white rounded-3xl shadow-2xl p-6 md:p-7 max-w-sm w-full animate-fade-in-up">
          <div class="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-navy-900 text-center mb-1">Hapus Semua Riwayat?</h3>
          <p class="text-sm text-navy-500 text-center mb-6">Tindakan ini tidak dapat dibatalkan. Semua sesi konsultasi akan dihapus permanen.</p>
          <div class="flex gap-3">
            <button @click="showConfirmDeleteAll = false" class="flex-1 px-4 py-2.5 rounded-2xl border-2 border-gray-200 text-sm font-semibold text-navy-600 hover:bg-navy-50 transition-all">Batal</button>
            <button @click="deleteAllSessions" class="flex-1 px-4 py-2.5 rounded-2xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:scale-[0.98] transition-all shadow-md shadow-red-500/20">Hapus Semua</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.list-enter-active, .list-leave-active { transition: all 0.35s ease; }
.list-enter-from { opacity: 0; transform: translateY(12px); }
.list-leave-to { opacity: 0; transform: translateX(-12px); }
.list-move { transition: transform 0.35s ease; }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

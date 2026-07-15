<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getStats } from '../../services/adminApi'

const router = useRouter()
const stats = ref({ totalUsers: 0, totalSessions: 0, totalMessages: 0 })
const categoryStats = ref([])
const recentUsers = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const result = await getStats()
    stats.value = result.data.stats
    categoryStats.value = result.data.categoryStats
    recentUsers.value = result.data.recentUsers
  } catch (e) {
    console.error('Failed to load stats:', e)
  } finally {
    isLoading.value = false
  }
})

const maxCategory = computed(() => {
  if (categoryStats.value.length === 0) return 1
  return Math.max(...categoryStats.value.map(c => c.count))
})

const categoryLabels = {
  ketenagakerjaan: 'Ketenagakerjaan',
  konsumen: 'Konsumen',
  keluarga: 'Keluarga',
  pertanahan: 'Pertanahan',
  pidana: 'Pidana',
  utang_kredit: 'Utang & Kredit',
}

const categoryColors = {
  ketenagakerjaan: { bg: 'bg-royal-500/15', bar: 'bg-royal-500', text: 'text-royal-400' },
  konsumen: { bg: 'bg-emerald-500/15', bar: 'bg-emerald-500', text: 'text-emerald-400' },
  keluarga: { bg: 'bg-purple-500/15', bar: 'bg-purple-500', text: 'text-purple-400' },
  pertanahan: { bg: 'bg-gold-500/15', bar: 'bg-gold-500', text: 'text-gold-400' },
  pidana: { bg: 'bg-rose-500/15', bar: 'bg-rose-500', text: 'text-rose-400' },
  utang_kredit: { bg: 'bg-cyan-500/15', bar: 'bg-cyan-500', text: 'text-cyan-400' },
}

function getCatColor(slug) {
  return categoryColors[slug] || { bg: 'bg-navy-500/15', bar: 'bg-navy-400', text: 'text-navy-400' }
}

function formatRelative(dateStr) {
  const now = new Date()
  const d = new Date(dateStr)
  const diffMs = now - d
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Baru saja'
  if (diffMin < 60) return `${diffMin}m lalu`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH}j lalu`
  const diffD = Math.floor(diffH / 24)
  if (diffD < 7) return `${diffD}h lalu`
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}
</script>

<template>
  <div class="p-6 md:p-8 space-y-8">

    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-white">Dashboard</h1>
      <p class="text-sm text-navy-400 mt-1">Ringkasan aktivitas sistem LegalAid AI</p>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 gap-4">
      <div class="relative">
        <div class="w-10 h-10 border-2 border-royal-500/30 rounded-full"></div>
        <div class="absolute inset-0 w-10 h-10 border-2 border-royal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p class="text-sm text-navy-500">Memuat data...</p>
    </div>

    <template v-else>

      <!-- Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <!-- Pengguna -->
        <div class="group relative bg-navy-900 rounded-2xl border border-navy-800 p-5 overflow-hidden hover:border-royal-500/30 transition-all duration-300">
          <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-royal-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <div class="w-11 h-11 rounded-xl bg-royal-500/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-royal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
              </div>
              <span class="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Aktif</span>
            </div>
            <p class="text-3xl font-bold text-white tracking-tight">{{ stats.totalUsers }}</p>
            <p class="text-xs text-navy-400 mt-1">Pengguna terdaftar</p>
          </div>
        </div>

        <!-- Sesi -->
        <div class="group relative bg-navy-900 rounded-2xl border border-navy-800 p-5 overflow-hidden hover:border-emerald-500/30 transition-all duration-300">
          <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <div class="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
              </div>
              <span class="text-[11px] font-medium text-navy-400 bg-navy-800 px-2 py-0.5 rounded-full">Riwayat</span>
            </div>
            <p class="text-3xl font-bold text-white tracking-tight">{{ stats.totalSessions }}</p>
            <p class="text-xs text-navy-400 mt-1">Sesi konsultasi</p>
          </div>
        </div>

        <!-- Pesan -->
        <div class="group relative bg-navy-900 rounded-2xl border border-navy-800 p-5 overflow-hidden hover:border-gold-500/30 transition-all duration-300">
          <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-gold-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <div class="w-11 h-11 rounded-xl bg-gold-500/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
              </div>
              <span class="text-[11px] font-medium text-navy-400 bg-navy-800 px-2 py-0.5 rounded-full">Total</span>
            </div>
            <p class="text-3xl font-bold text-white tracking-tight">{{ stats.totalMessages }}</p>
            <p class="text-xs text-navy-400 mt-1">Pesan terkirim</p>
          </div>
        </div>

      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">

        <!-- Category Breakdown (wider) -->
        <div class="lg:col-span-3 bg-navy-900 rounded-2xl border border-navy-800 p-6">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h2 class="text-base font-semibold text-white">Sesi per Kategori</h2>
              <p class="text-xs text-navy-500 mt-0.5">Distribusi konsultasi berdasarkan topik</p>
            </div>
            <router-link to="/admin/sessions" class="text-xs text-royal-400 hover:text-royal-300 font-medium transition-colors">Lihat semua</router-link>
          </div>

          <div v-if="categoryStats.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-12 h-12 rounded-2xl bg-navy-800 flex items-center justify-center mb-3">
              <svg class="w-6 h-6 text-navy-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <p class="text-sm text-navy-500">Belum ada data kategori</p>
          </div>

          <div v-else class="space-y-3.5">
            <div v-for="(cat, i) in categoryStats" :key="cat.category_slug" class="group">
              <div class="flex items-center gap-3 mb-1.5">
                <div class="w-2 h-2 rounded-full shrink-0" :class="getCatColor(cat.category_slug).bar"></div>
                <span class="text-sm text-navy-200 flex-1">{{ categoryLabels[cat.category_slug] || cat.category_slug }}</span>
                <span class="text-sm font-semibold tabular-nums" :class="getCatColor(cat.category_slug).text">{{ cat.count }}</span>
              </div>
              <div class="ml-5 h-1.5 bg-navy-800 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700 ease-out"
                  :class="getCatColor(cat.category_slug).bar"
                  :style="{ width: `${(cat.count / maxCategory) * 100}%`, transitionDelay: `${i * 100}ms` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Users (narrower) -->
        <div class="lg:col-span-2 bg-navy-900 rounded-2xl border border-navy-800 p-6">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h2 class="text-base font-semibold text-white">Pengguna Terbaru</h2>
              <p class="text-xs text-navy-500 mt-0.5">5 pengguna paling baru</p>
            </div>
            <router-link to="/admin/users" class="text-xs text-royal-400 hover:text-royal-300 font-medium transition-colors">Lihat semua</router-link>
          </div>

          <div v-if="recentUsers.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-12 h-12 rounded-2xl bg-navy-800 flex items-center justify-center mb-3">
              <svg class="w-6 h-6 text-navy-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <p class="text-sm text-navy-500">Belum ada pengguna</p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="(user, i) in recentUsers"
              :key="user.id"
              class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-navy-800/50 transition-colors"
            >
              <div
                class="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                :class="[
                  i === 0 ? 'bg-royal-500/20 text-royal-400' :
                  i === 1 ? 'bg-emerald-500/20 text-emerald-400' :
                  i === 2 ? 'bg-gold-500/20 text-gold-400' :
                  'bg-navy-800 text-navy-400'
                ]"
              >
                {{ getInitials(user.name) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-white font-medium truncate">{{ user.name }}</p>
                <p class="text-xs text-navy-500 truncate">{{ user.email }}</p>
              </div>
              <span class="text-[11px] text-navy-500 shrink-0 whitespace-nowrap" :title="new Date(user.created_at).toLocaleString('id-ID')">{{ formatRelative(user.created_at) }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Quick Actions -->
      <div class="bg-navy-900 rounded-2xl border border-navy-800 p-6">
        <h2 class="text-base font-semibold text-white mb-4">Akses Cepat</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            @click="router.push('/admin/users')"
            class="group flex flex-col items-center gap-2.5 p-4 rounded-xl bg-navy-800/50 hover:bg-royal-500/10 border border-transparent hover:border-royal-500/20 transition-all"
          >
            <div class="w-10 h-10 rounded-xl bg-navy-800 group-hover:bg-royal-500/15 flex items-center justify-center transition-colors">
              <svg class="w-5 h-5 text-navy-400 group-hover:text-royal-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>
            </div>
            <span class="text-xs font-medium text-navy-300 group-hover:text-white transition-colors">Pengguna</span>
          </button>
          <button
            @click="router.push('/admin/sessions')"
            class="group flex flex-col items-center gap-2.5 p-4 rounded-xl bg-navy-800/50 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 transition-all"
          >
            <div class="w-10 h-10 rounded-xl bg-navy-800 group-hover:bg-emerald-500/15 flex items-center justify-center transition-colors">
              <svg class="w-5 h-5 text-navy-400 group-hover:text-emerald-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <span class="text-xs font-medium text-navy-300 group-hover:text-white transition-colors">Sesi</span>
          </button>
          <button
            @click="router.push('/admin/categories')"
            class="group flex flex-col items-center gap-2.5 p-4 rounded-xl bg-navy-800/50 hover:bg-gold-500/10 border border-transparent hover:border-gold-500/20 transition-all"
          >
            <div class="w-10 h-10 rounded-xl bg-navy-800 group-hover:bg-gold-500/15 flex items-center justify-center transition-colors">
              <svg class="w-5 h-5 text-navy-400 group-hover:text-gold-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
            </div>
            <span class="text-xs font-medium text-navy-300 group-hover:text-white transition-colors">Kategori</span>
          </button>
          <button
            @click="router.push('/admin/faq')"
            class="group flex flex-col items-center gap-2.5 p-4 rounded-xl bg-navy-800/50 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20 transition-all"
          >
            <div class="w-10 h-10 rounded-xl bg-navy-800 group-hover:bg-purple-500/15 flex items-center justify-center transition-colors">
              <svg class="w-5 h-5 text-navy-400 group-hover:text-purple-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <span class="text-xs font-medium text-navy-300 group-hover:text-white transition-colors">FAQ</span>
          </button>
        </div>
      </div>

    </template>
  </div>
</template>

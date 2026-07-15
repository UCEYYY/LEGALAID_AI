<script setup>
import { ref, onMounted } from 'vue'
import { getStats } from '../../services/adminApi'

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

const categoryLabels = {
  ketenagakerjaan: 'Ketenagakerjaan',
  konsumen: 'Konsumen',
  keluarga: 'Keluarga',
  pertanahan: 'Pertanahan',
  pidana: 'Pidana',
  utang_kredit: 'Utang & Kredit',
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="p-6 md:p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white">Dashboard</h1>
      <p class="text-sm text-navy-400 mt-1">Statistik dan informasi sistem LegalAid AI</p>
    </div>

    <div v-if="isLoading" class="text-center py-20">
      <div class="w-8 h-8 border-2 border-royal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-sm text-navy-400 mt-3">Memuat data...</p>
    </div>

    <template v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-navy-900 rounded-2xl p-5 border border-navy-800">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl bg-royal-500/10 flex items-center justify-center">
              <svg class="w-5 h-5 text-royal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>
            </div>
            <span class="text-sm text-navy-400">Total Pengguna</span>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.totalUsers }}</p>
        </div>

        <div class="bg-navy-900 rounded-2xl p-5 border border-navy-800">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <svg class="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <span class="text-sm text-navy-400">Total Sesi</span>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.totalSessions }}</p>
        </div>

        <div class="bg-navy-900 rounded-2xl p-5 border border-navy-800">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
              <svg class="w-5 h-5 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
            </div>
            <span class="text-sm text-navy-400">Total Pesan</span>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.totalMessages }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Category Breakdown -->
        <div class="bg-navy-900 rounded-2xl p-5 border border-navy-800">
          <h2 class="text-lg font-semibold text-white mb-4">Sesi per Kategori</h2>
          <div v-if="categoryStats.length === 0" class="text-sm text-navy-500 py-8 text-center">Belum ada data</div>
          <div v-else class="space-y-3">
            <div v-for="cat in categoryStats" :key="cat.category_slug" class="flex items-center gap-3">
              <span class="text-sm text-navy-300 w-32 truncate">{{ categoryLabels[cat.category_slug] || cat.category_slug }}</span>
              <div class="flex-1 h-2 bg-navy-800 rounded-full overflow-hidden">
                <div class="h-full bg-royal-500 rounded-full" :style="{ width: `${(cat.count / stats.totalSessions) * 100}%` }"></div>
              </div>
              <span class="text-sm text-navy-400 w-10 text-right">{{ cat.count }}</span>
            </div>
          </div>
        </div>

        <!-- Recent Users -->
        <div class="bg-navy-900 rounded-2xl p-5 border border-navy-800">
          <h2 class="text-lg font-semibold text-white mb-4">Pengguna Terbaru</h2>
          <div v-if="recentUsers.length === 0" class="text-sm text-navy-500 py-8 text-center">Belum ada pengguna</div>
          <div v-else class="space-y-3">
            <div v-for="user in recentUsers" :key="user.id" class="flex items-center gap-3 p-3 rounded-xl bg-navy-800/50">
              <div class="w-9 h-9 rounded-full bg-royal-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-white font-medium truncate">{{ user.name }}</p>
                <p class="text-xs text-navy-400 truncate">{{ user.email }}</p>
              </div>
              <span class="text-xs text-navy-500 shrink-0">{{ formatDate(user.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

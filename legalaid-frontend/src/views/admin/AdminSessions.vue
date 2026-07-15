<script setup>
import { ref, onMounted } from 'vue'
import { getSessions } from '../../services/adminApi'

const sessions = ref([])
const pagination = ref({ page: 1, limit: 10, total: 0, totalPages: 0 })
const isLoading = ref(true)

onMounted(() => loadSessions())

async function loadSessions(page = 1) {
  isLoading.value = true
  try {
    const result = await getSessions(page, 10)
    sessions.value = result.data.sessions
    pagination.value = result.data.pagination
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const categoryLabels = {
  ketenagakerjaan: 'Ketenagakerjaan', konsumen: 'Konsumen', keluarga: 'Keluarga',
  pertanahan: 'Pertanahan', pidana: 'Pidana', utang_kredit: 'Utang & Kredit',
}
</script>

<template>
  <div class="p-6 md:p-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Sesi Konsultasi</h1>
        <p class="text-sm text-navy-400 mt-1">Semua sesi konsultasi dari semua pengguna</p>
      </div>
      <span class="text-sm text-navy-400">{{ pagination.total }} sesi</span>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <div class="w-6 h-6 border-2 border-royal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>

    <div v-else-if="sessions.length === 0" class="text-center py-12 text-navy-500 text-sm">Belum ada sesi konsultasi</div>

    <div v-else class="bg-navy-900 rounded-2xl border border-navy-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-navy-800">
              <th class="text-left px-5 py-3 text-navy-400 font-medium">Pengguna</th>
              <th class="text-left px-5 py-3 text-navy-400 font-medium">Kategori</th>
              <th class="text-left px-5 py-3 text-navy-400 font-medium">Judul</th>
              <th class="text-left px-5 py-3 text-navy-400 font-medium">Terakhir Diperbarui</th>
              <th class="text-right px-5 py-3 text-navy-400 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in sessions" :key="s.id" class="border-b border-navy-800/50 hover:bg-navy-800/30 transition-colors">
              <td class="px-5 py-3 text-white">{{ s.user_name }}</td>
              <td class="px-5 py-3"><span class="text-xs bg-navy-800 text-navy-300 px-2 py-0.5 rounded-lg">{{ categoryLabels[s.category_slug] || s.category_slug }}</span></td>
              <td class="px-5 py-3 text-navy-300 truncate max-w-[200px]">{{ s.title || '-' }}</td>
              <td class="px-5 py-3 text-navy-400">{{ formatDate(s.updated_at) }}</td>
              <td class="px-5 py-3 text-right">
                <router-link :to="`/admin/sessions/${s.id}`" class="text-royal-400 hover:text-royal-300 text-xs font-medium">Lihat</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="pagination.totalPages > 1" class="flex justify-center gap-2 mt-6">
      <button
        v-for="p in pagination.totalPages" :key="p"
        @click="loadSessions(p)"
        class="w-9 h-9 rounded-xl text-sm font-medium transition-all"
        :class="p === pagination.page ? 'bg-royal-500 text-white' : 'text-navy-400 hover:bg-navy-800'"
      >{{ p }}</button>
    </div>
  </div>
</template>

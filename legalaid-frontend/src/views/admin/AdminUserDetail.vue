<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserDetail } from '../../services/adminApi'

const route = useRoute()
const router = useRouter()
const user = ref(null)
const sessions = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const result = await getUserDetail(route.params.id)
    user.value = result.data.user
    sessions.value = result.data.sessions
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
})

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
    <button @click="router.back()" class="text-sm text-navy-400 hover:text-white mb-4 inline-flex items-center gap-1">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6" /></svg>
      Kembali
    </button>

    <div v-if="isLoading" class="text-center py-12">
      <div class="w-6 h-6 border-2 border-royal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>

    <template v-else-if="user">
      <div class="bg-navy-900 rounded-2xl p-6 border border-navy-800 mb-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-royal-500 flex items-center justify-center text-white text-xl font-bold">{{ user.name.charAt(0).toUpperCase() }}</div>
          <div>
            <h1 class="text-xl font-bold text-white">{{ user.name }}</h1>
            <p class="text-sm text-navy-400">{{ user.email }}</p>
            <p class="text-xs text-navy-500 mt-1">Terdaftar: {{ formatDate(user.created_at) }}</p>
          </div>
        </div>
      </div>

      <h2 class="text-lg font-semibold text-white mb-4">Sesi Konsultasi ({{ sessions.length }})</h2>

      <div v-if="sessions.length === 0" class="text-center py-8 text-navy-500 text-sm bg-navy-900 rounded-2xl border border-navy-800">Belum ada sesi konsultasi</div>

      <div v-else class="space-y-3">
        <router-link
          v-for="s in sessions" :key="s.id"
          :to="`/admin/sessions/${s.id}`"
          class="block bg-navy-900 rounded-2xl p-4 border border-navy-800 hover:border-royal-500/30 transition-all"
        >
          <div class="flex items-center justify-between">
            <div>
              <span class="text-xs text-navy-400 bg-navy-800 px-2 py-0.5 rounded-lg">{{ categoryLabels[s.category_slug] || s.category_slug }}</span>
              <p class="text-sm text-white mt-2">{{ s.title || 'Konsultasi' }}</p>
            </div>
            <span class="text-xs text-navy-500 shrink-0 ml-4">{{ formatDate(s.updated_at) }}</span>
          </div>
        </router-link>
      </div>
    </template>
  </div>
</template>

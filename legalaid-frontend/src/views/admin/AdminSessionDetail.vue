<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSessionDetail } from '../../services/adminApi'

const route = useRoute()
const router = useRouter()
const session = ref(null)
const messages = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const result = await getSessionDetail(route.params.id)
    session.value = result.data.session
    messages.value = result.data.messages
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
})

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
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

    <template v-else-if="session">
      <div class="bg-navy-900 rounded-2xl p-5 border border-navy-800 mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs bg-navy-800 text-navy-300 px-2 py-0.5 rounded-lg">{{ categoryLabels[session.category_slug] || session.category_slug }}</span>
          <span class="text-xs text-navy-500">{{ formatDate(session.created_at) }}</span>
        </div>
        <h1 class="text-lg font-semibold text-white">{{ session.title || 'Konsultasi' }}</h1>
        <p class="text-sm text-navy-400 mt-1">{{ session.user_name }} ({{ session.user_email }})</p>
      </div>

      <div class="space-y-4">
        <div
          v-for="msg in messages" :key="msg.id"
          class="flex gap-3"
          :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            v-if="msg.role === 'assistant'"
            class="w-8 h-8 rounded-xl bg-royal-500 flex items-center justify-center shrink-0"
          >
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </div>
          <div
            class="max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
            :class="msg.role === 'user' ? 'bg-royal-500 text-white' : 'bg-navy-800 text-navy-200'"
          >
            <p class="whitespace-pre-wrap">{{ msg.content }}</p>
            <p class="text-[10px] mt-2 opacity-50">{{ formatTime(msg.created_at) }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

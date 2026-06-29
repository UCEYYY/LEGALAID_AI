<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  session: { type: Object, required: true },
})

const emit = defineEmits(['select', 'delete'])

const menuOpen = ref(false)

const categoryMeta = {
  ketenagakerjaan: { label: 'Ketenagakerjaan', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  konsumen: { label: 'Konsumen', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z' },
  keluarga: { label: 'Keluarga', color: 'bg-pink-50 text-pink-700 border-pink-200', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
  pertanahan: { label: 'Pertanahan', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  pidana: { label: 'Pidana', color: 'bg-red-50 text-red-700 border-red-200', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
  utang_kredit: { label: 'Utang & Kredit', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
}

function getRelativeTime(isoString) {
  if (!isoString) return ''
  const now = new Date()
  const d = new Date(isoString)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return { label: 'Hari ini', className: 'text-royal-600 bg-royal-50' }
  if (diffDays === 1) return { label: 'Kemarin', className: 'text-navy-600 bg-navy-50' }
  if (diffDays <= 3) return { label: `${diffDays} hari lalu`, className: 'text-navy-500 bg-navy-50' }
  return { label: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), className: 'text-navy-400' }
}

const timeInfo = computed(() => getRelativeTime(props.session.updatedAt))
const messageCount = computed(() => props.session.messages.length)
const userMessages = computed(() => props.session.messages.filter(m => m.role === 'user'))
const preview = computed(() => {
  const firstUser = userMessages.value[0]
  return firstUser ? firstUser.content : ''
})

function formatDateShort(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function handleSelect() {
  menuOpen.value = false
  emit('select', props.session.id)
}

function handleDelete() {
  menuOpen.value = false
  emit('delete', props.session.id)
}

function handleDuplicate() {
  menuOpen.value = false
  // Placeholder for duplicate action
}
</script>

<template>
  <div
    class="group relative bg-white rounded-[18px] md:rounded-[20px] border border-gray-100/80 card-shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-lg hover:border-royal-200/60 cursor-pointer active:scale-[0.99]"
    @click="handleSelect"
  >
    <div class="p-4 md:p-5">
      <div class="flex items-start gap-3 md:gap-4">
        <!-- Category Icon -->
        <div class="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-royal-500 to-royal-700 flex items-center justify-center shadow-md shadow-royal-500/20 shrink-0">
          <svg class="w-5 h-5 md:w-5.5 md:h-5.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path :d="categoryMeta[session.category]?.icon || categoryMeta.pidana.icon" />
          </svg>
        </div>

        <div class="flex-1 min-w-0 space-y-2">
          <!-- Title Row -->
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h3 class="font-semibold text-navy-900 text-sm md:text-base leading-snug truncate group-hover:text-royal-700 transition-colors">
                {{ session.title }}
              </h3>
            </div>

            <!-- Three-dot Menu (desktop) -->
            <div class="hidden md:block relative shrink-0" @click.stop>
              <button
                @click="toggleMenu"
                class="w-8 h-8 rounded-xl flex items-center justify-center text-navy-400 hover:text-navy-700 hover:bg-navy-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>
              </button>
              <transition name="pop">
                <div v-if="menuOpen" class="absolute right-0 top-full mt-1 bg-white rounded-2xl shadow-soft-lg border border-gray-100 py-1.5 w-48 z-20">
                  <button @click="handleSelect" class="w-full text-left px-4 py-2.5 text-sm text-navy-700 hover:bg-royal-50 hover:text-royal-700 transition-colors flex items-center gap-2.5">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    Lihat Percakapan
                  </button>
                  <button @click="handleDuplicate" class="w-full text-left px-4 py-2.5 text-sm text-navy-700 hover:bg-royal-50 hover:text-royal-700 transition-colors flex items-center gap-2.5">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                    Duplikat
                  </button>
                  <hr class="border-gray-100 my-1" />
                  <button @click="handleDelete" class="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2.5">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                    Hapus Riwayat
                  </button>
                </div>
              </transition>
            </div>
          </div>

          <!-- Meta Row -->
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-xl text-[11px] font-medium border" :class="categoryMeta[session.category]?.color || 'bg-gray-50 text-gray-600 border-gray-200'">
              {{ categoryMeta[session.category]?.label || session.category }}
            </span>
            <span class="text-xs text-navy-400">{{ messageCount }} pesan</span>
            <span class="text-navy-300 hidden sm:inline">·</span>
            <span class="text-xs text-navy-400 hidden sm:inline">{{ formatDateShort(session.updatedAt) }}</span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-medium" :class="timeInfo.className">
              {{ timeInfo.label }}
            </span>
          </div>

          <!-- Preview -->
          <p v-if="preview" class="text-sm text-navy-500 leading-relaxed line-clamp-2">
            {{ preview }}
          </p>
        </div>
      </div>

      <!-- Mobile Actions -->
      <div class="md:hidden flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <button @click.stop="handleSelect" class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-royal-50 text-royal-700 text-xs font-medium hover:bg-royal-100 transition-colors">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
          Lihat
        </button>
        <button @click.stop="handleDelete" class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
          Hapus
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pop-enter-active, .pop-leave-active { transition: all 0.15s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.95) translateY(-4px); }
</style>

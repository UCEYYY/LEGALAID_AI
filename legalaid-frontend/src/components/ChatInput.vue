<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['send'])
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

const input = ref('')
const inputRef = ref(null)

const charCount = computed(() => input.value.length)
const isOverLimit = computed(() => charCount.value > 2000)
const hasText = computed(() => input.value.trim().length > 0)

onMounted(() => {
  if (inputRef.value) inputRef.value.focus()
})

function handleSubmit() {
  const text = input.value.trim()
  if (!text || props.disabled || isOverLimit.value) return
  emit('send', text)
  input.value = ''
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
    inputRef.value.focus()
  }
}

function onKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSubmit()
  }
}

function adjustHeight(e) {
  const el = e.target
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 150) + 'px'
}
</script>

<template>
  <div class="sticky bottom-0 bg-white border-t border-[#E5E7EB] shadow-[0_-4px_24px_-6px_rgba(0,0,0,0.08)]">
    <div class="max-w-[900px] xl:max-w-[1000px] mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
      <div class="relative bg-white border-2 border-gray-200/90 hover:border-royal-300 focus-within:border-royal-400 rounded-[18px] md:rounded-[20px] transition-all duration-200 shadow-sm focus-within:shadow-md focus-within:shadow-royal-500/10">
        <textarea
          ref="inputRef"
          v-model="input"
          @keydown="onKeydown"
          @input="adjustHeight"
          :disabled="disabled"
          placeholder="Tuliskan pertanyaan hukum Anda secara lengkap..."
          rows="1"
          class="w-full px-[18px] md:px-5 pt-[14px] md:pt-4 pb-[44px] md:pb-[48px] bg-transparent border-0 outline-none resize-none text-sm text-navy-900 placeholder:text-navy-400 disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed"
          style="min-height: 56px; max-height: 150px;"
        />

        <!-- Bottom row: send button right -->
        <div class="absolute bottom-2 left-2 right-2 flex items-center justify-end">
          <button
            @click="handleSubmit"
            :disabled="disabled || !hasText || isOverLimit"
            class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
            :class="!disabled && hasText && !isOverLimit ? 'bg-royal-500 text-white hover:bg-royal-600 hover:shadow-md hover:shadow-royal-500/25 active:scale-95 shadow-sm shadow-royal-500/15' : 'bg-gray-100 text-gray-300 cursor-not-allowed'"
          >
            <svg v-if="!disabled" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32" />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between mt-2 px-1">
        <p class="text-[11px] text-navy-400 flex items-center gap-1">
          <kbd class="px-1.5 py-0.5 rounded-md bg-navy-50 text-navy-500 text-[10px] font-mono border border-navy-100/60">Enter</kbd>
          <span>untuk kirim</span>
          <span class="mx-0.5 text-navy-300">·</span>
          <kbd class="px-1.5 py-0.5 rounded-md bg-navy-50 text-navy-500 text-[10px] font-mono border border-navy-100/60">Shift + Enter</kbd>
          <span>baris baru</span>
        </p>
        <p class="text-[11px]" :class="isOverLimit ? 'text-red-500 font-medium' : 'text-navy-400'">{{ charCount }}/2000</p>
      </div>
    </div>
  </div>
</template>

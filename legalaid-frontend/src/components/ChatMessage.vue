<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})

const copied = ref(false)
const liked = ref(false)
const notHelpful = ref(false)

function copyContent() {
  navigator.clipboard.writeText(props.message.content).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}

function toggleLike() {
  liked.value = !liked.value
  if (notHelpful.value) notHelpful.value = false
}

function toggleNotHelpful() {
  notHelpful.value = !notHelpful.value
  if (liked.value) liked.value = false
}

function regenerate() {
  // Emit regenerate event - placeholder for future
}

function formatTime(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Simple markdown renderer — aman dari XSS, tidak perlu library eksternal
function renderMarkdown(text) {
  if (!text) return ''

  // Escape HTML dulu
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Bold: **teks** atau __teks__
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>')

  // Italic: *teks* atau _teks_
  html = html.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>')
  html = html.replace(/_([^_\n]+?)_/g, '<em>$1</em>')

  // Proses baris per baris
  const lines = html.split('\n')
  const result = []
  let inList = false
  let inOrderedList = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Heading: ## Teks
    if (/^###\s+(.+)/.test(line)) {
      if (inList) { result.push('</ul>'); inList = false }
      if (inOrderedList) { result.push('</ol>'); inOrderedList = false }
      result.push(`<h3 class="font-semibold text-navy-900 mt-3 mb-1">${line.replace(/^###\s+/, '')}</h3>`)
    } else if (/^##\s+(.+)/.test(line)) {
      if (inList) { result.push('</ul>'); inList = false }
      if (inOrderedList) { result.push('</ol>'); inOrderedList = false }
      result.push(`<h2 class="font-bold text-navy-900 mt-4 mb-1.5">${line.replace(/^##\s+/, '')}</h2>`)
    }
    // Unordered list: * item atau - item
    else if (/^[\*\-]\s+(.+)/.test(line)) {
      if (inOrderedList) { result.push('</ol>'); inOrderedList = false }
      if (!inList) { result.push('<ul class="list-disc pl-5 space-y-1 my-1">'); inList = true }
      result.push(`<li>${line.replace(/^[\*\-]\s+/, '')}</li>`)
    }
    // Ordered list: 1. item
    else if (/^\d+\.\s+(.+)/.test(line)) {
      if (inList) { result.push('</ul>'); inList = false }
      if (!inOrderedList) { result.push('<ol class="list-decimal pl-5 space-y-1 my-1">'); inOrderedList = true }
      result.push(`<li>${line.replace(/^\d+\.\s+/, '')}</li>`)
    }
    // Empty line
    else if (line.trim() === '') {
      if (inList) { result.push('</ul>'); inList = false }
      if (inOrderedList) { result.push('</ol>'); inOrderedList = false }
      result.push('<br>')
    }
    // Normal paragraph
    else {
      if (inList) { result.push('</ul>'); inList = false }
      if (inOrderedList) { result.push('</ol>'); inOrderedList = false }
      result.push(`<p class="mb-1">${line}</p>`)
    }
  }

  if (inList) result.push('</ul>')
  if (inOrderedList) result.push('</ol>')

  return result.join('')
}

const renderedContent = computed(() => renderMarkdown(props.message.content))
</script>

<template>
  <div class="flex gap-3 md:gap-4 animate-fade-in-up" :class="message.role === 'user' ? 'flex-row-reverse' : 'flex-row'">
    <!-- Avatar -->
    <div class="shrink-0 mt-1">
      <!-- AI Avatar -->
      <div v-if="message.role === 'assistant'" class="w-9 h-9 rounded-2xl bg-gradient-to-br from-royal-500 to-royal-700 flex items-center justify-center shadow-md shadow-royal-500/20">
        <svg viewBox="0 0 20 20" fill="none" class="w-5 h-5">
          <path d="M10 3L5 6v4c0 4 3 7.5 5 8.5 2-1 5-4.5 5-8.5V6l-5-3z" fill="white" fill-opacity="0.2" stroke="white" stroke-width="0.8" />
          <path d="M7 10l2 2 4-4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <text x="10" y="16" text-anchor="middle" fill="white" font-size="5" font-weight="700">AI</text>
        </svg>
      </div>
      <!-- User Avatar -->
      <div v-else class="w-9 h-9 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center shadow-md shadow-navy-500/20">
        <span class="text-white text-sm font-bold">S</span>
      </div>
    </div>

    <!-- Message Content -->
    <div class="max-w-[85%] md:max-w-[75%] space-y-1.5" :class="message.role === 'user' ? 'items-end' : 'items-start'">
      <!-- Bubble -->
      <div
        class="rounded-3xl px-5 py-3.5 leading-relaxed"
        :class="message.role === 'user'
          ? 'bg-royal-500 text-white shadow-md shadow-royal-500/20 rounded-br-md'
          : 'bg-white text-navy-900 border border-gray-100/80 shadow-sm rounded-bl-md'"
      >
        <div v-if="message.role === 'assistant' && !message.content && message.isStreaming" class="flex items-center gap-2 py-1">
          <div class="flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-royal-400" style="animation: dotPulse 1.4s infinite ease-in-out" />
            <span class="w-2 h-2 rounded-full bg-royal-400" style="animation: dotPulse 1.4s infinite ease-in-out; animation-delay: 0.2s" />
            <span class="w-2 h-2 rounded-full bg-royal-400" style="animation: dotPulse 1.4s infinite ease-in-out; animation-delay: 0.4s" />
          </div>
          <span class="text-xs text-navy-400 ml-2">LegalAid AI sedang menganalisis regulasi...</span>
        </div>
        <div v-else-if="message.role === 'assistant'" class="text-sm prose-sm leading-relaxed" v-html="renderedContent" />
        <div v-else class="text-sm whitespace-pre-wrap">
          {{ message.content }}
        </div>
      </div>

      <!-- Timestamp -->
      <div class="flex items-center gap-1 px-1" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
        <span class="text-[11px] text-navy-400">{{ formatTime(message.timestamp) }}</span>
      </div>

      <!-- Action Buttons (only for AI responses) -->
      <div
        v-if="message.role === 'assistant' && !message.isStreaming && message.content"
        class="flex items-center gap-1 px-1"
        :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <button
          @click="copyContent"
          class="w-7 h-7 rounded-xl flex items-center justify-center text-navy-400 hover:text-royal-600 hover:bg-royal-50 transition-all duration-200"
          :title="copied ? 'Tersalin' : 'Salin jawaban'"
        >
          <svg v-if="copied" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
        </button>
        <button
          @click="toggleLike"
          class="w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200"
          :class="liked ? 'text-royal-600 bg-royal-50' : 'text-navy-400 hover:text-royal-600 hover:bg-royal-50'"
          title="Sukai jawaban ini"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
          </svg>
        </button>
        <button
          @click="toggleNotHelpful"
          class="w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200"
          :class="notHelpful ? 'text-red-500 bg-red-50' : 'text-navy-400 hover:text-red-500 hover:bg-red-50'"
          title="Tidak membantu"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z" />
          </svg>
        </button>
        <button
          @click="regenerate"
          class="w-7 h-7 rounded-xl flex items-center justify-center text-navy-400 hover:text-royal-600 hover:bg-royal-50 transition-all duration-200"
          title="Regenerasi jawaban"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes dotPulse {
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(0.7);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

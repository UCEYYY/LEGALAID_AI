<script setup>
import { EXAMPLE_QUESTIONS } from '../utils/helpers'

defineProps({
  category: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['select'])

function handleSelect(question) {
  emit('select', question)
}
</script>

<template>
  <div class="space-y-3">
    <p class="text-xs text-gray-400 font-medium tracking-wide uppercase">Contoh pertanyaan</p>
    <div class="flex flex-wrap gap-2 justify-center">
      <button
        v-for="(q, i) in EXAMPLE_QUESTIONS[category] || []"
        :key="i"
        @click="handleSelect(q)"
        class="text-sm bg-white hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 text-gray-600 px-4 py-2.5 rounded-xl border border-gray-200/80 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.97]"
      >
        {{ q }}
      </button>
    </div>
  </div>
</template>

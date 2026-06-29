<script setup>
import { ref } from 'vue'

const props = defineProps({
  compact: {
    type: Boolean,
    default: false,
  },
})

const visible = ref(true)

function dismiss() {
  visible.value = false
}
</script>

<template>
  <transition name="slide-down">
    <div v-if="visible" class="rounded-3xl bg-gold-50/90 backdrop-blur-sm border border-gold-200/60 card-shadow">
      <div class="flex gap-4 p-5 md:p-6">
        <div class="w-10 h-10 rounded-2xl bg-gold-100 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-gold-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gold-800">Penting untuk diketahui</p>
          <p class="text-sm text-gold-700 mt-1.5 leading-relaxed">
            LegalAid AI adalah asisten informasi hukum berbasis AI dan <strong>bukan pengganti advokat atau pengacara</strong>.
            Informasi yang diberikan bersifat informatif dan edukatif berdasarkan regulasi Indonesia,
            <strong>bukan merupakan nasihat hukum yang mengikat</strong>.
            Untuk kasus yang kompleks, konsultasikan dengan pengacara atau Lembaga Bantuan Hukum (LBH) terdekat.
          </p>
          <p v-if="!compact" class="text-sm text-gold-700 mt-2 leading-relaxed">
            Selalu verifikasi informasi hukum terkini melalui
            <a href="https://jdih.kemenkumham.go.id" target="_blank" class="font-medium underline underline-offset-2 text-gold-800 hover:text-gold-900 transition-colors">JDIH Kemenkumham</a>.
          </p>
        </div>
        <button
          @click="dismiss"
          class="w-8 h-8 rounded-xl flex items-center justify-center text-gold-400 hover:text-gold-600 hover:bg-gold-100 transition-all shrink-0"
          aria-label="Tutup"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

async function handleLogin() {
  error.value = ''
  isLoading.value = true

  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 shadow-lg mb-4">
          <svg viewBox="0 0 44 44" fill="none" class="w-9 h-9">
            <path d="M22 8L12 13v6c0 6.5 4.5 12.5 10 14 5.5-1.5 10-7.5 10-14v-6L22 8z" fill="white" fill-opacity="0.15" stroke="white" stroke-width="1.2" />
            <path d="M17 22l3 3 6-6" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-navy-900">Masuk ke LegalAid AI</h1>
        <p class="text-sm text-navy-500 mt-1">Konsultasi hukum berbasis AI untuk masyarakat Indonesia</p>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-3xl p-6 md:p-8 border border-gray-100/80 card-shadow">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Error -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-center gap-3">
            <svg class="w-5 h-5 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-navy-700 mb-1.5">Email</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="nama@email.com"
              class="w-full px-4 py-3 rounded-2xl border border-gray-200/80 bg-[#F8FAFC] text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 transition-all"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-navy-700 mb-1.5">Password</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="Masukkan password"
              class="w-full px-4 py-3 rounded-2xl border border-gray-200/80 bg-[#F8FAFC] text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 transition-all"
            />
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 rounded-2xl bg-royal-500 text-white font-semibold text-sm shadow-lg shadow-royal-500/25 hover:bg-royal-600 hover:shadow-xl hover:shadow-royal-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span v-if="isLoading">Memproses...</span>
            <span v-else>Masuk</span>
          </button>
        </form>
      </div>

      <!-- Register Link -->
      <p class="text-center text-sm text-navy-500 mt-6">
        Belum punya akun?
        <RouterLink to="/register" class="text-royal-600 hover:text-royal-700 font-semibold">Daftar sekarang</RouterLink>
      </p>
    </div>
  </div>
</template>

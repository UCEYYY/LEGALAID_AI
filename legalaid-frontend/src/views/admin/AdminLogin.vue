<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { adminLogin } from '../../services/adminApi'

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
    const data = await adminLogin(email.value, password.value)
    authStore.setAuth(data.token, data.user)
    router.push('/admin/dashboard')
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-navy-950 flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-royal-500 to-royal-700 shadow-lg mb-4">
          <svg viewBox="0 0 44 44" fill="none" class="w-9 h-9">
            <path d="M22 8L12 13v6c0 6.5 4.5 12.5 10 14 5.5-1.5 10-7.5 10-14v-6L22 8z" fill="white" fill-opacity="0.15" stroke="white" stroke-width="1.2" />
            <path d="M17 22l3 3 6-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white">Admin Panel</h1>
        <p class="text-sm text-navy-400 mt-1">LegalAid AI Management</p>
      </div>

      <div class="bg-navy-900 rounded-3xl p-6 border border-navy-800">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div v-if="error" class="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
            <p class="text-sm text-red-400">{{ error }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-navy-300 mb-1.5">Email Admin</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="admin@legalaid.ai"
              class="w-full px-4 py-3 rounded-2xl border border-navy-700 bg-navy-800 text-sm text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-royal-500/30 focus:border-royal-500 transition-all"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-navy-300 mb-1.5">Password</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="Masukkan password"
              class="w-full px-4 py-3 rounded-2xl border border-navy-700 bg-navy-800 text-sm text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-royal-500/30 focus:border-royal-500 transition-all"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 rounded-2xl bg-royal-500 text-white font-semibold text-sm hover:bg-royal-600 active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            <span v-if="isLoading">Memproses...</span>
            <span v-else>Masuk</span>
          </button>
        </form>
      </div>

      <p class="text-center text-sm text-navy-500 mt-6">
        <router-link to="/" class="text-navy-400 hover:text-white transition-colors">Kembali ke beranda</router-link>
      </p>
    </div>
  </div>
</template>

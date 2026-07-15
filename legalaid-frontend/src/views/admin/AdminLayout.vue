<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute, RouterView, RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'Pengguna', to: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
  { label: 'Sesi Konsultasi', to: '/admin/sessions', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { label: 'Kategori', to: '/admin/categories', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { label: 'FAQ', to: '/admin/faq', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
]

function isActive(item) {
  return route.path.startsWith(item.to)
}

function handleLogout() {
  authStore.logout()
  router.push('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-navy-950 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-navy-900 border-r border-navy-800 flex flex-col shrink-0">
      <!-- Logo -->
      <div class="p-5 border-b border-navy-800">
        <router-link to="/admin/dashboard" class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-royal-500 flex items-center justify-center">
            <svg viewBox="0 0 44 44" fill="none" class="w-5 h-5">
              <path d="M22 8L12 13v6c0 6.5 4.5 12.5 10 14 5.5-1.5 10-7.5 10-14v-6L22 8z" fill="white" fill-opacity="0.3" stroke="white" stroke-width="1.5" />
            </svg>
          </div>
          <div>
            <span class="font-bold text-sm text-white">LegalAid AI</span>
            <p class="text-[10px] text-navy-400">Admin Panel</p>
          </div>
        </router-link>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-3 space-y-1">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          :class="isActive(item) ? 'bg-royal-500/10 text-royal-400' : 'text-navy-400 hover:text-white hover:bg-navy-800'"
        >
          <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path :d="item.icon" />
          </svg>
          {{ item.label }}
        </router-link>
      </nav>

      <!-- Footer -->
      <div class="p-3 border-t border-navy-800 space-y-2">
        <router-link to="/" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-navy-400 hover:text-white hover:bg-navy-800 transition-all">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          Lihat Website
        </router-link>
        <button @click="handleLogout" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-navy-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Keluar
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 min-w-0 overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useChatStore } from '../stores/chatStore'
import { CATEGORY_LABELS } from '../utils/helpers'

const router = useRouter()
const route = useRoute()
const chatStore = useChatStore()
const mobileMenuOpen = ref(false)
const scrolled = ref(false)

const isChatPage = computed(() => route.path === '/chat')
const currentCategoryLabel = computed(() => CATEGORY_LABELS[chatStore.category] || '')
const hasCategory = computed(() => !!chatStore.category)

const categoryIcons = {
  ketenagakerjaan: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  konsumen: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z',
  keluarga: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
  pertanahan: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  pidana: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
  utang_kredit: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
}

function handleScroll() {
  scrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const menuItems = [
  { label: 'Beranda', href: '/', isRoute: true },
  { label: 'Kategori Hukum', href: '#kategori', isRoute: false },
  { label: 'Tentang', href: '#tentang', isRoute: false },
  { label: 'FAQ', href: '#faq', isRoute: false },
  { label: 'Riwayat Konsultasi', href: '/history', isRoute: true },
]

function navigate(item) {
  if (item.isRoute) {
    router.push(item.href)
  } else {
    const el = document.querySelector(item.href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push('/')
      setTimeout(() => {
        const target = document.querySelector(item.href)
        if (target) target.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }
  mobileMenuOpen.value = false
}

function isActive(item) {
  if (item.isRoute) {
    return route.path === item.href
  }
  return false
}

function goHome() {
  router.push('/')
}

function handleChangeCategory() {
  router.push('/')
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="scrolled || isChatPage ? 'bg-white/85 backdrop-blur-xl shadow-soft border-b border-gray-100/50' : 'bg-transparent'"
    :style="{ height: isChatPage ? '64px' : '72px' }"
  >
    <div class="h-full container-wide flex items-center justify-between">
      <!-- Left: Logo -->
      <div class="flex items-center gap-3">
        <button
          @click="router.push('/')"
          class="flex items-center gap-2.5 group shrink-0"
        >
          <div class="relative w-9 h-9">
            <svg viewBox="0 0 44 44" fill="none" class="w-full h-full">
              <defs>
                <linearGradient id="headerLogo" x1="0" y1="0" x2="44" y2="44">
                  <stop offset="0%" stop-color="#1e3a8a" />
                  <stop offset="100%" stop-color="#0F172A" />
                </linearGradient>
              </defs>
              <rect width="44" height="44" rx="12" fill="url(#headerLogo)" />
              <path d="M22 8L12 13v6c0 6.5 4.5 12.5 10 14 5.5-1.5 10-7.5 10-14v-6L22 8z" fill="white" fill-opacity="0.15" stroke="white" stroke-width="1.2" />
              <path d="M17 22l3 3 6-6" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="31" cy="13" r="2.5" fill="#F59E0B" fill-opacity="0.9" />
              <text x="22" y="39" text-anchor="middle" fill="white" font-size="6" font-weight="700" font-family="Inter">AI</text>
            </svg>
          </div>
          <div class="hidden sm:block">
            <span class="font-bold text-base text-navy-900 tracking-tight">LegalAid AI</span>
          </div>
        </button>

        <!-- Category badge on chat page -->
        <div v-if="isChatPage && hasCategory" class="hidden md:flex items-center gap-2 ml-2 pl-3 border-l border-gray-200">
          <div class="w-7 h-7 rounded-xl bg-royal-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-royal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path :d="categoryIcons[chatStore.category]" />
            </svg>
          </div>
          <span class="text-sm font-medium text-navy-900">{{ currentCategoryLabel }}</span>
        </div>
      </div>

      <!-- Right: Navigation + Ganti Kategori -->
      <div class="flex items-center gap-2">
        <nav class="hidden lg:flex items-center gap-1">
          <button
            v-for="item in menuItems"
            :key="item.label"
            @click="navigate(item)"
            class="px-3 py-1.5 rounded-2xl text-sm font-medium transition-all duration-200"
            :class="isActive(item) ? 'text-royal-600 bg-royal-50' : 'text-navy-500 hover:text-navy-900 hover:bg-navy-50'"
          >
            {{ item.label }}
          </button>
        </nav>

        <button
          v-if="isChatPage && hasCategory"
          @click="handleChangeCategory"
          class="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl border-2 border-navy-200 text-navy-500 font-medium text-xs hover:bg-navy-50 hover:border-royal-300 hover:text-royal-700 transition-all duration-200 ml-1"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
          </svg>
          Ganti Kategori
        </button>

        <!-- Mobile hamburger -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="lg:hidden w-9 h-9 rounded-2xl flex items-center justify-center text-navy-500 hover:bg-navy-50 transition-colors"
          aria-label="Toggle menu"
        >
          <svg v-if="!mobileMenuOpen" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
          <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-[-8px]"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-[-8px]"
    >
      <div v-if="mobileMenuOpen" class="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl shadow-soft-lg">
        <div class="container-wide py-3 space-y-1">
          <button
            v-for="item in menuItems"
            :key="item.label"
            @click="navigate(item)"
            class="block w-full text-left px-4 py-2.5 rounded-2xl text-sm font-medium transition-all"
            :class="isActive(item) ? 'text-royal-600 bg-royal-50' : 'text-navy-500 hover:bg-navy-50 hover:text-navy-900'"
          >
            {{ item.label }}
          </button>
          <button
            v-if="isChatPage"
            @click="handleChangeCategory"
            class="block w-full text-left px-4 py-2.5 rounded-2xl text-sm font-medium text-navy-500 hover:bg-navy-50 transition-all"
          >
            Ganti Kategori
          </button>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { CATEGORIES } from '../utils/helpers'

const router = useRouter()
</script>

<template>
  <footer class="bg-navy-900 text-navy-200">
    <div class="container-wide pt-16 pb-8">
      <div class="grid lg:grid-cols-12 gap-10 lg:gap-8">
        <!-- Logo & Description -->
        <div class="lg:col-span-4">
          <button @click="router.push('/')" class="flex items-center gap-3 group mb-4">
            <div class="relative w-10 h-10">
              <svg viewBox="0 0 44 44" fill="none" class="w-full h-full">
                <defs>
                  <linearGradient id="logoBgDark" x1="0" y1="0" x2="44" y2="44">
                    <stop offset="0%" stop-color="#2563EB" />
                    <stop offset="100%" stop-color="#1e3a5f" />
                  </linearGradient>
                </defs>
                <rect width="44" height="44" rx="12" fill="url(#logoBgDark)" />
                <path d="M22 8L12 13v6c0 6.5 4.5 12.5 10 14 5.5-1.5 10-7.5 10-14v-6L22 8z" fill="white" fill-opacity="0.15" stroke="white" stroke-width="1.2" />
                <path d="M17 22l3 3 6-6" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="31" cy="13" r="2.5" fill="#F59E0B" fill-opacity="0.9" />
                <text x="22" y="39" text-anchor="middle" fill="white" font-size="6" font-weight="700" font-family="Inter">AI</text>
              </svg>
            </div>
            <div>
              <span class="font-bold text-lg text-white tracking-tight">LegalAid AI</span>
              <span class="text-[10px] text-navy-400 block leading-none -mt-0.5">Konsultasi Hukum Digital</span>
            </div>
          </button>
          <p class="text-sm text-navy-400 leading-relaxed max-w-sm">
            Platform konsultasi hukum berbasis AI untuk masyarakat Indonesia. 
            Dapatkan informasi hukum yang jelas, cepat, dan terpercaya secara gratis.
          </p>
          <div class="flex items-center gap-3 mt-5">
            <a href="#" class="w-9 h-9 rounded-xl bg-navy-800 hover:bg-navy-700 flex items-center justify-center transition-all duration-200 group" aria-label="Twitter">
              <svg class="w-4 h-4 text-navy-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-xl bg-navy-800 hover:bg-navy-700 flex items-center justify-center transition-all duration-200 group" aria-label="Instagram">
              <svg class="w-4 h-4 text-navy-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-xl bg-navy-800 hover:bg-navy-700 flex items-center justify-center transition-all duration-200 group" aria-label="LinkedIn">
              <svg class="w-4 h-4 text-navy-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-xl bg-navy-800 hover:bg-navy-700 flex items-center justify-center transition-all duration-200 group" aria-label="YouTube">
              <svg class="w-4 h-4 text-navy-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Navigation -->
        <div class="lg:col-span-2">
          <h3 class="font-semibold text-white text-sm mb-4">Navigasi</h3>
          <ul class="space-y-3">
            <li><button @click="router.push('/')" class="text-sm text-navy-400 hover:text-white transition-colors">Beranda</button></li>
            <li><a href="#kategori" class="text-sm text-navy-400 hover:text-white transition-colors">Kategori Hukum</a></li>
            <li><a href="#tentang" class="text-sm text-navy-400 hover:text-white transition-colors">Tentang</a></li>
            <li><a href="#faq" class="text-sm text-navy-400 hover:text-white transition-colors">FAQ</a></li>
            <li><button @click="router.push('/history')" class="text-sm text-navy-400 hover:text-white transition-colors">Riwayat Konsultasi</button></li>
          </ul>
        </div>

        <!-- Categories -->
        <div class="lg:col-span-3">
          <h3 class="font-semibold text-white text-sm mb-4">Kategori Hukum</h3>
          <ul class="space-y-3">
            <li v-for="cat in CATEGORIES" :key="cat.id">
              <button
                @click="router.push('/chat')"
                class="text-sm text-navy-400 hover:text-white transition-colors"
              >
                {{ cat.label }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="lg:col-span-3">
          <h3 class="font-semibold text-white text-sm mb-4">Kontak & Informasi</h3>
          <ul class="space-y-3">
            <li class="flex items-start gap-3 text-sm text-navy-400">
              <svg class="w-4 h-4 mt-0.5 shrink-0 text-navy-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>hello@legalaid.ai</span>
            </li>
            <li class="flex items-start gap-3 text-sm text-navy-400">
              <svg class="w-4 h-4 mt-0.5 shrink-0 text-navy-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Jakarta, Indonesia</span>
            </li>
            <li class="flex items-start gap-3 text-sm text-navy-400">
              <svg class="w-4 h-4 mt-0.5 shrink-0 text-navy-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span>+62 21 1234 5678</span>
            </li>
            <li class="flex items-start gap-3 text-sm text-navy-400">
              <svg class="w-4 h-4 mt-0.5 shrink-0 text-navy-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Terintegrasi dengan <a href="https://jdih.kemenkumham.go.id" target="_blank" class="text-royal-400 hover:text-royal-300 underline underline-offset-2">JDIH Kemenkumham</a></span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-navy-800 mt-12 pt-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-xs text-navy-500">
            &copy; {{ new Date().getFullYear() }} LegalAid AI. Bukan pengganti pengacara. Selalu konsultasikan kasus spesifik dengan profesional hukum.
          </p>
          <div class="flex items-center gap-4">
            <a href="#" class="text-xs text-navy-500 hover:text-navy-300 transition-colors">Kebijakan Privasi</a>
            <a href="#" class="text-xs text-navy-500 hover:text-navy-300 transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

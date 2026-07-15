<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import { useAuthStore } from './stores/authStore'

const route = useRoute()
const authStore = useAuthStore()
const isChatPage = computed(() => route.path === '/chat')
const isAdminPage = computed(() => route.path.startsWith('/admin'))

onMounted(() => {
  if (authStore.isAuthenticated) {
    authStore.fetchProfile()
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F8FAFC]">
    <AppHeader v-if="!isAdminPage" />
    <main class="flex-1" :class="isAdminPage ? '' : 'pt-16'">
      <router-view />
    </main>
    <AppFooter v-if="!isChatPage && !isAdminPage" />
  </div>
</template>

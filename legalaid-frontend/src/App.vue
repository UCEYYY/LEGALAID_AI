<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

const route = useRoute()
const isChatPage = computed(() => route.path === '/chat')
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F8FAFC]">
    <AppHeader />
    <main class="flex-1 pt-16">
      <router-view />
    </main>
    <AppFooter v-if="!isChatPage" />
  </div>
</template>

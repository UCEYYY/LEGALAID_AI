<script setup>
defineProps({
  category: {
    type: Object,
    required: true,
  },
})

const icons = {
  briefcase: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'shopping-cart': 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z',
  users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  scale: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
  'credit-card': 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
}
</script>

<template>
  <button
    class="group relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-600/10 transition-all duration-300 text-left w-full active:scale-[0.98]"
  >
    <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-50/0 to-primary-50/0 group-hover:from-primary-50/60 group-hover:to-primary-50/30 transition-all duration-300 pointer-events-none" />

    <div class="relative flex items-start gap-4">
      <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0 shadow-md shadow-primary-600/20 group-hover:shadow-lg group-hover:shadow-primary-600/30 transition-all duration-300">
        <svg class="w-5.5 h-5.5 text-white" style="width: 1.375rem; height: 1.375rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path :d="icons[category.icon]" />
        </svg>
      </div>
      <div class="min-w-0 flex-1">
        <h3 class="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
          {{ category.label }}
        </h3>
        <p class="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">
          {{ category.description }}
        </p>
      </div>
      <div class="shrink-0 flex items-center mt-1">
        <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary-50 group-hover:translate-x-0.5 transition-all duration-300">
          <svg class="w-4 h-4 text-gray-300 group-hover:text-primary-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </div>
  </button>
</template>

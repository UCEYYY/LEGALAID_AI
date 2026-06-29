import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/ChatPage.vue'),
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/HistoryPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterPage.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/ChatPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/HistoryPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/admin/AdminLogin.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('../views/admin/AdminDashboard.vue') },
      { path: 'users', name: 'AdminUsers', component: () => import('../views/admin/AdminUsers.vue') },
      { path: 'users/:id', name: 'AdminUserDetail', component: () => import('../views/admin/AdminUserDetail.vue') },
      { path: 'sessions', name: 'AdminSessions', component: () => import('../views/admin/AdminSessions.vue') },
      { path: 'sessions/:id', name: 'AdminSessionDetail', component: () => import('../views/admin/AdminSessionDetail.vue') },
      { path: 'categories', name: 'AdminCategories', component: () => import('../views/admin/AdminCategories.vue') },
      { path: 'faq', name: 'AdminFaq', component: () => import('../views/admin/AdminFaq.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next('/')
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    if (to.path === '/admin/login' && authStore.isAdmin) {
      return next('/admin/dashboard')
    }
    return next('/')
  }

  next()
})

export default router

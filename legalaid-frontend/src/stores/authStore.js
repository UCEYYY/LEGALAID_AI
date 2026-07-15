import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_BASE = '/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('legalaid_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('legalaid_user') || 'null'))

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userName = computed(() => user.value?.name || '')

  function setAuth(tokenValue, userValue) {
    token.value = tokenValue
    user.value = userValue
    localStorage.setItem('legalaid_token', tokenValue)
    localStorage.setItem('legalaid_user', JSON.stringify(userValue))
  }

  function clearAuth() {
    token.value = null
    user.value = null
    localStorage.removeItem('legalaid_token')
    localStorage.removeItem('legalaid_user')
  }

  async function register(name, email, password) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || 'Registrasi gagal.')

    setAuth(data.data.token, data.data.user)
    return data.data
  }

  async function login(email, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || 'Login gagal.')

    setAuth(data.data.token, data.data.user)
    return data.data
  }

  async function fetchProfile() {
    if (!token.value) return

    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })

      if (!response.ok) {
        clearAuth()
        return
      }

      const data = await response.json()
      user.value = data.data.user
      localStorage.setItem('legalaid_user', JSON.stringify(data.data.user))
    } catch {
      clearAuth()
    }
  }

  function logout() {
    clearAuth()
  }

  function getAuthHeaders() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    userName,
    register,
    login,
    logout,
    fetchProfile,
    getAuthHeaders,
  }
})

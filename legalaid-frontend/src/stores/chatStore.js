import { defineStore } from 'pinia'

const SESSION_KEY = 'legalaid_chat_session'

function loadFromSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore parse errors
  }
  return null
}

function saveToSession(category, messages) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ category, messages }))
  } catch {
    // ignore storage errors
  }
}

function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
}

const saved = loadFromSession()

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: saved?.messages || [],
    category: saved?.category || null,
    isLoading: false,
    disclaimerShown: false,
  }),
  getters: {
    currentCategoryLabel(state) {
      const labels = {
        ketenagakerjaan: 'Ketenagakerjaan',
        konsumen: 'Konsumen',
        keluarga: 'Keluarga',
        pertanahan: 'Pertanahan',
        pidana: 'Pidana',
        utang_kredit: 'Utang & Kredit',
      }
      return labels[state.category] || ''
    },
    hasMessages(state) {
      return state.messages.length > 0
    },
  },
  actions: {
    setCategory(category) {
      this.category = category
      saveToSession(this.category, this.messages)
    },
    addMessage(message) {
      this.messages.push(message)
      saveToSession(this.category, this.messages)
    },
    setLoading(value) {
      this.isLoading = value
    },
    setDisclaimerShown(value) {
      this.disclaimerShown = value
    },
    resetChat() {
      this.messages = []
      this.disclaimerShown = false
      saveToSession(this.category, this.messages)
    },
    fullReset() {
      this.messages = []
      this.category = null
      this.isLoading = false
      this.disclaimerShown = false
      clearSession()
    },
  },
})

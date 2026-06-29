import { defineStore } from 'pinia'
import { generateId } from '../utils/helpers'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    sessions: [],
  }),
  getters: {
    sortedSessions(state) {
      return [...state.sessions].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      )
    },
    sessionCount(state) {
      return state.sessions.length
    },
  },
  actions: {
    saveSession(category, messages) {
      if (messages.length === 0) return

      const labels = {
        ketenagakerjaan: 'Ketenagakerjaan',
        konsumen: 'Konsumen',
        keluarga: 'Keluarga',
        pertanahan: 'Pertanahan',
        pidana: 'Pidana',
        utang_kredit: 'Utang & Kredit',
      }

      const now = new Date().toISOString()
      const session = {
        id: generateId(),
        category,
        title: `Konsultasi ${labels[category] || category} - ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
        messages: [...messages],
        createdAt: now,
        updatedAt: now,
      }

      this.sessions.unshift(session)
    },

    deleteSession(sessionId) {
      this.sessions = this.sessions.filter((s) => s.id !== sessionId)
    },

    deleteAllSessions() {
      this.sessions = []
    },

    getSession(sessionId) {
      return this.sessions.find((s) => s.id === sessionId)
    },
  },
  persist: true,
})

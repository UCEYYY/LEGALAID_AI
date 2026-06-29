import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [],
    category: null,
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
    },
    addMessage(message) {
      this.messages.push(message)
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
    },
    fullReset() {
      this.messages = []
      this.category = null
      this.isLoading = false
      this.disclaimerShown = false
    },
  },
})

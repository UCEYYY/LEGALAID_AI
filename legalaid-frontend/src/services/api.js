// Di development: proxy via Vite ke localhost:3000
// Di production: backend serve frontend langsung, jadi cukup '/api'
const API_BASE = '/api'

export async function sendChatMessage(category, messages, userMessage) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      category,
      messages: messages.slice(-20),
      userMessage,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.error?.message || 'Terjadi kesalahan. Silakan coba lagi.'
    )
  }

  return response.json()
}

export async function checkHealth() {
  const response = await fetch(`${API_BASE}/health`)
  return response.json()
}

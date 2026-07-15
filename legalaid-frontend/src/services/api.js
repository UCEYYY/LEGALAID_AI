const API_BASE = '/api'

function getAuthHeaders() {
  const token = localStorage.getItem('legalaid_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function sendChatMessage(category, messages, userMessage, sessionId = null) {
  const body = {
    category,
    messages: messages.slice(-20),
    userMessage,
  }
  if (sessionId) body.sessionId = sessionId

  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
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

export async function fetchSessions(page = 1, limit = 10) {
  const response = await fetch(`${API_BASE}/sessions?page=${page}&limit=${limit}`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error('Gagal mengambil riwayat.')
  return response.json()
}

export async function createSession(categorySlug, title) {
  const response = await fetch(`${API_BASE}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ categorySlug, title }),
  })
  if (!response.ok) throw new Error('Gagal membuat sesi.')
  return response.json()
}

export async function fetchSession(id) {
  const response = await fetch(`${API_BASE}/sessions/${id}`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error('Gagal mengambil sesi.')
  return response.json()
}

export async function deleteSession(id) {
  const response = await fetch(`${API_BASE}/sessions/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error('Gagal menghapus sesi.')
  return response.json()
}

export async function addMessages(sessionId, messages) {
  const response = await fetch(`${API_BASE}/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ messages }),
  })
  if (!response.ok) throw new Error('Gagal menyimpan pesan.')
  return response.json()
}

const API_BASE = '/api'

function getAuthHeaders() {
  const token = localStorage.getItem('legalaid_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function adminLogin(email, password) {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || 'Login admin gagal.')
  return data.data
}

export async function getStats() {
  const response = await fetch(`${API_BASE}/admin/stats`, { headers: getAuthHeaders() })
  if (!response.ok) throw new Error('Gagal mengambil statistik.')
  return response.json()
}

export async function getUsers(page = 1, limit = 10, search = '') {
  const params = new URLSearchParams({ page, limit, search })
  const response = await fetch(`${API_BASE}/admin/users?${params}`, { headers: getAuthHeaders() })
  if (!response.ok) throw new Error('Gagal mengambil data pengguna.')
  return response.json()
}

export async function getUserDetail(id) {
  const response = await fetch(`${API_BASE}/admin/users/${id}`, { headers: getAuthHeaders() })
  if (!response.ok) throw new Error('Gagal mengambil detail pengguna.')
  return response.json()
}

export async function deleteUser(id) {
  const response = await fetch(`${API_BASE}/admin/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error('Gagal menghapus pengguna.')
  return response.json()
}

export async function getSessions(page = 1, limit = 10) {
  const params = new URLSearchParams({ page, limit })
  const response = await fetch(`${API_BASE}/admin/sessions?${params}`, { headers: getAuthHeaders() })
  if (!response.ok) throw new Error('Gagal mengambil sesi.')
  return response.json()
}

export async function getSessionDetail(id) {
  const response = await fetch(`${API_BASE}/admin/sessions/${id}`, { headers: getAuthHeaders() })
  if (!response.ok) throw new Error('Gagal mengambil detail sesi.')
  return response.json()
}

export async function getCategories() {
  const response = await fetch(`${API_BASE}/admin/categories`, { headers: getAuthHeaders() })
  if (!response.ok) throw new Error('Gagal mengambil kategori.')
  return response.json()
}

export async function createCategory(data) {
  const response = await fetch(`${API_BASE}/admin/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Gagal membuat kategori.')
  return response.json()
}

export async function updateCategory(id, data) {
  const response = await fetch(`${API_BASE}/admin/categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Gagal memperbarui kategori.')
  return response.json()
}

export async function deleteCategory(id) {
  const response = await fetch(`${API_BASE}/admin/categories/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error('Gagal menghapus kategori.')
  return response.json()
}

export async function getFaq() {
  const response = await fetch(`${API_BASE}/admin/faq`, { headers: getAuthHeaders() })
  if (!response.ok) throw new Error('Gagal mengambil FAQ.')
  return response.json()
}

export async function createFaq(data) {
  const response = await fetch(`${API_BASE}/admin/faq`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Gagal membuat FAQ.')
  return response.json()
}

export async function updateFaq(id, data) {
  const response = await fetch(`${API_BASE}/admin/faq/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Gagal memperbarui FAQ.')
  return response.json()
}

export async function deleteFaq(id) {
  const response = await fetch(`${API_BASE}/admin/faq/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error('Gagal menghapus FAQ.')
  return response.json()
}

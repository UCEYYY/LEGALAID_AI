<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getUsers, deleteUser } from '../../services/adminApi'

const router = useRouter()
const users = ref([])
const pagination = ref({ page: 1, limit: 10, total: 0, totalPages: 0 })
const search = ref('')
const isLoading = ref(true)

onMounted(() => loadUsers())

async function loadUsers(page = 1) {
  isLoading.value = true
  try {
    const result = await getUsers(page, 10, search.value)
    users.value = result.data.users
    pagination.value = result.data.pagination
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

function handleSearch() {
  loadUsers(1)
}

async function handleDelete(user) {
  if (!confirm(`Hapus pengguna "${user.name}"? Semua sesi konsultasi juga akan dihapus.`)) return
  try {
    await deleteUser(user.id)
    loadUsers(pagination.value.page)
  } catch (e) {
    alert(e.message)
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="p-6 md:p-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Pengguna</h1>
        <p class="text-sm text-navy-400 mt-1">Kelola semua pengguna terdaftar</p>
      </div>
      <span class="text-sm text-navy-400">{{ pagination.total }} pengguna</span>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <form @submit.prevent="handleSearch" class="flex gap-3">
        <input
          v-model="search"
          type="text"
          placeholder="Cari nama atau email..."
          class="flex-1 px-4 py-2.5 rounded-xl border border-navy-700 bg-navy-800 text-sm text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-royal-500/30 transition-all"
        />
        <button type="submit" class="px-4 py-2.5 rounded-xl bg-royal-500 text-white text-sm font-medium hover:bg-royal-600 transition-all">Cari</button>
      </form>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <div class="w-6 h-6 border-2 border-royal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>

    <div v-else-if="users.length === 0" class="text-center py-12 text-navy-500 text-sm">Tidak ada pengguna ditemukan</div>

    <div v-else class="bg-navy-900 rounded-2xl border border-navy-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-navy-800">
              <th class="text-left px-5 py-3 text-navy-400 font-medium">Nama</th>
              <th class="text-left px-5 py-3 text-navy-400 font-medium">Email</th>
              <th class="text-left px-5 py-3 text-navy-400 font-medium">Terdaftar</th>
              <th class="text-right px-5 py-3 text-navy-400 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-b border-navy-800/50 hover:bg-navy-800/30 transition-colors">
              <td class="px-5 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-royal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">{{ user.name.charAt(0).toUpperCase() }}</div>
                  <span class="text-white font-medium">{{ user.name }}</span>
                </div>
              </td>
              <td class="px-5 py-3 text-navy-300">{{ user.email }}</td>
              <td class="px-5 py-3 text-navy-400">{{ formatDate(user.created_at) }}</td>
              <td class="px-5 py-3 text-right">
                <router-link :to="`/admin/users/${user.id}`" class="text-royal-400 hover:text-royal-300 text-xs font-medium mr-3">Detail</router-link>
                <button @click="handleDelete(user)" class="text-red-400 hover:text-red-300 text-xs font-medium">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="flex justify-center gap-2 mt-6">
      <button
        v-for="p in pagination.totalPages"
        :key="p"
        @click="loadUsers(p)"
        class="w-9 h-9 rounded-xl text-sm font-medium transition-all"
        :class="p === pagination.page ? 'bg-royal-500 text-white' : 'text-navy-400 hover:bg-navy-800'"
      >{{ p }}</button>
    </div>
  </div>
</template>

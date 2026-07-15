<script setup>
import { ref, onMounted } from 'vue'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/adminApi'

const categories = ref([])
const isLoading = ref(true)
const showForm = ref(false)
const editingId = ref(null)
const form = ref({ slug: '', label: '', description: '', icon: '', sort_order: 0 })

onMounted(() => loadCategories())

async function loadCategories() {
  isLoading.value = true
  try {
    const result = await getCategories()
    categories.value = result.data.categories
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

function openCreate() {
  editingId.value = null
  form.value = { slug: '', label: '', description: '', icon: '', sort_order: 0 }
  showForm.value = true
}

function openEdit(cat) {
  editingId.value = cat.id
  form.value = { slug: cat.slug, label: cat.label, description: cat.description || '', icon: cat.icon || '', sort_order: cat.sort_order }
  showForm.value = true
}

async function handleSubmit() {
  try {
    if (editingId.value) {
      await updateCategory(editingId.value, form.value)
    } else {
      await createCategory(form.value)
    }
    showForm.value = false
    loadCategories()
  } catch (e) {
    alert(e.message)
  }
}

async function handleDelete(cat) {
  if (!confirm(`Hapus kategori "${cat.label}"?`)) return
  try {
    await deleteCategory(cat.id)
    loadCategories()
  } catch (e) {
    alert(e.message)
  }
}

function toggleActive(cat) {
  updateCategory(cat.id, { is_active: !cat.is_active }).then(() => loadCategories())
}
</script>

<template>
  <div class="p-6 md:p-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Kategori Hukum</h1>
        <p class="text-sm text-navy-400 mt-1">Kelola kategori konsultasi hukum</p>
      </div>
      <button @click="openCreate" class="px-4 py-2 rounded-xl bg-royal-500 text-white text-sm font-medium hover:bg-royal-600 transition-all">+ Tambah</button>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <div class="w-6 h-6 border-2 border-royal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>

    <div v-else class="bg-navy-900 rounded-2xl border border-navy-800 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-navy-800">
            <th class="text-left px-5 py-3 text-navy-400 font-medium">Slug</th>
            <th class="text-left px-5 py-3 text-navy-400 font-medium">Label</th>
            <th class="text-left px-5 py-3 text-navy-400 font-medium">Deskripsi</th>
            <th class="text-left px-5 py-3 text-navy-400 font-medium">Status</th>
            <th class="text-right px-5 py-3 text-navy-400 font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.id" class="border-b border-navy-800/50 hover:bg-navy-800/30 transition-colors">
            <td class="px-5 py-3 text-navy-300 font-mono text-xs">{{ cat.slug }}</td>
            <td class="px-5 py-3 text-white">{{ cat.label }}</td>
            <td class="px-5 py-3 text-navy-400 truncate max-w-[200px]">{{ cat.description || '-' }}</td>
            <td class="px-5 py-3">
              <button @click="toggleActive(cat)" class="px-2 py-0.5 rounded-lg text-xs font-medium" :class="cat.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-navy-700 text-navy-500'">
                {{ cat.is_active ? 'Aktif' : 'Nonaktif' }}
              </button>
            </td>
            <td class="px-5 py-3 text-right">
              <button @click="openEdit(cat)" class="text-royal-400 hover:text-royal-300 text-xs font-medium mr-3">Edit</button>
              <button @click="handleDelete(cat)" class="text-red-400 hover:text-red-300 text-xs font-medium">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form Modal -->
    <teleport to="body">
      <transition name="fade">
        <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showForm = false" />
          <div class="relative bg-navy-900 rounded-2xl border border-navy-800 p-6 w-full max-w-md">
            <h2 class="text-lg font-semibold text-white mb-4">{{ editingId ? 'Edit' : 'Tambah' }} Kategori</h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm text-navy-400 mb-1">Slug</label>
                <input v-model="form.slug" :disabled="!!editingId" class="w-full px-3 py-2 rounded-xl border border-navy-700 bg-navy-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-royal-500/30 disabled:opacity-50" />
              </div>
              <div>
                <label class="block text-sm text-navy-400 mb-1">Label</label>
                <input v-model="form.label" class="w-full px-3 py-2 rounded-xl border border-navy-700 bg-navy-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-royal-500/30" />
              </div>
              <div>
                <label class="block text-sm text-navy-400 mb-1">Deskripsi</label>
                <textarea v-model="form.description" rows="2" class="w-full px-3 py-2 rounded-xl border border-navy-700 bg-navy-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-royal-500/30" />
              </div>
              <div class="flex gap-3">
                <button type="button" @click="showForm = false" class="flex-1 py-2 rounded-xl border border-navy-700 text-sm text-navy-400 hover:bg-navy-800 transition-all">Batal</button>
                <button type="submit" class="flex-1 py-2 rounded-xl bg-royal-500 text-white text-sm font-medium hover:bg-royal-600 transition-all">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

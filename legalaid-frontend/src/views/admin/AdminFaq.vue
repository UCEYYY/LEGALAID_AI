<script setup>
import { ref, onMounted } from 'vue'
import { getFaq, createFaq, updateFaq, deleteFaq } from '../../services/adminApi'

const faqList = ref([])
const isLoading = ref(true)
const showForm = ref(false)
const editingId = ref(null)
const form = ref({ question: '', answer: '', category_slug: '', sort_order: 0 })

onMounted(() => loadFaq())

async function loadFaq() {
  isLoading.value = true
  try {
    const result = await getFaq()
    faqList.value = result.data.faq
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

function openCreate() {
  editingId.value = null
  form.value = { question: '', answer: '', category_slug: '', sort_order: 0 }
  showForm.value = true
}

function openEdit(item) {
  editingId.value = item.id
  form.value = { question: item.question, answer: item.answer, category_slug: item.category_slug || '', sort_order: item.sort_order }
  showForm.value = true
}

async function handleSubmit() {
  try {
    if (editingId.value) {
      await updateFaq(editingId.value, form.value)
    } else {
      await createFaq(form.value)
    }
    showForm.value = false
    loadFaq()
  } catch (e) {
    alert(e.message)
  }
}

async function handleDelete(item) {
  if (!confirm('Hapus FAQ ini?')) return
  try {
    await deleteFaq(item.id)
    loadFaq()
  } catch (e) {
    alert(e.message)
  }
}
</script>

<template>
  <div class="p-6 md:p-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">FAQ</h1>
        <p class="text-sm text-navy-400 mt-1">Kelola pertanyaan yang sering ditanyakan</p>
      </div>
      <button @click="openCreate" class="px-4 py-2 rounded-xl bg-royal-500 text-white text-sm font-medium hover:bg-royal-600 transition-all">+ Tambah</button>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <div class="w-6 h-6 border-2 border-royal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>

    <div v-else-if="faqList.length === 0" class="text-center py-12 text-navy-500 text-sm">Belum ada FAQ</div>

    <div v-else class="space-y-3">
      <div v-for="item in faqList" :key="item.id" class="bg-navy-900 rounded-2xl p-5 border border-navy-800">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <p class="text-sm text-white font-medium mb-2">{{ item.question }}</p>
            <p class="text-sm text-navy-400 leading-relaxed">{{ item.answer }}</p>
          </div>
          <div class="flex gap-2 shrink-0">
            <button @click="openEdit(item)" class="text-royal-400 hover:text-royal-300 text-xs font-medium">Edit</button>
            <button @click="handleDelete(item)" class="text-red-400 hover:text-red-300 text-xs font-medium">Hapus</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <teleport to="body">
      <transition name="fade">
        <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showForm = false" />
          <div class="relative bg-navy-900 rounded-2xl border border-navy-800 p-6 w-full max-w-lg">
            <h2 class="text-lg font-semibold text-white mb-4">{{ editingId ? 'Edit' : 'Tambah' }} FAQ</h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm text-navy-400 mb-1">Pertanyaan</label>
                <input v-model="form.question" class="w-full px-3 py-2 rounded-xl border border-navy-700 bg-navy-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-royal-500/30" />
              </div>
              <div>
                <label class="block text-sm text-navy-400 mb-1">Jawaban</label>
                <textarea v-model="form.answer" rows="4" class="w-full px-3 py-2 rounded-xl border border-navy-700 bg-navy-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-royal-500/30" />
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

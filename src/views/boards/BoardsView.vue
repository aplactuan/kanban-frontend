<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import BoardCard from '@/components/board/BoardCard.vue'
import BoardFormModal from '@/components/board/BoardFormModal.vue'
import { useBoardsStore } from '@/stores/boards'
import type { Board } from '@/types'

const boardsStore = useBoardsStore()

const showFormModal = ref(false)
const editingBoard = ref<Board | null>(null)

onMounted(() => {
  boardsStore.fetchBoards()
})

function openCreateModal() {
  editingBoard.value = null
  showFormModal.value = true
}

function openEditModal(board: Board) {
  editingBoard.value = board
  showFormModal.value = true
}

function handleSaved() {
  editingBoard.value = null
}

async function handleDelete(board: Board) {
  try {
    await ElMessageBox.confirm(
      `Delete board "${board.name}"? This cannot be undone.`,
      'Delete board',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )
    await boardsStore.deleteBoard(board.id)
    ElMessage.success('Board deleted.')
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('Failed to delete board.')
    }
  }
}
</script>

<template>
  <main class="min-h-[calc(100vh-4rem)] px-4 py-8">
    <div class="mx-auto max-w-7xl">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-semibold text-slate-900">
          My Boards
        </h1>
        <el-button
          type="primary"
          :icon="Plus"
          @click="openCreateModal"
        >
          New Board
        </el-button>
      </div>

      <el-skeleton v-if="boardsStore.isLoading" :rows="6" animated />

      <div
        v-else-if="boardsStore.error"
        class="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700"
      >
        <p class="font-medium">Failed to load boards</p>
        <p class="mt-1 text-sm">{{ boardsStore.error }}</p>
        <el-button
          class="mt-4"
          type="danger"
          plain
          @click="boardsStore.fetchBoards"
        >
          Retry
        </el-button>
      </div>

      <div
        v-else-if="!boardsStore.hasBoards"
        class="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center"
      >
        <p class="text-slate-600">
          You don't have any boards yet.
        </p>
        <el-button
          class="mt-4"
          type="primary"
          :icon="Plus"
          @click="openCreateModal"
        >
          Create your first board
        </el-button>
      </div>

      <div
        v-else
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <BoardCard
          v-for="board in boardsStore.boards"
          :key="board.id"
          :board="board"
          @edit="openEditModal"
          @delete="handleDelete"
        />
      </div>
    </div>
  </main>

  <BoardFormModal
    v-model="showFormModal"
    :board="editingBoard"
    @saved="handleSaved"
  />
</template>

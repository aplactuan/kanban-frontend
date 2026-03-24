<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import BoardColumn from '@/components/column/BoardColumn.vue'
import ColumnFormModal from '@/components/column/ColumnFormModal.vue'
import { useBoardsStore } from '@/stores/boards'
import { useColumnsStore } from '@/stores/columns'
import type { Column } from '@/types'

const route = useRoute()
const router = useRouter()

const boardsStore = useBoardsStore()
const columnsStore = useColumnsStore()

const pageError = ref<string | null>(null)
const isPageLoading = ref(false)
const showColumnFormModal = ref(false)
const editingColumn = ref<Column | null>(null)

const boardId = computed(() => {
  const rawId = Number(route.params.id)
  return Number.isInteger(rawId) && rawId > 0 ? rawId : null
})

const board = computed(() => boardsStore.activeBoard)
const columns = computed(() =>
  boardId.value ? columnsStore.getColumns(boardId.value) : [],
)
const columnsError = computed(() =>
  boardId.value ? columnsStore.getError(boardId.value) : null,
)
const isColumnsLoading = computed(() =>
  boardId.value ? columnsStore.isLoading(boardId.value) : false,
)

async function loadBoardData() {
  if (!boardId.value) {
    pageError.value = 'Invalid board id.'
    return
  }

  isPageLoading.value = true
  pageError.value = null

  try {
    await Promise.all([
      boardsStore.fetchBoard(boardId.value),
      columnsStore.fetchColumns(boardId.value),
    ])
  } catch {
    pageError.value = 'Failed to load board data. Please try again.'
  } finally {
    isPageLoading.value = false
  }
}

function openCreateColumnModal() {
  editingColumn.value = null
  showColumnFormModal.value = true
}

function openEditColumnModal(column: Column) {
  editingColumn.value = column
  showColumnFormModal.value = true
}

function handleColumnSaved() {
  editingColumn.value = null
}

async function handleDeleteColumn(column: Column) {
  if (!boardId.value) return

  try {
    await ElMessageBox.confirm(
      `Delete column "${column.name}"? This cannot be undone.`,
      'Delete column',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )
    await columnsStore.deleteColumn(boardId.value, column.id)
    ElMessage.success('Column deleted.')
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('Failed to delete column.')
    }
  }
}

function backToBoards() {
  router.push({ name: 'boards' })
}

onMounted(loadBoardData)

watch(
  () => route.params.id,
  () => {
    editingColumn.value = null
    showColumnFormModal.value = false
    loadBoardData()
  },
)
</script>

<template>
  <main class="min-h-[calc(100vh-4rem)] px-4 py-6">
    <div class="mx-auto max-w-7xl">
      <div class="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <el-button text :icon="ArrowLeft" @click="backToBoards">
            Back to boards
          </el-button>
          <h1 class="text-2xl font-semibold text-slate-900">
            {{ board?.name ?? 'Board' }}
          </h1>
          <p class="mt-1 text-sm text-slate-500">
            {{ board?.description || 'No description' }}
          </p>
        </div>

        <el-button
          type="primary"
          :icon="Plus"
          :disabled="!boardId"
          @click="openCreateColumnModal"
        >
          Add Column
        </el-button>
      </div>

      <div
        v-if="pageError"
        class="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700"
      >
        <p class="font-medium">{{ pageError }}</p>
        <el-button class="mt-4" type="danger" plain @click="loadBoardData">
          Retry
        </el-button>
      </div>

      <el-skeleton v-else-if="isPageLoading" :rows="6" animated />

      <div
        v-else-if="columnsError"
        class="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700"
      >
        <p class="font-medium">Failed to load columns</p>
        <p class="mt-1 text-sm">{{ columnsError }}</p>
        <el-button class="mt-4" type="danger" plain @click="loadBoardData">
          Retry
        </el-button>
      </div>

      <div v-else-if="isColumnsLoading">
        <el-skeleton :rows="4" animated />
      </div>

      <div
        v-else-if="columns.length === 0"
        class="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center"
      >
        <p class="text-slate-600">No columns yet for this board.</p>
        <el-button class="mt-4" type="primary" :icon="Plus" @click="openCreateColumnModal">
          Create your first column
        </el-button>
      </div>

      <div v-else class="overflow-x-auto pb-4">
        <div class="flex min-h-48 items-start gap-4">
          <BoardColumn
            v-for="column in columns"
            :key="column.id"
            :column="column"
            @edit="openEditColumnModal"
            @delete="handleDeleteColumn"
          />

          <button
            type="button"
            class="flex h-[184px] w-80 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-slate-600 transition hover:border-slate-400 hover:text-slate-700"
            @click="openCreateColumnModal"
          >
            <Plus class="mr-1" :size="18" />
            Add Column
          </button>
        </div>
      </div>
    </div>
  </main>

  <ColumnFormModal
    v-if="boardId"
    v-model="showColumnFormModal"
    :board-id="boardId"
    :column="editingColumn"
    @saved="handleColumnSaved"
  />
</template>

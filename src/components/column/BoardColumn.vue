<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Edit, Delete, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import draggable from 'vuedraggable'
import TaskCard from '@/components/task/TaskCard.vue'
import TaskFormModal from '@/components/task/TaskFormModal.vue'
import { useTasksStore } from '@/stores/tasks'
import type { Column, Task } from '@/types'

interface Props {
  column: Column
  boardId: number
}

interface Emits {
  (e: 'edit', column: Column): void
  (e: 'delete', column: Column): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tasksStore = useTasksStore()

const showTaskFormModal = ref(false)
const editingTask = ref<Task | null>(null)

const storeTasks = computed(() => tasksStore.getTasks(props.column.id))
const localTasks = ref<Task[]>([...storeTasks.value])

watch(
  storeTasks,
  (newTasks) => {
    localTasks.value = [...newTasks]
  },
  { deep: true },
)

function openCreateTaskModal() {
  editingTask.value = null
  showTaskFormModal.value = true
}

function openEditTaskModal(task: Task) {
  editingTask.value = task
  showTaskFormModal.value = true
}

function handleTaskSaved() {
  editingTask.value = null
}

async function handleDeleteTask(task: Task) {
  try {
    await ElMessageBox.confirm(
      `Delete task "${task.title}"? This cannot be undone.`,
      'Delete task',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )
    await tasksStore.deleteTask(props.boardId, props.column.id, task.id)
    ElMessage.success('Task deleted.')
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('Failed to delete task.')
    }
  }
}

interface DragChangeEvent {
  added?: { element: Task; newIndex: number }
  removed?: { element: Task; oldIndex: number }
  moved?: { element: Task; newIndex: number; oldIndex: number }
}

async function onDragChange(event: DragChangeEvent) {
  if (event.added) {
    const { element: task, newIndex } = event.added
    try {
      await tasksStore.moveTask(task.id, props.column.id, newIndex + 1)
    } catch {
      ElMessage.error('Failed to move task.')
      localTasks.value = [...storeTasks.value]
    }
  } else if (event.moved) {
    const { element: task, newIndex } = event.moved
    try {
      await tasksStore.moveTask(task.id, props.column.id, newIndex + 1)
    } catch {
      ElMessage.error('Failed to move task.')
      localTasks.value = [...storeTasks.value]
    }
  }
}
</script>

<template>
  <el-card class="flex w-80 shrink-0 flex-col">
    <template #header>
      <div class="flex items-center justify-between gap-2">
        <div class="min-w-0">
          <p class="truncate font-semibold text-slate-900">
            {{ column.name }}
          </p>
        </div>
        <div class="flex shrink-0 gap-1">
          <el-button
            :icon="Plus"
            circle
            size="small"
            text
            title="Add task"
            @click="openCreateTaskModal"
          />
          <el-button
            :icon="Edit"
            circle
            size="small"
            text
            @click="emit('edit', column)"
          />
          <el-button
            :icon="Delete"
            circle
            size="small"
            text
            type="danger"
            @click="emit('delete', column)"
          />
        </div>
      </div>
    </template>

    <draggable
      v-model="localTasks"
      group="tasks"
      item-key="id"
      class="flex min-h-16 flex-col gap-2"
      ghost-class="opacity-40"
      drag-class="shadow-lg"
      @change="onDragChange"
    >
      <template #item="{ element }">
        <TaskCard
          :task="element"
          @edit="openEditTaskModal"
          @delete="handleDeleteTask"
        />
      </template>
    </draggable>

    <button
      type="button"
      class="mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-sm leading-none text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
      @click="openCreateTaskModal"
    >
      <Plus class="h-3.5 w-3.5 shrink-0" />
      Add task
    </button>
  </el-card>

  <TaskFormModal
    v-model="showTaskFormModal"
    :board-id="boardId"
    :column-id="column.id"
    :task="editingTask"
    @saved="handleTaskSaved"
  />
</template>

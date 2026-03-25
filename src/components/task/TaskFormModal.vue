<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useTasksStore } from '@/stores/tasks'
import type { Task } from '@/types'
import type { TaskPayload } from '@/api/tasks'

const tasksStore = useTasksStore()

interface Props {
  modelValue: boolean
  boardId: number
  columnId: number
  task?: Task | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved', task: Task): void
}

const props = withDefaults(defineProps<Props>(), {
  task: null,
})
const emit = defineEmits<Emits>()

const isSubmitting = ref(false)
const errorMessage = ref('')

interface TaskFormState {
  title: string
  description: string
}

const form = ref<TaskFormState>({
  title: '',
  description: '',
})

const isEdit = computed(() => !!props.task)
const title = computed(() => (isEdit.value ? 'Edit task' : 'New task'))

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ??
      'Something went wrong. Please try again.'
    )
  }
  return 'Something went wrong. Please try again.'
}

function resetForm() {
  form.value = {
    title: props.task?.title ?? '',
    description: props.task?.description ?? '',
  }
  errorMessage.value = ''
}

watch(
  () => [props.modelValue, props.task] as const,
  ([visible]) => {
    if (!visible) return
    form.value = {
      title: props.task?.title ?? '',
      description: props.task?.description ?? '',
    }
    errorMessage.value = ''
  },
)

function close() {
  emit('update:modelValue', false)
}

async function handleSubmit() {
  errorMessage.value = ''
  const taskTitle = form.value.title.trim()

  if (!taskTitle) {
    errorMessage.value = 'Title is required.'
    return
  }

  const payload: TaskPayload = {
    title: taskTitle,
    description: form.value.description.trim() || undefined,
  }

  isSubmitting.value = true
  try {
    if (isEdit.value && props.task) {
      const updated = await tasksStore.updateTask(
        props.boardId,
        props.columnId,
        props.task.id,
        payload,
      )
      ElMessage.success('Task updated.')
      emit('saved', updated)
    } else {
      const created = await tasksStore.createTask(props.boardId, props.columnId, payload)
      ElMessage.success('Task created.')
      emit('saved', created)
    }
    close()
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  } finally {
    isSubmitting.value = false
  }
}

resetForm()
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    width="440"
    destroy-on-close
    :close-on-click-modal="!isSubmitting"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-alert
      v-if="errorMessage"
      :title="errorMessage"
      type="error"
      show-icon
      class="mb-4"
      :closable="false"
    />

    <el-form label-position="top" @submit.prevent="handleSubmit">
      <el-form-item label="Title" required>
        <el-input
          v-model="form.title"
          placeholder="e.g. Design the login screen"
          :disabled="isSubmitting"
          maxlength="255"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="Description">
        <el-input
          v-model="form.description"
          type="textarea"
          placeholder="Optional description"
          :disabled="isSubmitting"
          :rows="4"
          maxlength="1000"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button :disabled="isSubmitting" @click="close">
          Cancel
        </el-button>
        <el-button type="primary" :loading="isSubmitting" @click="handleSubmit">
          {{ isEdit ? 'Update' : 'Create' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

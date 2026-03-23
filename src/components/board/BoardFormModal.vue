<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useBoardsStore } from '@/stores/boards'
import type { Board } from '@/types'
import type { BoardPayload } from '@/api/boards'

const boardsStore = useBoardsStore()

interface Props {
  modelValue: boolean
  board?: Board | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved', board: Board): void
}

const props = withDefaults(defineProps<Props>(), {
  board: null,
})
const emit = defineEmits<Emits>()

const isSubmitting = ref(false)
const errorMessage = ref('')

const form = ref<BoardPayload>({
  name: '',
  description: '',
})

const isEdit = computed(() => !!props.board)
const title = computed(() => (isEdit.value ? 'Edit board' : 'New board'))

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message
      ?? 'Something went wrong. Please try again.'
  }
  return 'Something went wrong. Please try again.'
}

function resetForm() {
  form.value = {
    name: props.board?.name ?? '',
    description: props.board?.description ?? '',
  }
  errorMessage.value = ''
}

watch(
  () => [props.modelValue, props.board] as const,
  ([visible, board]) => {
    if (visible) {
      resetForm()
      form.value = {
        name: board?.name ?? '',
        description: board?.description ?? '',
      }
    }
  },
)

function close() {
  emit('update:modelValue', false)
}

async function handleSubmit() {
  errorMessage.value = ''
  const name = form.value.name.trim()
  if (!name) {
    errorMessage.value = 'Name is required.'
    return
  }

  isSubmitting.value = true
  try {
    if (isEdit.value && props.board) {
      const updated = await boardsStore.updateBoard(props.board.id, {
        name,
        description: form.value.description?.trim() || undefined,
      })
      ElMessage.success('Board updated.')
      emit('saved', updated)
    } else {
      const created = await boardsStore.createBoard({
        name,
        description: form.value.description?.trim() || undefined,
      })
      ElMessage.success('Board created.')
      emit('saved', created)
    }
    close()
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    width="420"
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

    <el-form
      label-position="top"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="Name" required>
        <el-input
          v-model="form.name"
          placeholder="e.g. My Board"
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
          :rows="3"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button
          :disabled="isSubmitting"
          @click="close"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
          :loading="isSubmitting"
          @click="handleSubmit"
        >
          {{ isEdit ? 'Update' : 'Create' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

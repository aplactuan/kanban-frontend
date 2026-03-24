<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useColumnsStore } from '@/stores/columns'
import type { Column } from '@/types'
import type { ColumnPayload } from '@/api/columns'

const columnsStore = useColumnsStore()

interface Props {
  modelValue: boolean
  boardId: number
  column?: Column | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved', column: Column): void
}

const props = withDefaults(defineProps<Props>(), {
  column: null,
})
const emit = defineEmits<Emits>()

const isSubmitting = ref(false)
const errorMessage = ref('')

interface ColumnFormState {
  name: string
  position: number | undefined
}

const form = ref<ColumnFormState>({
  name: '',
  position: undefined,
})

const isEdit = computed(() => !!props.column)
const title = computed(() => (isEdit.value ? 'Edit column' : 'New column'))

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message
      ?? 'Something went wrong. Please try again.'
  }
  return 'Something went wrong. Please try again.'
}

function resetForm() {
  form.value = {
    name: props.column?.name ?? '',
    position: props.column?.position ?? undefined,
  }
  errorMessage.value = ''
}

watch(
  () => [props.modelValue, props.column] as const,
  ([visible, column]) => {
    if (!visible) return
    form.value = {
      name: column?.name ?? '',
      position: column?.position ?? undefined,
    }
    errorMessage.value = ''
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

  if (form.value.position !== undefined && form.value.position < 1) {
    errorMessage.value = 'Position must be at least 1.'
    return
  }

  const payload: ColumnPayload = {
    name,
    ...(form.value.position !== undefined ? { position: form.value.position } : {}),
  }

  isSubmitting.value = true
  try {
    if (isEdit.value && props.column) {
      const updated = await columnsStore.updateColumn(props.boardId, props.column.id, payload)
      ElMessage.success('Column updated.')
      emit('saved', updated)
    } else {
      const created = await columnsStore.createColumn(props.boardId, payload)
      ElMessage.success('Column created.')
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

    <el-form label-position="top" @submit.prevent="handleSubmit">
      <el-form-item label="Name" required>
        <el-input
          v-model="form.name"
          placeholder="e.g. In Progress"
          :disabled="isSubmitting"
          maxlength="255"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="Position">
        <el-input-number
          v-model="form.position"
          :min="1"
          :step="1"
          :disabled="isSubmitting"
          controls-position="right"
          placeholder="Optional"
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

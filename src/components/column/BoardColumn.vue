<script setup lang="ts">
import { Edit, Delete } from '@element-plus/icons-vue'
import type { Column } from '@/types'

interface Props {
  column: Column
}

interface Emits {
  (e: 'edit', column: Column): void
  (e: 'delete', column: Column): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleEdit() {
  emit('edit', props.column)
}

function handleDelete() {
  emit('delete', props.column)
}
</script>

<template>
  <el-card class="h-full w-80 shrink-0">
    <template #header>
      <div class="flex items-center justify-between gap-2">
        <div class="min-w-0">
          <p class="truncate font-semibold text-slate-900">
            {{ column.name }}
          </p>
        </div>
        <div class="flex shrink-0 gap-1">
          <el-button
            :icon="Edit"
            circle
            size="small"
            text
            @click="handleEdit"
          />
          <el-button
            :icon="Delete"
            circle
            size="small"
            text
            type="danger"
            @click="handleDelete"
          />
        </div>
      </div>
    </template>

    <div class="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4">
      <p class="text-center text-sm text-slate-500">
        Tasks will appear here in phase 7.
      </p>
    </div>
  </el-card>
</template>

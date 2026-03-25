<script setup lang="ts">
import { computed } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import type { Task } from '@/types'

interface Props {
  task: Task
}

interface Emits {
  (e: 'edit', task: Task): void
  (e: 'delete', task: Task): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const descriptionPreview = computed(() => {
  if (!props.task.description) return null
  const text = props.task.description.trim()
  if (text.length <= 100) return text
  return `${text.slice(0, 100)}…`
})
</script>

<template>
  <div
    class="group cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 hover:shadow active:cursor-grabbing"
  >
    <div class="flex items-start gap-2">
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium leading-snug text-slate-900">
          {{ task.title }}
        </p>
        <p
          v-if="descriptionPreview"
          class="mt-1 line-clamp-2 text-xs text-slate-500"
        >
          {{ descriptionPreview }}
        </p>
      </div>
      <div class="flex shrink-0 gap-0.5 opacity-0 transition group-hover:opacity-100">
        <el-button
          :icon="Edit"
          circle
          size="small"
          text
          @click.stop="emit('edit', task)"
        />
        <el-button
          :icon="Delete"
          circle
          size="small"
          text
          type="danger"
          @click.stop="emit('delete', task)"
        />
      </div>
    </div>
  </div>
</template>

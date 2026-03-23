<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Document, Edit, Delete } from '@element-plus/icons-vue'
import type { Board } from '@/types'

interface Props {
  board: Board
}

interface Emits {
  (e: 'edit', board: Board): void
  (e: 'delete', board: Board): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const router = useRouter()

const descriptionPreview = computed(() => {
  if (!props.board.description) return null
  const text = props.board.description.trim()
  if (text.length <= 80) return text
  return `${text.slice(0, 80)}…`
})

function openBoard() {
  router.push({ name: 'board', params: { id: String(props.board.id) } })
}

function handleEdit(e: Event) {
  e.stopPropagation()
  emit('edit', props.board)
}

function handleDelete(e: Event) {
  e.stopPropagation()
  emit('delete', props.board)
}
</script>

<template>
  <el-card
    shadow="hover"
    class="cursor-pointer transition-shadow hover:shadow-md"
    @click="openBoard"
  >
    <template #header>
      <div class="flex items-start justify-between gap-2">
        <div class="flex min-w-0 flex-1 items-start gap-2">
          <Document class="mt-0.5 shrink-0 text-slate-500" :size="20" />
          <h3 class="truncate font-semibold text-slate-900">
            {{ board.name }}
          </h3>
        </div>
        <div class="flex shrink-0 gap-1" @click.stop>
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
    <p
      v-if="descriptionPreview"
      class="line-clamp-2 text-sm text-slate-500"
    >
      {{ descriptionPreview }}
    </p>
    <p
      v-else
      class="text-sm italic text-slate-400"
    >
      No description
    </p>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const userName = computed(() => authStore.user?.name ?? 'User')
const userEmail = computed(() => authStore.user?.email ?? '')

async function handleLogout() {
  await authStore.logout()
  ElMessage.success('Logged out successfully.')
  await router.push({ name: 'login' })
}
</script>

<template>
  <header class="border-b border-slate-200 bg-white">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
      <RouterLink to="/boards" class="text-lg font-semibold text-slate-900">
        Kanban
      </RouterLink>

      <div v-if="authStore.isAuthenticated" class="flex items-center gap-4">
        <div class="hidden text-right sm:block">
          <p class="text-sm font-medium text-slate-900">{{ userName }}</p>
          <p class="text-xs text-slate-500">{{ userEmail }}</p>
        </div>

        <el-button type="danger" plain @click="handleLogout">
          Logout
        </el-button>
      </div>
    </div>
  </header>
</template>

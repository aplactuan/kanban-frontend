<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const showNavbar = computed(() => route.meta.requiresAuth === true)

onMounted(async () => {
  if (!authStore.isAuthenticated || authStore.user) {
    return
  }

  try {
    await authStore.fetchUser()
  } catch {
    await authStore.logout()
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <AppNavbar v-if="showNavbar" />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { Lock, Message } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

interface LoginForm {
  email: string
  password: string
}

const authStore = useAuthStore()
const router = useRouter()

const isSubmitting = ref(false)
const errorMessage = ref('')

const form = reactive<LoginForm>({
  email: '',
  password: '',
})

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message
      ?? 'Unable to log in. Please check your credentials and try again.'
  }

  return 'Unable to log in. Please try again.'
}

async function handleSubmit() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await authStore.login(form)
    ElMessage.success('Logged in successfully.')
    await router.push({ name: 'boards' })
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-slate-100 px-4 py-12">
    <div class="mx-auto max-w-md">
      <el-card shadow="hover" class="rounded-2xl">
        <template #header>
          <div class="space-y-1 text-center">
            <h1 class="text-2xl font-semibold text-slate-900">Sign in</h1>
            <p class="text-sm text-slate-500">
              Access your Kanban boards.
            </p>
          </div>
        </template>

        <el-alert
          v-if="errorMessage"
          :title="errorMessage"
          type="error"
          show-icon
          class="mb-4"
          :closable="false"
        />

        <el-form label-position="top" @submit.prevent="handleSubmit">
          <el-form-item label="Email">
            <el-input
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              :disabled="isSubmitting"
              :prefix-icon="Message"
            />
          </el-form-item>

          <el-form-item label="Password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="Enter your password"
              autocomplete="current-password"
              show-password
              :disabled="isSubmitting"
              :prefix-icon="Lock"
            />
          </el-form-item>

          <el-button
            type="primary"
            class="mt-2 w-full"
            :loading="isSubmitting"
            native-type="submit"
          >
            Sign in
          </el-button>
        </el-form>

        <p class="mt-4 text-center text-sm text-slate-600">
          Need an account?
          <RouterLink to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            Create one
          </RouterLink>
        </p>
      </el-card>
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { Lock, Message, User } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

interface RegisterForm {
  name: string
  email: string
  password: string
  password_confirmation: string
}

const authStore = useAuthStore()
const router = useRouter()

const isSubmitting = ref(false)
const errorMessage = ref('')

const form = reactive<RegisterForm>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message
      ?? 'Unable to register. Please review your details and try again.'
  }

  return 'Unable to register. Please try again.'
}

async function handleSubmit() {
  errorMessage.value = ''

  if (form.password !== form.password_confirmation) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  isSubmitting.value = true

  try {
    await authStore.register(form)
    ElMessage.success('Account created successfully.')
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
            <h1 class="text-2xl font-semibold text-slate-900">Create account</h1>
            <p class="text-sm text-slate-500">
              Start managing your Kanban boards.
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
          <el-form-item label="Name">
            <el-input
              v-model="form.name"
              placeholder="Your name"
              autocomplete="name"
              :disabled="isSubmitting"
              :prefix-icon="User"
            />
          </el-form-item>

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
              placeholder="Create a password"
              autocomplete="new-password"
              show-password
              :disabled="isSubmitting"
              :prefix-icon="Lock"
            />
          </el-form-item>

          <el-form-item label="Confirm password">
            <el-input
              v-model="form.password_confirmation"
              type="password"
              placeholder="Repeat your password"
              autocomplete="new-password"
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
            Create account
          </el-button>
        </el-form>

        <p class="mt-4 text-center text-sm text-slate-600">
          Already registered?
          <RouterLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </RouterLink>
        </p>
      </el-card>
    </div>
  </main>
</template>

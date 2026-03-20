import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '@/api/auth'
import type { User } from '@/types'
import type { LoginPayload, RegisterPayload } from '@/api/auth'

const TOKEN_KEY = 'auth_token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken: string | null) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  }

  async function login(payload: LoginPayload) {
    const data = await authApi.login(payload)
    setToken(data.token)
    user.value = data.user
  }

  async function register(payload: RegisterPayload) {
    const data = await authApi.register(payload)
    setToken(data.token)
    user.value = data.user
  }

  async function logout() {
    try {
      await authApi.logout()
    } finally {
      setToken(null)
      user.value = null
    }
  }

  async function fetchUser() {
    user.value = await authApi.getUser()
  }

  return { token, user, isAuthenticated, login, register, logout, fetchUser }
})

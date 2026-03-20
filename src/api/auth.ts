import client from './client'
import type { User } from '@/types'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  token: string
  user: User
}

export const login = (payload: LoginPayload): Promise<AuthResponse> =>
  client.post<AuthResponse>('/api/login', payload).then((r) => r.data)

export const register = (payload: RegisterPayload): Promise<AuthResponse> =>
  client.post<AuthResponse>('/api/register', payload).then((r) => r.data)

export const logout = (): Promise<void> =>
  client.post('/api/logout').then(() => undefined)

export const getUser = (): Promise<User> =>
  client.get<User>('/api/v1/user').then((r) => r.data)

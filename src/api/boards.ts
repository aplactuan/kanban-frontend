import client from './client'
import type { Board } from '@/types'

export interface BoardPayload {
  name: string
  description?: string
}

export const listBoards = (): Promise<Board[]> =>
  client.get<Board[]>('/api/v1/boards').then((r) => r.data)

export const createBoard = (payload: BoardPayload): Promise<Board> =>
  client.post<Board>('/api/v1/boards', payload).then((r) => r.data)

export const getBoard = (id: number): Promise<Board> =>
  client.get<Board>(`/api/v1/boards/${id}`).then((r) => r.data)

export const updateBoard = (id: number, payload: BoardPayload): Promise<Board> =>
  client.put<Board>(`/api/v1/boards/${id}`, payload).then((r) => r.data)

export const deleteBoard = (id: number): Promise<void> =>
  client.delete(`/api/v1/boards/${id}`).then(() => undefined)

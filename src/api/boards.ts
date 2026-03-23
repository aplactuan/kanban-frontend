import client from './client'
import type { Board } from '@/types'

export interface BoardPayload {
  name: string
  description?: string
}

/**
 * Laravel resource responses wrap single items in `{ data: T }` and collections
 * in `{ data: T[] }`. This helper unwraps either shape transparently so the rest
 * of the app can work with plain types.
 */
function unwrap<T>(raw: unknown): T {
  if (
    raw !== null &&
    typeof raw === 'object' &&
    !Array.isArray(raw) &&
    'data' in (raw as object)
  ) {
    return (raw as { data: T }).data
  }
  return raw as T
}

export const listBoards = (): Promise<Board[]> =>
  client.get('/api/v1/boards').then((r) => unwrap<Board[]>(r.data))

export const createBoard = (payload: BoardPayload): Promise<Board> =>
  client.post('/api/v1/boards', payload).then((r) => unwrap<Board>(r.data))

export const getBoard = (id: number): Promise<Board> =>
  client.get(`/api/v1/boards/${id}`).then((r) => unwrap<Board>(r.data))

export const updateBoard = (id: number, payload: BoardPayload): Promise<Board> =>
  client.put(`/api/v1/boards/${id}`, payload).then((r) => unwrap<Board>(r.data))

export const deleteBoard = (id: number): Promise<void> =>
  client.delete(`/api/v1/boards/${id}`).then(() => undefined)

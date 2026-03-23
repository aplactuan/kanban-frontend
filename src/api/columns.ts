import client from './client'
import type { Column } from '@/types'

export interface ColumnPayload {
  name: string
}

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

export const listColumns = (boardId: number): Promise<Column[]> =>
  client.get(`/api/v1/boards/${boardId}/columns`).then((r) => unwrap<Column[]>(r.data))

export const createColumn = (boardId: number, payload: ColumnPayload): Promise<Column> =>
  client.post(`/api/v1/boards/${boardId}/columns`, payload).then((r) => unwrap<Column>(r.data))

export const updateColumn = (
  boardId: number,
  columnId: number,
  payload: ColumnPayload,
): Promise<Column> =>
  client
    .put(`/api/v1/boards/${boardId}/columns/${columnId}`, payload)
    .then((r) => unwrap<Column>(r.data))

export const deleteColumn = (boardId: number, columnId: number): Promise<void> =>
  client.delete(`/api/v1/boards/${boardId}/columns/${columnId}`).then(() => undefined)

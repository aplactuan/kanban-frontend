import client from './client'
import type { Column } from '@/types'

export interface ColumnPayload {
  name: string
}

export const listColumns = (boardId: number): Promise<Column[]> =>
  client.get<Column[]>(`/api/v1/boards/${boardId}/columns`).then((r) => r.data)

export const createColumn = (boardId: number, payload: ColumnPayload): Promise<Column> =>
  client.post<Column>(`/api/v1/boards/${boardId}/columns`, payload).then((r) => r.data)

export const updateColumn = (
  boardId: number,
  columnId: number,
  payload: ColumnPayload,
): Promise<Column> =>
  client
    .put<Column>(`/api/v1/boards/${boardId}/columns/${columnId}`, payload)
    .then((r) => r.data)

export const deleteColumn = (boardId: number, columnId: number): Promise<void> =>
  client.delete(`/api/v1/boards/${boardId}/columns/${columnId}`).then(() => undefined)

import client from './client'
import type { Task } from '@/types'

export interface TaskPayload {
  title: string
  description?: string
}

export interface MoveTaskPayload {
  column_id: number
  position: number
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

export const listTasks = (boardId: number, columnId: number): Promise<Task[]> =>
  client
    .get(`/api/v1/boards/${boardId}/columns/${columnId}/tasks`)
    .then((r) => unwrap<Task[]>(r.data))

export const createTask = (
  boardId: number,
  columnId: number,
  payload: TaskPayload,
): Promise<Task> =>
  client
    .post(`/api/v1/boards/${boardId}/columns/${columnId}/tasks`, payload)
    .then((r) => unwrap<Task>(r.data))

export const updateTask = (
  boardId: number,
  columnId: number,
  taskId: number,
  payload: TaskPayload,
): Promise<Task> =>
  client
    .put(`/api/v1/boards/${boardId}/columns/${columnId}/tasks/${taskId}`, payload)
    .then((r) => unwrap<Task>(r.data))

export const deleteTask = (boardId: number, columnId: number, taskId: number): Promise<void> =>
  client
    .delete(`/api/v1/boards/${boardId}/columns/${columnId}/tasks/${taskId}`)
    .then(() => undefined)

export const moveTask = (taskId: number, payload: MoveTaskPayload): Promise<Task> =>
  client.patch(`/api/v1/tasks/${taskId}/move`, payload).then((r) => unwrap<Task>(r.data))

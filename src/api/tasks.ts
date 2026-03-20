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

export const listTasks = (boardId: number, columnId: number): Promise<Task[]> =>
  client
    .get<Task[]>(`/api/v1/boards/${boardId}/columns/${columnId}/tasks`)
    .then((r) => r.data)

export const createTask = (
  boardId: number,
  columnId: number,
  payload: TaskPayload,
): Promise<Task> =>
  client
    .post<Task>(`/api/v1/boards/${boardId}/columns/${columnId}/tasks`, payload)
    .then((r) => r.data)

export const updateTask = (
  boardId: number,
  columnId: number,
  taskId: number,
  payload: TaskPayload,
): Promise<Task> =>
  client
    .put<Task>(`/api/v1/boards/${boardId}/columns/${columnId}/tasks/${taskId}`, payload)
    .then((r) => r.data)

export const deleteTask = (boardId: number, columnId: number, taskId: number): Promise<void> =>
  client
    .delete(`/api/v1/boards/${boardId}/columns/${columnId}/tasks/${taskId}`)
    .then(() => undefined)

export const moveTask = (taskId: number, payload: MoveTaskPayload): Promise<Task> =>
  client.patch<Task>(`/api/v1/tasks/${taskId}/move`, payload).then((r) => r.data)

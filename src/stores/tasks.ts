import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as tasksApi from '@/api/tasks'
import type { Task } from '@/types'
import type { TaskPayload } from '@/api/tasks'

type TaskMap = Record<number, Task[]>
type LoadingMap = Record<number, boolean>
type ErrorMap = Record<number, string | null>

function sortTasks(tasks: Task[]) {
  return [...tasks].sort((a, b) => {
    if (a.position !== b.position) return a.position - b.position
    return a.id - b.id
  })
}

export const useTasksStore = defineStore('tasks', () => {
  const tasksByColumn = ref<TaskMap>({})
  const loadingByColumn = ref<LoadingMap>({})
  const errorByColumn = ref<ErrorMap>({})

  function getTasks(columnId: number) {
    return tasksByColumn.value[columnId] ?? []
  }

  function isLoading(columnId: number) {
    return loadingByColumn.value[columnId] ?? false
  }

  function getError(columnId: number) {
    return errorByColumn.value[columnId] ?? null
  }

  function findColumnIdForTask(taskId: number): number | null {
    for (const [colId, tasks] of Object.entries(tasksByColumn.value)) {
      if (tasks.some((t) => t.id === taskId)) return Number(colId)
    }
    return null
  }

  async function fetchTasks(boardId: number, columnId: number) {
    loadingByColumn.value[columnId] = true
    errorByColumn.value[columnId] = null
    try {
      const tasks = await tasksApi.listTasks(boardId, columnId)
      tasksByColumn.value[columnId] = sortTasks(tasks)
      return tasksByColumn.value[columnId]
    } catch (e) {
      const message = (e as Error).message ?? 'Failed to fetch tasks.'
      errorByColumn.value[columnId] = message
      throw e
    } finally {
      loadingByColumn.value[columnId] = false
    }
  }

  async function createTask(boardId: number, columnId: number, payload: TaskPayload) {
    const task = await tasksApi.createTask(boardId, columnId, payload)
    tasksByColumn.value[columnId] = sortTasks([...getTasks(columnId), task])
    return task
  }

  async function updateTask(
    boardId: number,
    columnId: number,
    taskId: number,
    payload: TaskPayload,
  ) {
    const updated = await tasksApi.updateTask(boardId, columnId, taskId, payload)
    const tasks = getTasks(columnId)
    const index = tasks.findIndex((t) => t.id === taskId)
    if (index === -1) {
      tasksByColumn.value[columnId] = sortTasks([...tasks, updated])
    } else {
      const next = [...tasks]
      next[index] = updated
      tasksByColumn.value[columnId] = sortTasks(next)
    }
    return updated
  }

  async function deleteTask(boardId: number, columnId: number, taskId: number) {
    await tasksApi.deleteTask(boardId, columnId, taskId)
    tasksByColumn.value[columnId] = getTasks(columnId).filter((t) => t.id !== taskId)
  }

  async function moveTask(taskId: number, toColumnId: number, position: number) {
    const fromColumnId = findColumnIdForTask(taskId)
    const task = await tasksApi.moveTask(taskId, { column_id: toColumnId, position })

    if (fromColumnId !== null && fromColumnId !== toColumnId) {
      tasksByColumn.value[fromColumnId] = getTasks(fromColumnId).filter((t) => t.id !== taskId)
    }

    const tasks = getTasks(toColumnId)
    const existing = tasks.findIndex((t) => t.id === taskId)
    if (existing !== -1) {
      const next = [...tasks]
      next[existing] = task
      tasksByColumn.value[toColumnId] = sortTasks(next)
    } else {
      tasksByColumn.value[toColumnId] = sortTasks([...tasks, task])
    }

    return task
  }

  function clearColumnTasks(columnId: number) {
    delete tasksByColumn.value[columnId]
    delete loadingByColumn.value[columnId]
    delete errorByColumn.value[columnId]
  }

  return {
    tasksByColumn,
    getTasks,
    isLoading,
    getError,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    clearColumnTasks,
  }
})

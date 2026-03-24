import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as columnsApi from '@/api/columns'
import type { Column } from '@/types'
import type { ColumnPayload } from '@/api/columns'

type ColumnMap = Record<number, Column[]>
type LoadingMap = Record<number, boolean>
type ErrorMap = Record<number, string | null>

function sortColumns(columns: Column[]) {
  return [...columns].sort((a, b) => {
    if (a.position !== b.position) return a.position - b.position
    return a.id - b.id
  })
}

export const useColumnsStore = defineStore('columns', () => {
  const columnsByBoard = ref<ColumnMap>({})
  const loadingByBoard = ref<LoadingMap>({})
  const errorByBoard = ref<ErrorMap>({})

  const hasColumns = computed(
    () => (boardId: number) => (columnsByBoard.value[boardId] ?? []).length > 0,
  )

  function getColumns(boardId: number) {
    return columnsByBoard.value[boardId] ?? []
  }

  function isLoading(boardId: number) {
    return loadingByBoard.value[boardId] ?? false
  }

  function getError(boardId: number) {
    return errorByBoard.value[boardId] ?? null
  }

  async function fetchColumns(boardId: number) {
    loadingByBoard.value[boardId] = true
    errorByBoard.value[boardId] = null
    try {
      const columns = await columnsApi.listColumns(boardId)
      columnsByBoard.value[boardId] = sortColumns(columns)
      return columnsByBoard.value[boardId]
    } catch (e) {
      const message = (e as Error).message ?? 'Failed to fetch columns.'
      errorByBoard.value[boardId] = message
      throw e
    } finally {
      loadingByBoard.value[boardId] = false
    }
  }

  async function createColumn(boardId: number, payload: ColumnPayload) {
    const column = await columnsApi.createColumn(boardId, payload)
    const columns = getColumns(boardId)
    columnsByBoard.value[boardId] = sortColumns([...columns, column])
    return column
  }

  async function updateColumn(boardId: number, columnId: number, payload: ColumnPayload) {
    const updated = await columnsApi.updateColumn(boardId, columnId, payload)
    const columns = getColumns(boardId)
    const index = columns.findIndex((column) => column.id === columnId)

    if (index === -1) {
      columnsByBoard.value[boardId] = sortColumns([...columns, updated])
      return updated
    }

    const nextColumns = [...columns]
    nextColumns[index] = updated
    columnsByBoard.value[boardId] = sortColumns(nextColumns)
    return updated
  }

  async function deleteColumn(boardId: number, columnId: number) {
    await columnsApi.deleteColumn(boardId, columnId)
    columnsByBoard.value[boardId] = getColumns(boardId).filter((column) => column.id !== columnId)
  }

  function clearBoardColumns(boardId: number) {
    delete columnsByBoard.value[boardId]
    delete loadingByBoard.value[boardId]
    delete errorByBoard.value[boardId]
  }

  return {
    columnsByBoard,
    hasColumns,
    getColumns,
    isLoading,
    getError,
    fetchColumns,
    createColumn,
    updateColumn,
    deleteColumn,
    clearBoardColumns,
  }
})

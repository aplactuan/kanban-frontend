import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as boardsApi from '@/api/boards'
import type { Board } from '@/types'
import type { BoardPayload } from '@/api/boards'

export const useBoardsStore = defineStore('boards', () => {
  const boards = ref<Board[]>([])
  const activeBoard = ref<Board | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const hasBoards = computed(() => boards.value.length > 0)

  async function fetchBoards() {
    isLoading.value = true
    error.value = null
    try {
      boards.value = await boardsApi.listBoards()
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function createBoard(payload: BoardPayload) {
    const board = await boardsApi.createBoard(payload)
    boards.value.push(board)
    return board
  }

  async function updateBoard(id: number, payload: BoardPayload) {
    const board = await boardsApi.updateBoard(id, payload)
    const index = boards.value.findIndex((b) => b.id === id)
    if (index !== -1) {
      boards.value[index] = board
    }
    if (activeBoard.value?.id === id) {
      activeBoard.value = board
    }
    return board
  }

  async function deleteBoard(id: number) {
    await boardsApi.deleteBoard(id)
    boards.value = boards.value.filter((b) => b.id !== id)
    if (activeBoard.value?.id === id) {
      activeBoard.value = null
    }
  }

  async function fetchBoard(id: number) {
    const board = await boardsApi.getBoard(id)
    activeBoard.value = board
    return board
  }

  function setActiveBoard(board: Board | null) {
    activeBoard.value = board
  }

  function clearActiveBoard() {
    activeBoard.value = null
  }

  return {
    boards,
    activeBoard,
    isLoading,
    error,
    hasBoards,
    fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard,
    fetchBoard,
    setActiveBoard,
    clearActiveBoard,
  }
})

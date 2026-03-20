export interface User {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface Board {
  id: number
  user_id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Column {
  id: number
  board_id: number
  name: string
  position: number
  created_at: string
  updated_at: string
}

export interface Task {
  id: number
  column_id: number
  board_id: number
  title: string
  description: string | null
  position: number
  created_at: string
  updated_at: string
}

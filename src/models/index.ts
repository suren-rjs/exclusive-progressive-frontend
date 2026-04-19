export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface User {
  id: string
  name: string
  email: string
  username: string
  picture: string
}

export interface Problem {
  id: number
  title: string
  difficulty: Difficulty
  url: string
  solved: boolean
}

export interface Category {
  name: string
  description: string
  problems: Problem[]
  unlocked: boolean
}

export interface Topic {
  name: string
  description: string
  categories: Category[]
}

export interface BackendProgress {
  problem_id: number
  solved: boolean
  solved_at: string
}

export interface Task {
  id: string
  userId: string
  title: string
  description?: string
  status: 'inbox' | 'today' | 'upcoming' | 'someday' | 'completed'
  priority: 'none' | 'low' | 'medium' | 'high'
  dueDate?: string
  project?: string
  todorantStage: 'capture' | 'clarify' | 'organize' | 'reflect' | 'engage'
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface Project {
  id: string
  userId: string
  name: string
  color?: string
  createdAt: string
  updatedAt: string
}

export interface TodorantStage {
  id: 'capture' | 'clarify' | 'organize' | 'reflect' | 'engage'
  name: string
  description: string
  color: string
}
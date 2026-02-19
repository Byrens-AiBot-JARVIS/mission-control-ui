// Convex API references — pointing to the deployed backend functions
import type { FunctionReference } from 'convex/server'
import { anyApi } from 'convex/server'

export type CalendarType = 'cron' | 'task'

export interface CalendarEntry {
  _id: string
  _creationTime: number
  title: string
  description: string
  schedule: string
  cronExpr: string
  enabled: boolean
  type: CalendarType
  nextRunAt?: number
  lastRunAt?: number
  agentId: string
}

export type AgentStatus = 'idle' | 'active' | 'blocked'
export type TaskStatus = 'inbox' | 'assigned' | 'in_progress' | 'review' | 'done'
export type DocumentType = 'deliverable' | 'research' | 'protocol' | 'lesson-learned' | 'knowledge'

export interface Agent {
  _id: string
  _creationTime: number
  name: string
  role: string
  status: AgentStatus
  currentTaskId?: string
  sessionKey?: string
}

export interface Task {
  _id: string
  _creationTime: number
  title: string
  description: string
  status: TaskStatus
  assigneeIds: string[]
}

export interface Activity {
  _id: string
  _creationTime: number
  type: string
  agentId?: string
  message: string
  timestamp: number
}

export interface Document {
  _id: string
  _creationTime: number
  title: string
  content: string
  type: DocumentType
  taskId?: string
}

export interface Message {
  _id: string
  _creationTime: number
  taskId: string
  agentId?: string
  content: string
  timestamp: number
}

type ApiType = {
  agents: {
    list: FunctionReference<'query', 'public', Record<string, never>, Agent[]>
  }
  tasks: {
    list: FunctionReference<'query', 'public', { status?: TaskStatus }, Task[]>
  }
  activities: {
    listRecent: FunctionReference<'query', 'public', { limit?: number }, Activity[]>
  }
  documents: {
    listAll: FunctionReference<'query', 'public', Record<string, never>, Document[]>
  }
  messages: {
    listByTask: FunctionReference<'query', 'public', { taskId: string }, Message[]>
  }
  calendar: {
    listAll: FunctionReference<'query', 'public', Record<string, never>, CalendarEntry[]>
    upsertByTitle: FunctionReference<'mutation', 'public', Omit<CalendarEntry, '_id' | '_creationTime'>, string>
    toggle: FunctionReference<'mutation', 'public', { id: string }, void>
  }
}

export const api = anyApi as unknown as ApiType

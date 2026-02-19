import { useQuery } from 'convex/react'
import { api } from '../convex/api'
import type { Task } from '../convex/api'

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface ArchiveViewProps {
  onTaskClick: (task: Task) => void
}

export function ArchiveView({ onTaskClick }: ArchiveViewProps) {
  const tasks = useQuery(api.tasks.listArchived, {}) ?? []

  return (
    <div className="archive-view">
      <div className="archive-header">
        <h2 className="archive-title">🗂️ Archived Tasks</h2>
        <p className="archive-subtitle">Tasks completed more than 3 days ago</p>
      </div>
      {tasks.length === 0 && (
        <div className="empty-state" style={{ padding: '40px 20px' }}>No archived tasks yet</div>
      )}
      <div className="archive-list">
        {tasks.map(task => (
          <div key={task._id} className="archive-item" onClick={() => onTaskClick(task)}>
            <div className="archive-item-title">{task.title}</div>
            <div className="archive-item-meta">
              {task.doneAt && <span className="archive-item-date">Completed {formatDate(task.doneAt)}</span>}
              <span className="archive-item-assignees">{task.assigneeIds.length} assignee(s)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import type { Agent, Task, Activity, Document } from '../convex/api'

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

interface SummaryBarProps {
  agents: Agent[]
  tasks: Task[]
  activities: Activity[]
  documents: Document[]
}

export function SummaryBar({ agents, tasks, activities, documents }: SummaryBarProps) {
  const activeAgents = agents.filter(a => a.status === 'active').length
  const inProgress = tasks.filter(t => t.status === 'in_progress').length
  const deliverables = documents.filter(d => d.type === 'deliverable').length

  const latestActivity = activities.length > 0
    ? Math.max(...activities.map(a => a.timestamp))
    : null

  return (
    <div className="summary-bar">
      <div className="summary-stat">
        <span className="summary-number">{activeAgents}</span>
        <span className="summary-label">agents active</span>
      </div>
      <div className="summary-divider" />
      <div className="summary-stat">
        <span className="summary-number">{inProgress}</span>
        <span className="summary-label">tasks in progress</span>
      </div>
      <div className="summary-divider" />
      <div className="summary-stat">
        <span className="summary-label">last activity:</span>
        <span className="summary-number summary-number--time">
          {latestActivity ? timeAgo(latestActivity) : '—'}
        </span>
      </div>
      <div className="summary-divider" />
      <div className="summary-stat">
        <span className="summary-number">{deliverables}</span>
        <span className="summary-label">deliverables</span>
      </div>
    </div>
  )
}

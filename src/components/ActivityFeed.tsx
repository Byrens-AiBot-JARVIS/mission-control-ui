import type { Activity, Agent } from '../convex/api'

const TYPE_ICONS: Record<string, string> = {
  task: '📋',
  message: '💬',
  milestone: '🏁',
  notification: '🔔',
  status: '🔄',
  document: '📄',
  default: '•',
}

function formatTimestamp(ts: number): string {
  const now = Date.now()
  const diff = now - ts

  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  const d = new Date(ts)
  return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
}

interface ActivityFeedProps {
  activities: Activity[]
  agents: Agent[]
}

export function ActivityFeed({ activities, agents }: ActivityFeedProps) {
  return (
    <aside className="activity-feed">
      <div className="feed-header">
        <span>Activity Feed</span>
        <span className="feed-pulse">●</span>
      </div>
      <div className="feed-items">
        {activities.length === 0 && (
          <div className="empty-state" style={{ padding: '16px' }}>No activity yet</div>
        )}
        {activities.map(activity => {
          const agent = agents.find(a => a._id === activity.agentId)
          const icon = TYPE_ICONS[activity.type] || TYPE_ICONS['default']

          return (
            <div key={activity._id} className="feed-item">
              <div className="feed-icon">{icon}</div>
              <div className="feed-content">
                <div className="feed-message">{activity.message}</div>
                <div className="feed-meta">
                  {agent && <span className="feed-agent">{agent.name}</span>}
                  <span className="feed-time">{formatTimestamp(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

import type { Agent, Task } from '../convex/api'

const AGENT_EMOJIS: Record<string, string> = {
  jarvis: '🤖',
  orchestrator: '🧠',
  shabalala: '💻',
  developer: '💻',
  grizman: '🐦',
  'social-media-manager': '🐦',
}

function getEmoji(agent: Agent): string {
  const key = agent.name.toLowerCase()
  const roleKey = agent.role.toLowerCase()
  return AGENT_EMOJIS[key] || AGENT_EMOJIS[roleKey] || '🤖'
}

interface AgentRowProps {
  agents: Agent[]
  tasks: Task[]
}

export function AgentRow({ agents, tasks }: AgentRowProps) {
  return (
    <section className="agent-row">
      <div className="section-label">AGENTS</div>
      <div className="agent-cards">
        {agents.length === 0 && (
          <div className="empty-state">No agents registered</div>
        )}
        {agents.map(agent => {
          const currentTask = tasks.find(t => t._id === agent.currentTaskId)
          return (
            <div key={agent._id} className={`agent-card agent-${agent.status}`}>
              <div className="agent-emoji">{getEmoji(agent)}</div>
              <div className="agent-info">
                <div className="agent-name">{agent.name}</div>
                <div className="agent-role">{agent.role}</div>
                <div className={`agent-status-badge status-${agent.status}`}>
                  {agent.status.toUpperCase()}
                </div>
                {currentTask && (
                  <div className="agent-task" title={currentTask.title}>
                    📋 {currentTask.title}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

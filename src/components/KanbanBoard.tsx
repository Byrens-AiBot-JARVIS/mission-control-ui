import type { Agent, Task, TaskStatus } from '../convex/api'

const COLUMNS: { id: TaskStatus; label: string; icon: string }[] = [
  { id: 'inbox', label: 'Inbox', icon: '📥' },
  { id: 'assigned', label: 'Assigned', icon: '📌' },
  { id: 'in_progress', label: 'In Progress', icon: '⚡' },
  { id: 'review', label: 'Review', icon: '🔍' },
  { id: 'done', label: 'Done', icon: '✅' },
]

interface KanbanBoardProps {
  tasks: Task[]
  agents: Agent[]
  onTaskClick: (task: Task) => void
}

function TaskCard({ task, agents, onClick }: { task: Task; agents: Agent[]; onClick: () => void }) {
  const assignees = agents.filter(a => task.assigneeIds.includes(a._id))
  const snippet = task.description.length > 80
    ? task.description.slice(0, 80) + '…'
    : task.description

  return (
    <div className="task-card" onClick={onClick}>
      <div className="task-title">{task.title}</div>
      {snippet && <div className="task-snippet">{snippet}</div>}
      {assignees.length > 0 && (
        <div className="task-assignees">
          {assignees.map(a => (
            <span key={a._id} className="assignee-chip">{a.name}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export function KanbanBoard({ tasks, agents, onTaskClick }: KanbanBoardProps) {
  return (
    <section className="kanban-section">
      <div className="section-label">KANBAN BOARD</div>
      <div className="kanban-board">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id)
          return (
            <div key={col.id} className={`kanban-column kanban-${col.id}`}>
              <div className="kanban-column-header">
                <span className="column-icon">{col.icon}</span>
                <span className="column-label">{col.label}</span>
                <span className="column-count">{colTasks.length}</span>
              </div>
              <div className="kanban-cards">
                {colTasks.length === 0 && (
                  <div className="empty-column">—</div>
                )}
                {colTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    agents={agents}
                    onClick={() => onTaskClick(task)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

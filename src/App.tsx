import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from './convex/api'
import type { Task } from './convex/api'
import { Header } from './components/Header'
import { SummaryBar } from './components/SummaryBar'
import { AgentRow } from './components/AgentRow'
import { KanbanBoard } from './components/KanbanBoard'
import { ActivityFeed } from './components/ActivityFeed'
import { DocumentsPanel } from './components/DocumentsPanel'
import { LeftNav } from './components/LeftNav'
import { BottomNav } from './components/BottomNav'
import { CalendarView } from './components/CalendarView'
import './App.css'

function formatTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function TaskModal({ task, onClose, agents, documents, messages }: {
  task: Task
  onClose: () => void
  agents: ReturnType<typeof useQuery<typeof api.agents.list>>
  documents: ReturnType<typeof useQuery<typeof api.documents.listAll>>
  messages: ReturnType<typeof useQuery<typeof api.messages.listByTask>>
}) {
  const agentList = agents ?? []
  const docList = documents ?? []
  const msgList = messages ?? []

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task.title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <span className={`status-badge status-${task.status}`}>
            {task.status.replace('_', ' ')}
          </span>
          <p className="modal-description">{task.description}</p>

          <h3>Documents</h3>
          <div className="modal-docs">
            {docList
              .filter(d => d.taskId === task._id)
              .map(doc => (
                <div key={doc._id} className="doc-item">
                  <span className={`doc-type-badge doc-${doc.type}`}>{doc.type}</span>
                  <span className="doc-title">{doc.title}</span>
                </div>
              ))}
            {docList.filter(d => d.taskId === task._id).length === 0 && (
              <p className="empty-hint">No documents attached</p>
            )}
          </div>

          <h3>Messages</h3>
          <div className="modal-thread">
            {msgList.length === 0 && (
              <p className="empty-hint">No messages for this task</p>
            )}
            {msgList.map(msg => {
              const agent = agentList.find(a => a._id === msg.taskId)
              return (
                <div key={msg._id} className="thread-message">
                  <div className="thread-meta">
                    <span className="thread-agent">{agent ? agent.name : 'System'}</span>
                    <span className="thread-time">{formatTime(msg._creationTime)}</span>
                  </div>
                  <div className="thread-content">{msg.content}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function BoardView() {
  const agents = useQuery(api.agents.list, {}) ?? []
  const tasks = useQuery(api.tasks.list, {}) ?? []
  const activities = useQuery(api.activities.listRecent, { limit: 20 }) ?? []
  const documents = useQuery(api.documents.listAll, {}) ?? []
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const taskMessages = useQuery(
    api.messages.listByTask,
    selectedTask ? { taskId: selectedTask._id } : 'skip'
  )

  return (
    <>
      <div className="board-layout">
        <div className="content-area">
          <AgentRow agents={agents} tasks={tasks} />
          <KanbanBoard tasks={tasks} agents={agents} onTaskClick={setSelectedTask} />
          <DocumentsPanel documents={documents} tasks={tasks} />
        </div>
        <ActivityFeed activities={activities} agents={agents} />
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          agents={agents}
          documents={documents}
          messages={taskMessages}
        />
      )}
    </>
  )
}

function App() {
  const agents = useQuery(api.agents.list, {}) ?? []
  const tasks = useQuery(api.tasks.list, {}) ?? []
  const activities = useQuery(api.activities.listRecent, { limit: 20 }) ?? []
  const documents = useQuery(api.documents.listAll, {}) ?? []

  const isConnected = agents !== undefined

  const [activeTab, setActiveTab] = useState<'board' | 'calendar'>('board')

  return (
    <div className="app-shell">
      <Header isConnected={isConnected} />
      <div className="app-body">
        <LeftNav activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="main-content">
          {activeTab === 'board' && (
            <SummaryBar agents={agents} tasks={tasks} activities={activities} documents={documents} />
          )}
          {activeTab === 'board' && <BoardView />}
          {activeTab === 'calendar' && <CalendarView />}
        </div>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App

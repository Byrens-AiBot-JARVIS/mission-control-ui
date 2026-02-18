import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from './convex/api'
import type { Task } from './convex/api'
import { Header } from './components/Header'
import { AgentRow } from './components/AgentRow'
import { KanbanBoard } from './components/KanbanBoard'
import { ActivityFeed } from './components/ActivityFeed'
import { DocumentsPanel } from './components/DocumentsPanel'
import './App.css'

function App() {
  const agents = useQuery(api.agents.list, {}) ?? []
  const tasks = useQuery(api.tasks.list, {}) ?? []
  const activities = useQuery(api.activities.listRecent, { limit: 20 }) ?? []
  const documents = useQuery(api.documents.listAll, {}) ?? []

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const isConnected = agents !== undefined

  return (
    <div className="app">
      <Header isConnected={isConnected} />

      <div className="main-layout">
        <div className="content-area">
          <AgentRow agents={agents} tasks={tasks} />
          <KanbanBoard
            tasks={tasks}
            agents={agents}
            onTaskClick={setSelectedTask}
          />
          <DocumentsPanel documents={documents} tasks={tasks} />
        </div>
        <ActivityFeed activities={activities} agents={agents} />
      </div>

      {selectedTask && (
        <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedTask.title}</h2>
              <button className="modal-close" onClick={() => setSelectedTask(null)}>✕</button>
            </div>
            <div className="modal-body">
              <span className={`status-badge status-${selectedTask.status}`}>
                {selectedTask.status.replace('_', ' ')}
              </span>
              <p className="modal-description">{selectedTask.description}</p>
              <h3>Documents</h3>
              <div className="modal-docs">
                {documents
                  .filter(d => d.taskId === selectedTask._id)
                  .map(doc => (
                    <div key={doc._id} className="doc-item">
                      <span className={`doc-type-badge doc-${doc.type}`}>{doc.type}</span>
                      <span className="doc-title">{doc.title}</span>
                    </div>
                  ))}
                {documents.filter(d => d.taskId === selectedTask._id).length === 0 && (
                  <p className="empty-hint">No documents attached</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

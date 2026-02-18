import type { Document, Task } from '../convex/api'

const TYPE_ICONS: Record<string, string> = {
  deliverable: '🚀',
  research: '🔬',
  protocol: '📜',
}

interface DocumentsPanelProps {
  documents: Document[]
  tasks: Task[]
}

export function DocumentsPanel({ documents, tasks }: DocumentsPanelProps) {
  const deliverables = documents.filter(d => d.type === 'deliverable')
  const others = documents.filter(d => d.type !== 'deliverable')
  const sorted = [...deliverables, ...others]

  return (
    <section className="documents-panel">
      <div className="section-label">DOCUMENTS & DELIVERABLES</div>
      <div className="documents-grid">
        {sorted.length === 0 && (
          <div className="empty-state">No documents yet</div>
        )}
        {sorted.map(doc => {
          const linkedTask = tasks.find(t => t._id === doc.taskId)
          const icon = TYPE_ICONS[doc.type] ?? '📄'
          const snippet = doc.content.length > 100
            ? doc.content.slice(0, 100) + '…'
            : doc.content

          return (
            <div key={doc._id} className={`doc-card doc-card-${doc.type}`}>
              <div className="doc-card-header">
                <span className="doc-icon">{icon}</span>
                <span className={`doc-type-badge doc-${doc.type}`}>{doc.type}</span>
              </div>
              <div className="doc-card-title">{doc.title}</div>
              <div className="doc-card-snippet">{snippet}</div>
              {linkedTask && (
                <div className="doc-task-link">📋 {linkedTask.title}</div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

import { useState } from 'react'
import type { Document, Task, DocumentType } from '../convex/api'

const TYPE_ICONS: Record<DocumentType, string> = {
  deliverable: '🚀',
  research: '🔬',
  protocol: '📜',
  'lesson-learned': '💡',
  knowledge: '📚',
}

const TYPE_ORDER: DocumentType[] = ['deliverable', 'research', 'protocol', 'lesson-learned', 'knowledge']

const TYPE_LABELS: Record<DocumentType, string> = {
  deliverable: 'Deliverables',
  research: 'Research',
  protocol: 'Protocols',
  'lesson-learned': 'Lessons Learned',
  knowledge: 'Knowledge',
}

const SNIPPET_LIMIT = 120

function DocCard({ doc, linkedTask }: { doc: Document; linkedTask?: Task }) {
  const [expanded, setExpanded] = useState(false)
  const icon = TYPE_ICONS[doc.type] ?? '📄'
  const isLong = doc.content.length > SNIPPET_LIMIT
  const snippet = (!expanded && isLong)
    ? doc.content.slice(0, SNIPPET_LIMIT) + '…'
    : doc.content

  return (
    <div className={`doc-card doc-card-${doc.type}`}>
      <div className="doc-card-header">
        <span className="doc-icon">{icon}</span>
        <span className={`doc-type-badge doc-${doc.type}`}>{doc.type}</span>
      </div>
      <div className="doc-card-title">{doc.title}</div>
      <div className="doc-card-snippet">{snippet}</div>
      {isLong && (
        <button
          className="doc-expand-btn"
          onClick={() => setExpanded(e => !e)}
        >
          {expanded ? 'Show less ▲' : 'Show more ▼'}
        </button>
      )}
      {linkedTask && (
        <div className="doc-task-link">📋 {linkedTask.title}</div>
      )}
    </div>
  )
}

interface DocumentsPanelProps {
  documents: Document[]
  tasks: Task[]
}

export function DocumentsPanel({ documents, tasks }: DocumentsPanelProps) {
  if (documents.length === 0) {
    return (
      <section className="documents-panel">
        <div className="section-label">DOCUMENTS & DELIVERABLES</div>
        <div className="empty-state">No documents yet</div>
      </section>
    )
  }

  // Group by type, only include types that have documents
  const grouped = TYPE_ORDER
    .map(type => ({ type, docs: documents.filter(d => d.type === type) }))
    .filter(g => g.docs.length > 0)

  // Any docs with unknown types
  const knownTypes = new Set(TYPE_ORDER)
  const unknownDocs = documents.filter(d => !knownTypes.has(d.type))

  return (
    <section className="documents-panel">
      <div className="section-label">DOCUMENTS & DELIVERABLES</div>
      <div className="documents-groups">
        {grouped.map(({ type, docs }) => (
          <div key={type} className="doc-group">
            <div className="doc-group-heading">
              <span className="doc-group-icon">{TYPE_ICONS[type]}</span>
              <span>{TYPE_LABELS[type]}</span>
              <span className="doc-group-count">{docs.length}</span>
            </div>
            <div className="documents-grid">
              {docs.map(doc => (
                <DocCard
                  key={doc._id}
                  doc={doc}
                  linkedTask={tasks.find(t => t._id === doc.taskId)}
                />
              ))}
            </div>
          </div>
        ))}
        {unknownDocs.length > 0 && (
          <div className="doc-group">
            <div className="doc-group-heading">
              <span>Other</span>
              <span className="doc-group-count">{unknownDocs.length}</span>
            </div>
            <div className="documents-grid">
              {unknownDocs.map(doc => (
                <DocCard
                  key={doc._id}
                  doc={doc}
                  linkedTask={tasks.find(t => t._id === doc.taskId)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

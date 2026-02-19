interface NavItem {
  id: 'board' | 'calendar' | 'archive'
  icon: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'board', icon: '📋', label: 'Task Board' },
  { id: 'calendar', icon: '📅', label: 'Calendar' },
  { id: 'archive', icon: '🗂️', label: 'Archive' },
]

const AGENTS = [
  { name: 'Jarvis', color: '#4f9cf9' },
  { name: 'Shabalala', color: '#3dd68c' },
  { name: 'Grizman', color: '#b794f4' },
]

interface LeftNavProps {
  activeTab: 'board' | 'calendar' | 'archive'
  onTabChange: (tab: 'board' | 'calendar' | 'archive') => void
}

export function LeftNav({ activeTab, onTabChange }: LeftNavProps) {
  return (
    <nav className="left-nav">
      <div className="left-nav-brand">
        <span className="left-nav-brand-emoji">🎯</span>
        <span className="left-nav-brand-text">Mission Control</span>
      </div>

      <div className="left-nav-items">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`left-nav-item${activeTab === item.id ? ' left-nav-item--active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="left-nav-item-icon">{item.icon}</span>
            <span className="left-nav-item-label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="left-nav-agents">
        <div className="left-nav-agents-title">Agents</div>
        {AGENTS.map(agent => (
          <div key={agent.name} className="left-nav-agent">
            <span className="left-nav-agent-dot" style={{ backgroundColor: agent.color }} />
            <span className="left-nav-agent-name">{agent.name}</span>
          </div>
        ))}
      </div>
    </nav>
  )
}

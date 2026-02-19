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

interface BottomNavProps {
  activeTab: 'board' | 'calendar' | 'archive'
  onTabChange: (tab: 'board' | 'calendar' | 'archive') => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`bottom-nav-item${activeTab === item.id ? ' bottom-nav-item--active' : ''}`}
          onClick={() => onTabChange(item.id)}
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

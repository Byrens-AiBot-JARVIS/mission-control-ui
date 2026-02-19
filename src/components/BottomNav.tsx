interface NavItem {
  id: 'board' | 'calendar'
  icon: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'board', icon: '📋', label: 'Task Board' },
  { id: 'calendar', icon: '📅', label: 'Calendar' },
]

interface BottomNavProps {
  activeTab: 'board' | 'calendar'
  onTabChange: (tab: 'board' | 'calendar') => void
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

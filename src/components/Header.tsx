interface HeaderProps {
  isConnected: boolean
}

export function Header({ isConnected }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">Mission Control <span className="header-emoji">🎯</span></h1>
        <span className="header-subtitle">Agent Team Dashboard</span>
      </div>
      <div className="header-right">
        <div className={`live-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          <span className="live-dot" />
          <span className="live-label">{isConnected ? 'LIVE' : 'CONNECTING…'}</span>
        </div>
        <div className="header-convex">
          <span className="convex-logo">⚡</span>
          <span>Convex</span>
        </div>
      </div>
    </header>
  )
}

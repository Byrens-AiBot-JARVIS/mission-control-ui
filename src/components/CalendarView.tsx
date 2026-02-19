import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../convex/api'
import type { CalendarEntry } from '../convex/api'

// ── Simple cron parser ──────────────────────────────────────────────────────
// Returns true if the entry should appear on the given Date
function cronMatchesDate(cronExpr: string, date: Date): boolean {
  const parts = cronExpr.trim().split(/\s+/)
  if (parts.length !== 5) return false
  // const minute = parts[0]  // not used for day-level matching
  // const hour = parts[1]    // not used for day-level matching
  const dayOfMonth = parts[2]
  const month = parts[3]
  const dayOfWeek = parts[4]

  // Month check (1-indexed in cron, 0-indexed in JS)
  if (month !== '*') {
    const cronMonth = parseInt(month)
    if (date.getMonth() + 1 !== cronMonth) return false
  }

  // Day-of-week check (0=Sun) — supports comma-separated values e.g. "2,4"
  if (dayOfWeek !== '*') {
    const cronDows = dayOfWeek.split(',').map(d => parseInt(d.trim()))
    if (!cronDows.includes(date.getDay())) return false
  }

  // Day-of-month check
  if (dayOfMonth !== '*') {
    const cronDom = parseInt(dayOfMonth)
    if (date.getDate() !== cronDom) return false
  }

  return true
}

function getCronHour(cronExpr: string): number {
  const parts = cronExpr.trim().split(/\s+/)
  return parts.length >= 2 ? parseInt(parts[1]) || 0 : 0
}

// ── Detail modal ──────────────────────────────────────────────────────────
function EntryModal({ entry, onClose }: { entry: CalendarEntry; onClose: () => void }) {
  const toggle = useMutation(api.calendar.toggle)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{entry.title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p className="modal-description">{entry.description}</p>
          <div className="cal-detail-grid">
            <span className="cal-detail-label">Schedule</span>
            <span>{entry.schedule}</span>
            <span className="cal-detail-label">Cron</span>
            <code className="cal-detail-code">{entry.cronExpr}</code>
            <span className="cal-detail-label">Agent</span>
            <span>{entry.agentId}</span>
            <span className="cal-detail-label">Status</span>
            <span>
              <button
                className={`cal-toggle-btn${entry.enabled ? '' : ' cal-toggle-btn--off'}`}
                onClick={() => toggle({ id: entry._id })}
              >
                {entry.enabled ? '✅ Enabled' : '⏸ Disabled'}
              </button>
            </span>
            {entry.nextRunAt && (
              <>
                <span className="cal-detail-label">Next run</span>
                <span>{new Date(entry.nextRunAt).toLocaleString('sv-SE')}</span>
              </>
            )}
            {entry.lastRunAt && (
              <>
                <span className="cal-detail-label">Last run</span>
                <span>{new Date(entry.lastRunAt).toLocaleString('sv-SE')}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────
export function CalendarView() {
  const entries = useQuery(api.calendar.listAll, {}) ?? []
  const toggle = useMutation(api.calendar.toggle)

  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth()) // 0-indexed
  const [selected, setSelected] = useState<CalendarEntry | null>(null)

  // Build calendar grid for viewYear/viewMonth
  const firstDay = new Date(viewYear, viewMonth, 1)
  const lastDay = new Date(viewYear, viewMonth + 1, 0)
  const startPad = firstDay.getDay() // 0=Sun
  const daysInMonth = lastDay.getDate()

  const monthName = firstDay.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  // Pre-compute entries per day
  const dayEntries: CalendarEntry[][] = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(viewYear, viewMonth, i + 1)
    return entries
      .filter(e => cronMatchesDate(e.cronExpr, date))
      .sort((a, b) => getCronHour(a.cronExpr) - getCronHour(b.cronExpr))
  })

  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day

  return (
    <div className="calendar-view">
      {/* Legend */}
      <div className="calendar-legend">
        <span className="cal-legend-item cal-legend-cron">⬤ Cron Job</span>
        <span className="cal-legend-item cal-legend-task">⬤ Task</span>
        <span className="cal-legend-item cal-legend-disabled">⬤ Disabled</span>
      </div>

      {/* Month navigation */}
      <div className="calendar-header">
        <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
        <h2 className="cal-month-title">{monthName}</h2>
        <button className="cal-nav-btn" onClick={nextMonth}>›</button>
      </div>

      {/* Day-of-week headers */}
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="calendar-dow">{d}</div>
        ))}

        {/* Empty padding cells */}
        {Array.from({ length: startPad }, (_, i) => (
          <div key={`pad-${i}`} className="calendar-day calendar-day--empty" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const dayEs = dayEntries[i]
          return (
            <div key={day} className={`calendar-day${isToday(day) ? ' calendar-day--today' : ''}`}>
              <span className="calendar-day-num">{day}</span>
              {dayEs.map(entry => (
                <div
                  key={entry._id}
                  className={`calendar-entry calendar-entry--${entry.type}${entry.enabled ? '' : ' calendar-entry--disabled'}`}
                  onClick={() => setSelected(entry)}
                  title={entry.title}
                >
                  {entry.title}
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* List view */}
      <div className="cal-list">
        <h3 className="cal-list-title">All Scheduled Jobs</h3>
        {entries.length === 0 && <p className="empty-hint">No calendar entries</p>}
        {entries.map(entry => (
          <div
            key={entry._id}
            className={`cal-list-item${entry.enabled ? '' : ' cal-list-item--disabled'}`}
          >
            <div className={`cal-list-dot cal-list-dot--${entry.type}${entry.enabled ? '' : ' cal-list-dot--off'}`} />
            <div className="cal-list-info" onClick={() => setSelected(entry)}>
              <span className="cal-list-title-text">{entry.title}</span>
              <span className="cal-list-schedule">{entry.schedule}</span>
              <span className="cal-list-agent">{entry.agentId}</span>
            </div>
            <button
              className={`cal-toggle-btn${entry.enabled ? '' : ' cal-toggle-btn--off'}`}
              onClick={() => toggle({ id: entry._id })}
            >
              {entry.enabled ? 'ON' : 'OFF'}
            </button>
          </div>
        ))}
      </div>

      {selected && <EntryModal entry={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

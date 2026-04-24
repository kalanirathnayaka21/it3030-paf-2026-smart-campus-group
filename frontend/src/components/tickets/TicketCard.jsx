const PRIORITY_STYLE = {
  LOW:      { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.25)' },
  MEDIUM:   { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)'  },
  HIGH:     { color: '#f97316', bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.3)'  },
  CRITICAL: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)'   },
}
const STATUS_STYLE = {
  OPEN:        { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',   border: 'rgba(96,165,250,0.3)'   },
  IN_PROGRESS: { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)'  },
  RESOLVED:    { color: '#34d399', bg: 'rgba(52,211,153,0.12)',   border: 'rgba(52,211,153,0.3)'   },
  CLOSED:      { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',   border: 'rgba(148,163,184,0.25)' },
}
const CATEGORY_ICON = {
  MAINTENANCE: '🔨', ELECTRICAL: '⚡', PLUMBING: '🚿',
  CLEANING: '🧹', IT_SUPPORT: '💻', OTHER: '📌',
}

/**
 * Reusable ticket card.
 * @param {object}   ticket   – TicketResponse from API
 * @param {function} onClick  – navigate to detail page
 * @param {function} onAssign – technician "Take this" action (optional)
 * @param {function} onStatus – technician status change (optional, receives (ticket, newStatus))
 */
export default function TicketCard({ ticket, onClick, onAssign, onStatus }) {
  const p = PRIORITY_STYLE[ticket.priority] || PRIORITY_STYLE.MEDIUM
  const s = STATUS_STYLE[ticket.status]   || STATUS_STYLE.OPEN
  const catIcon = CATEGORY_ICON[ticket.category] || '📌'

  return (
    <div className="ticket-card" onClick={() => onClick && onClick(ticket)}>
      <div className="ticket-card-header">
        <span className="ticket-category">{catIcon} {ticket.category?.replace(/_/g,' ')}</span>
        <div style={{ display:'flex', gap:'0.5rem' }}>
          <span className="role-badge" style={{ background: p.bg, color: p.color, border:`1px solid ${p.border}` }}>
            {ticket.priority}
          </span>
          <span className="role-badge" style={{ background: s.bg, color: s.color, border:`1px solid ${s.border}` }}>
            {ticket.status?.replace(/_/g,' ')}
          </span>
        </div>
      </div>

      <h3 className="ticket-title">{ticket.title}</h3>
      <p className="ticket-desc">{ticket.description}</p>

      <div className="ticket-meta">
        <span>👤 {ticket.reporterName}</span>
        {ticket.assignedToName && <span>🔧 {ticket.assignedToName}</span>}
        <span>🕐 {new Date(ticket.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Technician actions */}
      {(onAssign || onStatus) && (
        <div className="ticket-actions" onClick={e => e.stopPropagation()}>
          {onAssign && ticket.status === 'OPEN' && (
            <button className="btn-approve" style={{fontSize:'0.78rem'}} onClick={() => onAssign(ticket.id)}>
              🙋 Take this ticket
            </button>
          )}
          {onStatus && ticket.status === 'IN_PROGRESS' && (
            <button className="btn-approve" style={{fontSize:'0.78rem'}} onClick={() => onStatus(ticket.id,'RESOLVED')}>
              ✅ Mark Resolved
            </button>
          )}
          {onStatus && ticket.status === 'RESOLVED' && (
            <button className="btn-ghost" style={{fontSize:'0.78rem'}} onClick={() => onStatus(ticket.id,'CLOSED')}>
              🔒 Close
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export { STATUS_STYLE, PRIORITY_STYLE, CATEGORY_ICON }

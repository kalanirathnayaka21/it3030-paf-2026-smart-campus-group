import { useState, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../api/api'
import CommentThread from '../../components/tickets/CommentThread'
import { STATUS_STYLE, PRIORITY_STYLE, CATEGORY_ICON } from '../../components/tickets/TicketCard'
import { useAuth } from '../../context/AuthContext'

function fmt(dt) {
  return dt ? new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—'
}

export default function TicketDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [ticket, setTicket]     = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  const isStaff = user?.role === 'ADMIN' || user?.role === 'TECHNICIAN'

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [tRes, cRes] = await Promise.all([
        api.get(`/tickets/${id}`),
        api.get(`/tickets/${id}/comments`),
      ])
      setTicket(tRes.data)
      setComments(cRes.data)
    } catch (e) { setError(e.response?.data?.error || 'Failed to load ticket.') }
    finally  { setLoading(false) }
  }, [id])

  useEffect(() => { load() }, [load])

  const handleAssign = async () => {
    try { await api.patch(`/tickets/${id}/assign`); load() }
    catch (e) { setError(e.response?.data?.error || 'Assign failed.') }
  }
  const handleStatus = async (newStatus) => {
    try { await api.patch(`/tickets/${id}/status`, { status: newStatus }); load() }
    catch (e) { setError(e.response?.data?.error || 'Status update failed.') }
  }

  const p = ticket ? (PRIORITY_STYLE[ticket.priority] || PRIORITY_STYLE.MEDIUM) : null
  const s = ticket ? (STATUS_STYLE[ticket.status]    || STATUS_STYLE.OPEN) : null

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
            <rect width="32" height="32" rx="10" fill="url(#tdg)" />
            <path d="M8 24V14l8-5 8 5v10H20v-6h-4v6H8z" fill="white" />
            <defs><linearGradient id="tdg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" /><stop offset="1" stopColor="#8b5cf6" />
            </linearGradient></defs>
          </svg>
          <span>Smart Campus</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">🏠 Dashboard</Link>
          <Link to="/tickets/my" className="nav-item">🎫 My Tickets</Link>
          <Link to="/tickets/report" className="nav-item">📝 Report Issue</Link>
          {isStaff && <Link to="/technician" className="nav-item">🔧 All Tickets</Link>}
        </nav>
      </aside>

      <main className="main-content">
        {loading && <div className="login-loading"><div className="spinner" /></div>}
        {error && <div className="login-error">{error}</div>}

        {!loading && ticket && (
          <>
            <div className="page-header">
              <div>
                <Link to="/tickets/my" className="btn-ghost" style={{marginBottom:'0.75rem',display:'inline-flex'}}>← Back</Link>
                <h1 className="page-title" style={{fontSize:'1.4rem'}}>{ticket.title}</h1>
                <p className="page-subtitle">
                  {CATEGORY_ICON[ticket.category]} {ticket.category?.replace(/_/g,' ')}
                  {' · '}Reported by <strong>{ticket.reporterName}</strong>
                  {' · '}{fmt(ticket.createdAt)}
                </p>
              </div>
              <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',alignItems:'center'}}>
                <span className="role-badge" style={{background:p.bg,color:p.color,border:`1px solid ${p.border}`}}>{ticket.priority}</span>
                <span className="role-badge" style={{background:s.bg,color:s.color,border:`1px solid ${s.border}`}}>{ticket.status?.replace(/_/g,' ')}</span>
              </div>
            </div>

            <div className="card" style={{marginBottom:'1.5rem'}}>
              <p style={{color:'var(--text-secondary)',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{ticket.description}</p>

              {ticket.imageUrls?.length > 0 && (
                <div className="ticket-images">
                  {ticket.imageUrls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer">
                      <img src={url} alt={`Evidence ${i+1}`} className="ticket-img-thumb"
                           onError={e => { e.target.style.display='none' }} />
                    </a>
                  ))}
                </div>
              )}

              <div className="ticket-meta" style={{marginTop:'1.25rem'}}>
                <span>👤 Reporter: {ticket.reporterName}</span>
                <span>🔧 Assigned to: {ticket.assignedToName || 'Unassigned'}</span>
                <span>🕐 Updated: {fmt(ticket.updatedAt)}</span>
              </div>
            </div>

            {/* Technician/Admin actions */}
            {isStaff && (
              <div style={{display:'flex',gap:'0.75rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
                {ticket.status === 'OPEN' && (
                  <button className="btn-approve" onClick={handleAssign}>🙋 Take this ticket</button>
                )}
                {ticket.status === 'IN_PROGRESS' && (
                  <button className="btn-approve" onClick={() => handleStatus('RESOLVED')}>✅ Mark Resolved</button>
                )}
                {ticket.status === 'RESOLVED' && (
                  <button className="btn-ghost" onClick={() => handleStatus('CLOSED')}>🔒 Close Ticket</button>
                )}
              </div>
            )}

            <CommentThread ticketId={id} comments={comments} onCommentAdded={load} />
          </>
        )}
      </main>
    </div>
  )
}

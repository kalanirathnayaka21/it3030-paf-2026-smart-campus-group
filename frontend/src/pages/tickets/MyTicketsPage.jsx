import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/api'
import TicketCard from '../../components/tickets/TicketCard'

export default function MyTicketsPage() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/tickets/my')
      setTickets(res.data)
    } catch { setError('Failed to load tickets.') }
    finally  { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
            <rect width="32" height="32" rx="10" fill="url(#mtg)" />
            <path d="M8 24V14l8-5 8 5v10H20v-6h-4v6H8z" fill="white" />
            <defs><linearGradient id="mtg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" /><stop offset="1" stopColor="#8b5cf6" />
            </linearGradient></defs>
          </svg>
          <span>Smart Campus</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">🏠 Dashboard</Link>
          <Link to="/resources" className="nav-item">🏢 Resources</Link>
          <Link to="/bookings/my" className="nav-item">📅 My Bookings</Link>
          <Link to="/tickets/my" className="nav-item active">🎫 My Tickets</Link>
          <Link to="/tickets/report" className="nav-item">📝 Report Issue</Link>
          <Link to="/notifications" className="nav-item">🔔 Notifications</Link>
        </nav>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Tickets 🎫</h1>
            <p className="page-subtitle">Track your maintenance and support requests</p>
          </div>
          <Link to="/tickets/report" className="btn btn-primary">+ Report Issue</Link>
        </div>

        {error && <div className="login-error" style={{ marginBottom:'1.5rem' }}>{error}</div>}

        {loading ? (
          <div className="login-loading"><div className="spinner" /><span>Loading…</span></div>
        ) : tickets.length === 0 ? (
          <div className="empty-state">
            <div style={{fontSize:'3rem'}}>🎫</div>
            <p>No tickets yet.</p>
            <Link to="/tickets/report" className="btn btn-primary" style={{marginTop:'1rem'}}>Report an Issue</Link>
          </div>
        ) : (
          <div className="ticket-grid">
            {tickets.map(t => (
              <TicketCard key={t.id} ticket={t} onClick={tk => navigate(`/tickets/${tk.id}`)} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

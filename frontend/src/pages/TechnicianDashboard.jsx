import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/api'
import TicketCard from '../components/tickets/TicketCard'
import { useAuth } from '../context/AuthContext'

const STATUS_TABS = [
  { label:'All',         value:'' },
  { label:'Open',        value:'OPEN' },
  { label:'In Progress', value:'IN_PROGRESS' },
  { label:'Resolved',    value:'RESOLVED' },
]

export default function TechnicianDashboard() {
  const { user, logout } = useAuth()
  const [tickets,  setTickets]  = useState([])
  const [tab,      setTab]      = useState('')
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/tickets')
      setTickets(res.data)
    } catch { setError('Failed to load tickets.') }
    finally  { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleAssign = async (ticketId) => {
    try { await api.patch(`/tickets/${ticketId}/assign`); load() }
    catch (e) { setError(e.response?.data?.error || 'Assign failed.') }
  }
  const handleStatus = async (ticketId, newStatus) => {
    try { await api.patch(`/tickets/${ticketId}/status`, { status: newStatus }); load() }
    catch (e) { setError(e.response?.data?.error || 'Status update failed.') }
  }

  const filtered = tab ? tickets.filter(t => t.status === tab) : tickets

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
            <rect width="32" height="32" rx="10" fill="url(#tcg)" />
            <path d="M8 24V14l8-5 8 5v10H20v-6h-4v6H8z" fill="white" />
            <defs><linearGradient id="tcg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06b6d4" /><stop offset="1" stopColor="#0891b2" />
            </linearGradient></defs>
          </svg>
          <span>Smart Campus</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">🏠 Dashboard</Link>
          <Link to="/technician" className="nav-item active">🔧 All Tickets</Link>
          <Link to="/notifications" className="nav-item">🔔 Notifications</Link>
        </nav>
        <button className="sidebar-logout" onClick={() => { logout(); window.location.href='/login' }}>
          <span>↩</span> Sign Out
        </button>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Technician Dashboard 🔧</h1>
            <p className="page-subtitle">
              Welcome, {user?.name} · {tickets.filter(t => t.status==='OPEN').length} open tickets
            </p>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="tab-bar">
          {STATUS_TABS.map(t => (
            <button key={t.value} className={`tab-btn ${tab===t.value?'active':''}`} onClick={() => setTab(t.value)}>
              {t.label}
              {t.value === '' && <span style={{marginLeft:'0.4rem',color:'var(--text-muted)',fontSize:'0.8rem'}}>({tickets.length})</span>}
              {t.value !== '' && <span style={{marginLeft:'0.4rem',color:'var(--text-muted)',fontSize:'0.8rem'}}>({tickets.filter(x=>x.status===t.value).length})</span>}
            </button>
          ))}
        </div>

        {error && <div className="login-error" style={{marginBottom:'1.5rem'}}>{error}</div>}

        {loading ? (
          <div className="login-loading"><div className="spinner" /><span>Loading tickets…</span></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div style={{fontSize:'3rem'}}>✅</div>
            <p>No tickets in this category.</p>
          </div>
        ) : (
          <div className="ticket-grid">
            {filtered.map(t => (
              <TicketCard
                key={t.id}
                ticket={t}
                onClick={tk => window.location.href=`/tickets/${tk.id}`}
                onAssign={handleAssign}
                onStatus={handleStatus}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

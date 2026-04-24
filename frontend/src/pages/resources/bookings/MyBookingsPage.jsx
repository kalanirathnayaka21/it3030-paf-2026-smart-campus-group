import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/api'
// Status colors
const STATUS_STYLE = {
  PENDING: { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24', border: 'rgba(245,158,11,0.35)' },
  APPROVED: { bg: 'rgba(16,185,129,0.15)', text: '#34d399', border: 'rgba(16,185,129,0.35)' },
  REJECTED: { bg: 'rgba(244,63,94,0.12)', text: '#f87171', border: 'rgba(244,63,94,0.3)' },
  CANCELLED: { bg: 'rgba(100,116,139,0.15)', text: '#94a3b8', border: 'rgba(100,116,139,0.3)' },
}

function fmt(dt) {
  return dt ? new Date(dt).toLocaleString(undefined, {
    dateStyle: 'medium', timeStyle: 'short'
  }) : '—'
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/bookings/my')
      setBookings(res.data)
    } catch { setError('Failed to load bookings.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    try {
      await api.delete(`/bookings/${id}/cancel`)
      await load()
    } catch (e) { setError(e.response?.data?.error || 'Cancel failed.') }
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
            <rect width="32" height="32" rx="10" fill="url(#mbg)" />
            <path d="M8 24V14l8-5 8 5v10H20v-6h-4v6H8z" fill="white" />
            <defs><linearGradient id="mbg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" /><stop offset="1" stopColor="#8b5cf6" />
            </linearGradient></defs>
          </svg>
          <span>Smart Campus</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">🏠 Dashboard</Link>
          <Link to="/resources" className="nav-item">🏢 Resources</Link>
          <Link to="/bookings/my" className="nav-item active">📅 My Bookings</Link>
        </nav>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Bookings 📅</h1>
            <p className="page-subtitle">Your resource booking history</p>
          </div>
          <Link to="/resources" className="btn btn-primary">+ New Booking</Link>
        </div>

        {error && <div className="login-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

        {loading ? (
          <div className="login-loading"><div className="spinner" /><span>Loading…</span></div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>📅</div>
            <p>No bookings yet.</p>
            <Link to="/resources" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Resources</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map(b => {
              const s = STATUS_STYLE[b.status] || STATUS_STYLE.CANCELLED
              return (
                <div key={b.id} className="card booking-card">
                  <div className="booking-card-header">
                    <div>
                      <h3 className="booking-resource-name">{b.resourceName}</h3>
                      <span className="booking-resource-loc">📍 {b.resourceLocation}</span>
                    </div>
                    <span className="role-badge" style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
                      {b.status}
                    </span>
                  </div>
                  <div className="booking-meta">
                    <span>🕐 {fmt(b.startTime)} → {fmt(b.endTime)}</span>
                    <span>👥 {b.attendees} attendee{b.attendees !== 1 ? 's' : ''}</span>
                  </div>
                  <p className="booking-purpose">"{b.purpose}"</p>
                  {b.rejectionReason && (
                    <div className="login-error" style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}>
                      <strong>Reason:</strong> {b.rejectionReason}
                    </div>
                  )}
                  {b.status === 'PENDING' && (
                    <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                      <button className="btn-danger" onClick={() => handleCancel(b.id)}>
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

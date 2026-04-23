import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/api'
import RejectModal from '../../components/bookings/RejectModal'

const STATUS_STYLE = {
  PENDING:   { bg: 'rgba(245,158,11,0.15)',  text: '#fbbf24', border: 'rgba(245,158,11,0.35)' },
  APPROVED:  { bg: 'rgba(16,185,129,0.15)',  text: '#34d399', border: 'rgba(16,185,129,0.35)' },
  REJECTED:  { bg: 'rgba(244,63,94,0.12)',   text: '#f87171', border: 'rgba(244,63,94,0.3)' },
  CANCELLED: { bg: 'rgba(100,116,139,0.15)', text: '#94a3b8', border: 'rgba(100,116,139,0.3)' },
}

function fmt(dt) {
  return dt ? new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—'
}

export default function AdminBookingsPage() {
  const [bookings,    setBookings]    = useState([])
  const [tab,         setTab]         = useState('PENDING') // 'PENDING' | 'ALL'
  const [loading,     setLoading]     = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error,       setError]       = useState('')
  const [rejectTarget, setRejectTarget] = useState(null) // booking id

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const url = tab === 'PENDING' ? '/bookings/pending' : '/bookings'
      const res = await api.get(url)
      setBookings(res.data)
    } catch { setError('Failed to load bookings.') }
    finally  { setLoading(false) }
  }, [tab])

  useEffect(() => { load() }, [load])

  const handleApprove = async (id) => {
    setActionLoading(true)
    try { await api.patch(`/bookings/${id}/approve`); await load() }
    catch (e) { setError(e.response?.data?.error || 'Approve failed.') }
    finally { setActionLoading(false) }
  }

  const handleReject = async (reason) => {
    setActionLoading(true)
    try { await api.patch(`/bookings/${rejectTarget}/reject`, { reason }); setRejectTarget(null); await load() }
    catch (e) { setError(e.response?.data?.error || 'Reject failed.') }
    finally { setActionLoading(false) }
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
            <rect width="32" height="32" rx="10" fill="url(#abg)" />
            <path d="M8 24V14l8-5 8 5v10H20v-6h-4v6H8z" fill="white" />
            <defs><linearGradient id="abg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" /><stop offset="1" stopColor="#8b5cf6" />
            </linearGradient></defs>
          </svg>
          <span>Smart Campus</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">🏠 Dashboard</Link>
          <Link to="/resources" className="nav-item">🏢 Resources</Link>
          <Link to="/admin/resources" className="nav-item">⚙️ Manage Resources</Link>
          <Link to="/admin/bookings" className="nav-item active">📋 All Bookings</Link>
        </nav>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Booking Management 📋</h1>
            <p className="page-subtitle">Review, approve, and reject booking requests</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-bar">
          <button className={`tab-btn ${tab === 'PENDING' ? 'active' : ''}`} onClick={() => setTab('PENDING')}>
            ⏳ Pending Requests
          </button>
          <button className={`tab-btn ${tab === 'ALL' ? 'active' : ''}`} onClick={() => setTab('ALL')}>
            📋 All Bookings
          </button>
        </div>

        {error && <div className="login-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

        {loading ? (
          <div className="login-loading"><div className="spinner" /><span>Loading…</span></div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>{tab === 'PENDING' ? '✅' : '📋'}</div>
            <p>{tab === 'PENDING' ? 'No pending bookings — all clear!' : 'No bookings found.'}</p>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Requested By</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Attendees</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  {tab === 'PENDING' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => {
                  const s = STATUS_STYLE[b.status] || STATUS_STYLE.CANCELLED
                  return (
                    <tr key={b.id}>
                      <td>
                        <strong>{b.resourceName}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.resourceLocation}</div>
                      </td>
                      <td>
                        <div>{b.userName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.userEmail}</div>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{fmt(b.startTime)}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{fmt(b.endTime)}</td>
                      <td style={{ textAlign: 'center' }}>{b.attendees}</td>
                      <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          title={b.purpose}>{b.purpose}</td>
                      <td>
                        <span className="role-badge" style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
                          {b.status}
                        </span>
                        {b.rejectionReason && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            {b.rejectionReason}
                          </div>
                        )}
                      </td>
                      {tab === 'PENDING' && (
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-approve" onClick={() => handleApprove(b.id)} disabled={actionLoading}>
                              ✅ Approve
                            </button>
                            <button className="btn-danger" onClick={() => setRejectTarget(b.id)} disabled={actionLoading}>
                              ✕ Reject
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {rejectTarget && (
          <RejectModal
            onConfirm={handleReject}
            onClose={() => setRejectTarget(null)}
            loading={actionLoading}
          />
        )}
      </main>
    </div>
  )
}

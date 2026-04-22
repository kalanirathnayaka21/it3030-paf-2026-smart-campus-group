import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext'

const TYPE_META = {
  BOOKING_APPROVED:     { icon: '✅', color: '#34d399' },
  BOOKING_REJECTED:     { icon: '❌', color: '#f87171' },
  TICKET_ASSIGNED:      { icon: '🔧', color: '#a78bfa' },
  TICKET_STATUS_CHANGED:{ icon: '📋', color: '#60a5fa' },
  NEW_COMMENT:          { icon: '💬', color: '#fbbf24' },
}

export default function NotificationsPage() {
  const { notifications, fetchAll, markRead, markAllRead } = useNotifications()

  useEffect(() => { fetchAll() }, [fetchAll])

  const fmt = (dt) => new Date(dt).toLocaleString(undefined, { dateStyle:'medium', timeStyle:'short' })

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
            <rect width="32" height="32" rx="10" fill="url(#npg)" />
            <path d="M8 24V14l8-5 8 5v10H20v-6h-4v6H8z" fill="white" />
            <defs><linearGradient id="npg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" /><stop offset="1" stopColor="#8b5cf6" />
            </linearGradient></defs>
          </svg>
          <span>Smart Campus</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">🏠 Dashboard</Link>
          <Link to="/resources" className="nav-item">🏢 Resources</Link>
          <Link to="/bookings/my" className="nav-item">📅 My Bookings</Link>
          <Link to="/tickets/my" className="nav-item">🎫 My Tickets</Link>
          <Link to="/notifications" className="nav-item active">🔔 Notifications</Link>
        </nav>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Notifications 🔔</h1>
            <p className="page-subtitle">Stay updated on your bookings and tickets</p>
          </div>
          <button className="btn-ghost" onClick={markAllRead}>Mark all as read</button>
        </div>

        {notifications === null ? (
          <div className="login-loading"><div className="spinner" /><span>Loading…</span></div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <div style={{fontSize:'3rem'}}>🔔</div>
            <p>No notifications yet. You're all caught up!</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {notifications.map(n => {
              const meta = TYPE_META[n.type] || { icon:'🔔', color:'#94a3b8' }
              return (
                <div
                  key={n.id}
                  className={`notif-item ${!n.isRead ? 'notif-unread' : ''}`}
                  onClick={() => !n.isRead && markRead(n.id)}
                >
                  <div className="notif-icon" style={{ color: meta.color }}>{meta.icon}</div>
                  <div className="notif-body">
                    <p className="notif-message">{n.message}</p>
                    <span className="notif-time">{fmt(n.createdAt)}</span>
                  </div>
                  {!n.isRead && <div className="notif-dot" />}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

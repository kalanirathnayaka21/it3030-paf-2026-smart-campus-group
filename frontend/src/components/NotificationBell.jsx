import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext'

/**
 * Bell icon button with unread badge.
 * Clicking navigates to the /notifications page.
 */
export default function NotificationBell() {
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()

  return (
    <button
      className="notif-bell"
      onClick={() => navigate('/notifications')}
      aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ''}`}
      title="Notifications"
    >
      🔔
      {unreadCount > 0 && (
        <span className="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
      )}
    </button>
  )
}

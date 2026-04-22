import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from './AuthContext'
import api from '../api/api'

const NotificationContext = createContext(null)

const POLL_INTERVAL_MS = 30_000 // 30 seconds

/**
 * Provides notification state across the app.
 * Polls /api/notifications/unread-count every 30 seconds while logged in.
 */
export function NotificationProvider({ children }) {
  const { token } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState(null) // null = not yet loaded
  const intervalRef = useRef(null)

  const fetchCount = useCallback(async () => {
    if (!token) return
    try {
      const res = await api.get('/notifications/unread-count')
      setUnreadCount(res.data.count ?? 0)
    } catch { /* silently fail */ }
  }, [token])

  const fetchAll = useCallback(async () => {
    if (!token) return
    try {
      const res = await api.get('/notifications/my')
      setNotifications(res.data)
      setUnreadCount(res.data.filter(n => !n.isRead).length)
    } catch { /* silently fail */ }
  }, [token])

  const markRead = useCallback(async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      setNotifications(prev =>
        prev ? prev.map(n => n.id === id ? { ...n, isRead: true } : n) : prev
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch { /* silently fail */ }
  }, [])

  const markAllRead = useCallback(async () => {
    try {
      await api.patch('/notifications/read-all')
      setNotifications(prev => prev ? prev.map(n => ({ ...n, isRead: true })) : prev)
      setUnreadCount(0)
    } catch { /* silently fail */ }
  }, [])

  // Start polling when authenticated
  useEffect(() => {
    if (!token) {
      setUnreadCount(0)
      setNotifications(null)
      clearInterval(intervalRef.current)
      return
    }
    fetchCount()
    intervalRef.current = setInterval(fetchCount, POLL_INTERVAL_MS)
    return () => clearInterval(intervalRef.current)
  }, [token, fetchCount])

  return (
    <NotificationContext.Provider value={{ unreadCount, notifications, fetchAll, markRead, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider')
  return ctx
}

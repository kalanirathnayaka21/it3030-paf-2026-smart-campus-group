import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/api'
import ResourceCard from '../../components/resources/ResourceCard'
import { useAuth } from '../../context/AuthContext'

const TYPE_FILTERS = [
  { value: '', label: 'All Types' },
  { value: 'LECTURE_HALL', label: '🏛️ Lecture Halls' },
  { value: 'LAB',          label: '🔬 Labs' },
  { value: 'MEETING_ROOM', label: '🗓️ Meeting Rooms' },
  { value: 'EQUIPMENT',    label: '🔧 Equipment' },
]

export default function ResourceCataloguePage() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [resources, setResources] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [keyword,   setKeyword]   = useState('')
  const [typeFilter, setType]     = useState('')
  const [statusFilter, setStatus] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (typeFilter)   params.type   = typeFilter
      if (statusFilter) params.status = statusFilter
      if (keyword)      params.q      = keyword
      const res = await api.get('/resources', { params })
      setResources(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [typeFilter, statusFilter, keyword])

  useEffect(() => { load() }, [load])

  const handleBook = (resource) => navigate(`/resources/${resource.id}/book`)

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
            <rect width="32" height="32" rx="10" fill="url(#rcg)" />
            <path d="M8 24V14l8-5 8 5v10H20v-6h-4v6H8z" fill="white" />
            <defs><linearGradient id="rcg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" /><stop offset="1" stopColor="#8b5cf6" />
            </linearGradient></defs>
          </svg>
          <span>Smart Campus</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">🏠 Dashboard</Link>
          <Link to="/resources" className="nav-item active">🏢 Resources</Link>
          <Link to="/bookings/my" className="nav-item">📅 My Bookings</Link>
          {user?.role === 'ADMIN' && <>
            <Link to="/admin/resources" className="nav-item">⚙️ Manage Resources</Link>
            <Link to="/admin/bookings" className="nav-item">📋 All Bookings</Link>
          </>}
        </nav>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Resource Catalogue 🏢</h1>
            <p className="page-subtitle">Browse and book campus facilities</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="filter-bar">
          <input
            className="form-input search-input"
            placeholder="🔍 Search by name or location…"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <div className="filter-chips">
            {TYPE_FILTERS.map(f => (
              <button
                key={f.value}
                className={`filter-chip ${typeFilter === f.value ? 'active' : ''}`}
                onClick={() => setType(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="filter-chips">
            <button
              className={`filter-chip ${statusFilter === '' ? 'active' : ''}`}
              onClick={() => setStatus('')}
            >All Status</button>
            <button
              className={`filter-chip status-active ${statusFilter === 'ACTIVE' ? 'active' : ''}`}
              onClick={() => setStatus('ACTIVE')}
            >✅ Active</button>
            <button
              className={`filter-chip status-oos ${statusFilter === 'OUT_OF_SERVICE' ? 'active' : ''}`}
              onClick={() => setStatus('OUT_OF_SERVICE')}
            >⛔ Out of Service</button>
          </div>
        </div>

        {loading ? (
          <div className="login-loading" style={{ marginTop: '3rem' }}>
            <div className="spinner" /><span>Loading resources…</span>
          </div>
        ) : resources.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>🏢</div>
            <p>No resources found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="resource-grid">
            {resources.map(r => (
              <ResourceCard key={r.id} resource={r} onBook={handleBook} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

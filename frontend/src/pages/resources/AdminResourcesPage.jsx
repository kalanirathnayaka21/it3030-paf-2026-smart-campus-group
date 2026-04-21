import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/api'
import ResourceCard from '../../components/resources/ResourceCard'
import ResourceFormModal from '../../components/resources/ResourceFormModal'

export default function AdminResourcesPage() {
  const [resources, setResources] = useState([])
  const [loading, setLoading]     = useState(true)
  const [saving,  setSaving]      = useState(false)
  const [modal,   setModal]       = useState(null) // null | 'create' | resource object
  const [error,   setError]       = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/resources')
      setResources(res.data)
    } catch (e) { setError('Failed to load resources.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleSave = async (formData) => {
    setSaving(true)
    setError('')
    try {
      if (modal === 'create') {
        await api.post('/resources', formData)
      } else {
        await api.put(`/resources/${modal.id}`, formData)
      }
      setModal(null)
      await load()
    } catch (e) {
      setError(e.response?.data?.error || 'Save failed.')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource? This cannot be undone.')) return
    try {
      await api.delete(`/resources/${id}`)
      await load()
    } catch (e) { setError(e.response?.data?.error || 'Delete failed.') }
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
            <rect width="32" height="32" rx="10" fill="url(#arg)" />
            <path d="M8 24V14l8-5 8 5v10H20v-6h-4v6H8z" fill="white" />
            <defs><linearGradient id="arg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" /><stop offset="1" stopColor="#8b5cf6" />
            </linearGradient></defs>
          </svg>
          <span>Smart Campus</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">🏠 Dashboard</Link>
          <Link to="/resources" className="nav-item">🏢 Resources</Link>
          <Link to="/admin/resources" className="nav-item active">⚙️ Manage Resources</Link>
          <Link to="/admin/bookings" className="nav-item">📋 All Bookings</Link>
        </nav>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Manage Resources ⚙️</h1>
            <p className="page-subtitle">Add, edit, or remove campus resources</p>
          </div>
          <button className="btn btn-primary" onClick={() => setModal('create')}>
            + Add Resource
          </button>
        </div>

        {error && <div className="login-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

        {loading ? (
          <div className="login-loading" style={{ marginTop: '3rem' }}>
            <div className="spinner" /><span>Loading resources…</span>
          </div>
        ) : resources.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>📦</div>
            <p>No resources yet. Click "Add Resource" to get started.</p>
          </div>
        ) : (
          <div className="resource-grid">
            {resources.map(r => (
              <ResourceCard
                key={r.id}
                resource={r}
                onEdit={setModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {modal && (
          <ResourceFormModal
            resource={modal === 'create' ? null : modal}
            onSave={handleSave}
            onClose={() => setModal(null)}
            loading={saving}
          />
        )}
      </main>
    </div>
  )
}

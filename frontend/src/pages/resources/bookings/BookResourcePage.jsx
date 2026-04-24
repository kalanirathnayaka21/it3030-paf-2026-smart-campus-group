import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../api/api'
import { TYPE_META } from '../../components/resources/ResourceCard'

export default function BookResourcePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  //Form data
  const [form, setForm] = useState({
    startTime: '', endTime: '', purpose: '', attendees: 1,
  })
  // Fetch resource when page loads
  useEffect(() => {
    api.get(`/resources/${id}`)
      .then(res => setResource(res.data))
      .catch(() => setError('Resource not found.'))
      .finally(() => setLoading(false))
  }, [id])

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  // Validation
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.startTime || !form.endTime || !form.purpose.trim()) {
      setError('Please fill all required fields.')
      return
    }
    // Check time validity
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      setError('End time must be after start time.')
      return
    }
    setSaving(true)
    try {
      await api.post('/bookings', {
        resourceId: id,
        startTime: form.startTime,
        endTime: form.endTime,
        purpose: form.purpose,
        attendees: Number(form.attendees),
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const meta = resource ? (TYPE_META[resource.type] || { icon: '📦', label: resource.type }) : null

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
            <rect width="32" height="32" rx="10" fill="url(#brg)" />
            <path d="M8 24V14l8-5 8 5v10H20v-6h-4v6H8z" fill="white" />
            <defs><linearGradient id="brg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" /><stop offset="1" stopColor="#8b5cf6" />
            </linearGradient></defs>
          </svg>
          <span>Smart Campus</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">🏠 Dashboard</Link>
          <Link to="/resources" className="nav-item">🏢 Resources</Link>
          <Link to="/bookings/my" className="nav-item">📅 My Bookings</Link>
        </nav>
      </aside>

      <main className="main-content">
        {loading && <div className="login-loading"><div className="spinner" /></div>}

        {!loading && success && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
            <h2 className="page-title" style={{ marginBottom: '0.5rem' }}>Booking Submitted!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Your request is pending admin approval.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/bookings/my" className="btn btn-primary">View My Bookings</Link>
              <Link to="/resources" className="btn-ghost">Browse More</Link>
            </div>
          </div>
        )}

        {!loading && !success && resource && (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">Book Resource 📅</h1>
                <p className="page-subtitle">
                  {meta.icon} {resource.name} · {resource.location}
                  {resource.capacity > 0 && ` · 👥 Capacity: ${resource.capacity}`}
                </p>
              </div>
              <Link to="/resources" className="btn-ghost">← Back</Link>
            </div>

            <div className="card" style={{ maxWidth: 600 }}>
              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="form-grid-2">
                  <div className="form-row">
                    <label>Start Date & Time *</label>
                    <input className="form-input" type="datetime-local" value={form.startTime} onChange={set('startTime')} />
                  </div>
                  <div className="form-row">
                    <label>End Date & Time *</label>
                    <input className="form-input" type="datetime-local" value={form.endTime} onChange={set('endTime')} />
                  </div>
                </div>

                <div className="form-row">
                  <label>Purpose *</label>
                  <textarea className="form-input form-textarea" placeholder="e.g. Final year project group meeting…"
                    value={form.purpose} onChange={set('purpose')} />
                </div>

                <div className="form-row">
                  <label>Number of Attendees *</label>
                  <input className="form-input" type="number" min="1"
                    max={resource.capacity || 999} value={form.attendees} onChange={set('attendees')} />
                </div>

                {error && <div className="login-error">{error}</div>}

                <div className="modal-footer">
                  <Link to="/resources" className="btn-ghost">Cancel</Link>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Submitting…' : 'Submit Booking Request'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {!loading && !success && !resource && (
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>❌</div>
            <p>{error || 'Resource not found.'}</p>
            <Link to="/resources" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Catalogue</Link>
          </div>
        )}
      </main>
    </div>
  )
}

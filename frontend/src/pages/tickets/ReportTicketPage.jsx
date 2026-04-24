import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/api'

const CATEGORIES = ['MAINTENANCE','ELECTRICAL','PLUMBING','CLEANING','IT_SUPPORT','OTHER']
const PRIORITIES  = ['LOW','MEDIUM','HIGH','CRITICAL']

export default function ReportTicketPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', category: 'MAINTENANCE', priority: 'MEDIUM',
    imageUrls: ['', '', ''],   // C.2 — up to 3 optional image URLs
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))
  const setImageUrl = idx => e => setForm(f => {
    const urls = [...f.imageUrls]; urls[idx] = e.target.value; return { ...f, imageUrls: urls }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const imageUrls = form.imageUrls.filter(u => u.trim())
    setSaving(true)
    try {
      const { data } = await api.post('/tickets', {
        title: form.title, description: form.description,
        category: form.category, priority: form.priority, imageUrls,
      })
      navigate(`/tickets/${data.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit ticket.')
    } finally { setSaving(false) }
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
            <rect width="32" height="32" rx="10" fill="url(#rtg)" />
            <path d="M8 24V14l8-5 8 5v10H20v-6h-4v6H8z" fill="white" />
            <defs><linearGradient id="rtg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
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
          <Link to="/tickets/report" className="nav-item active">📝 Report Issue</Link>
          <Link to="/notifications" className="nav-item">🔔 Notifications</Link>
        </nav>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Report an Issue 📝</h1>
            <p className="page-subtitle">Submit a maintenance or support request</p>
          </div>
          <Link to="/tickets/my" className="btn-ghost">← Back</Link>
        </div>

        <div className="card" style={{ maxWidth: 680 }}>
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Title *</label>
              <input className="form-input" placeholder="Brief description of the issue" value={form.title} onChange={set('title')} />
            </div>

            <div className="form-grid-2">
              <div className="form-row">
                <label>Category *</label>
                <select className="form-input" value={form.category} onChange={set('category')}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g,' ')}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label>Priority</label>
                <select className="form-input" value={form.priority} onChange={set('priority')}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <label>Description *</label>
              <textarea className="form-input form-textarea" rows={5}
                placeholder="Describe the issue in detail — location, when it started, impact…"
                value={form.description} onChange={set('description')} />
            </div>

            {/* C.2 – up to 3 image URLs */}
            <div className="form-row">
              <label>Evidence Images (up to 3 URLs)</label>
              {form.imageUrls.map((url, idx) => (
                <input key={idx} className="form-input" style={{ marginTop: idx > 0 ? '0.5rem' : 0 }}
                  placeholder={`Image ${idx+1} URL (optional)`} value={url} onChange={setImageUrl(idx)} />
              ))}
            </div>

            {error && <div className="login-error">{error}</div>}

            <div className="modal-footer">
              <Link to="/tickets/my" className="btn-ghost">Cancel</Link>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Submitting…' : 'Submit Ticket'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

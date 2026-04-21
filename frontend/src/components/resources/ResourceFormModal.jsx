import { useState, useEffect } from 'react'

const TYPES    = ['LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT']
const STATUSES = ['ACTIVE', 'OUT_OF_SERVICE']

/**
 * Modal form for creating or editing a Resource.
 * @param {object|null} resource – existing resource when editing, null for create
 * @param {function} onSave  – called with the form data object
 * @param {function} onClose – close the modal
 * @param {boolean}  loading  – disable submit while saving
 */
export default function ResourceFormModal({ resource, onSave, onClose, loading }) {
  const [form, setForm] = useState({
    name: '', type: 'LECTURE_HALL', status: 'ACTIVE',
    capacity: 0, location: '', description: '', imageUrl: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (resource) {
      setForm({
        name: resource.name || '',
        type: resource.type || 'LECTURE_HALL',
        status: resource.status || 'ACTIVE',
        capacity: resource.capacity ?? 0,
        location: resource.location || '',
        description: resource.description || '',
        imageUrl: resource.imageUrl || '',
      })
    }
  }, [resource])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.location.trim()) {
      setError('Name and Location are required.')
      return
    }
    onSave({ ...form, capacity: Number(form.capacity) })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{resource ? 'Edit Resource' : 'Add Resource'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Name *</label>
            <input className="form-input" value={form.name} onChange={set('name')} placeholder="e.g. Lab A-201" />
          </div>

          <div className="form-grid-2">
            <div className="form-row">
              <label>Type *</label>
              <select className="form-input" value={form.type} onChange={set('type')}>
                {TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Status *</label>
              <select className="form-input" value={form.status} onChange={set('status')}>
                {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-row">
              <label>Capacity</label>
              <input className="form-input" type="number" min="0" value={form.capacity} onChange={set('capacity')} />
            </div>
            <div className="form-row">
              <label>Location *</label>
              <input className="form-input" value={form.location} onChange={set('location')} placeholder="e.g. Block A, Floor 2" />
            </div>
          </div>

          <div className="form-row">
            <label>Description</label>
            <textarea className="form-input form-textarea" value={form.description} onChange={set('description')} placeholder="Optional details…" />
          </div>

          <div className="form-row">
            <label>Image URL</label>
            <input className="form-input" value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://..." />
          </div>

          {error && <div className="login-error">{error}</div>}

          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : resource ? 'Save Changes' : 'Create Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

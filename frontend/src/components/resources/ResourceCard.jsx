const TYPE_META = {
  LECTURE_HALL:  { icon: '🏛️', label: 'Lecture Hall', color: '#6366f1' },
  LAB:           { icon: '🔬', label: 'Lab',          color: '#8b5cf6' },
  MEETING_ROOM:  { icon: '🗓️', label: 'Meeting Room', color: '#06b6d4' },
  EQUIPMENT:     { icon: '🔧', label: 'Equipment',    color: '#f59e0b' },
}

const STATUS_STYLE = {
  ACTIVE:          { bg: 'rgba(16,185,129,0.15)', text: '#34d399', border: 'rgba(16,185,129,0.3)' },
  OUT_OF_SERVICE:  { bg: 'rgba(244,63,94,0.12)',  text: '#f87171', border: 'rgba(244,63,94,0.3)'  },
}

/**
 * Reusable resource card used in the catalogue and admin pages.
 * @param {object} resource – ResourceResponse from backend
 * @param {function} onBook  – called when "Book" button clicked
 * @param {function} onEdit  – admin only; called with resource
 * @param {function} onDelete – admin only; called with resource id
 */
export default function ResourceCard({ resource, onBook, onEdit, onDelete }) {
  const meta   = TYPE_META[resource.type]  || { icon: '📦', label: resource.type, color: '#94a3b8' }
  const status = STATUS_STYLE[resource.status] || STATUS_STYLE.ACTIVE
  const isAdmin = !!(onEdit || onDelete)

  return (
    <div className="resource-card">
      <div className="resource-card-header" style={{ '--accent': meta.color }}>
        <span className="resource-type-icon">{meta.icon}</span>
        <span
          className="role-badge"
          style={{ background: status.bg, color: status.text, border: `1px solid ${status.border}` }}
        >
          {resource.status === 'ACTIVE' ? 'Active' : 'Out of Service'}
        </span>
      </div>

      <div className="resource-card-body">
        <h3 className="resource-name">{resource.name}</h3>
        <p className="resource-type-label" style={{ color: meta.color }}>{meta.label}</p>

        <div className="resource-meta-row">
          <span>📍 {resource.location}</span>
          {resource.capacity > 0 && <span>👥 {resource.capacity}</span>}
        </div>

        {resource.description && (
          <p className="resource-desc">{resource.description}</p>
        )}
      </div>

      <div className="resource-card-footer">
        {onBook && resource.status === 'ACTIVE' && (
          <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
                  onClick={() => onBook(resource)}>
            Book
          </button>
        )}
        {isAdmin && (
          <>
            <button className="btn-ghost" onClick={() => onEdit(resource)}>Edit</button>
            <button className="btn-danger" onClick={() => onDelete(resource.id)}>Delete</button>
          </>
        )}
      </div>
    </div>
  )
}

export { TYPE_META }

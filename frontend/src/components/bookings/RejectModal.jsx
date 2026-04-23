/**
 * RejectModal – prompts admin to enter a rejection reason before rejecting a booking.
 * @param {function} onConfirm – called with reason string
 * @param {function} onClose   – closes the modal
 * @param {boolean}  loading
 */
import { useState } from 'react'

export default function RejectModal({ onConfirm, onClose, loading }) {
  const [reason, setReason] = useState('')

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Reject Booking</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-form">
          <div className="form-row">
            <label>Reason (optional)</label>
            <textarea
              className="form-input form-textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Resource already reserved for maintenance…"
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button
              className="btn-danger-solid"
              disabled={loading}
              onClick={() => onConfirm(reason)}
            >
              {loading ? 'Rejecting…' : 'Confirm Reject'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

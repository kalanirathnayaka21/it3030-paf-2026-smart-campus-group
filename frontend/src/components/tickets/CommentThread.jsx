import { useState } from 'react'
import api from '../../api/api'

/**
 * Renders the comment thread for a ticket and an add-comment form.
 * @param {string} ticketId
 * @param {array}  comments – TicketCommentResponse[]
 * @param {function} onCommentAdded – called after a new comment is posted
 */
export default function CommentThread({ ticketId, comments, onCommentAdded }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    setError('')
    try {
      await api.post(`/tickets/${ticketId}/comments`, { content })
      setContent('')
      onCommentAdded && onCommentAdded()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post comment.')
    } finally { setLoading(false) }
  }

  return (
    <div className="comment-thread">
      <h3 className="comment-thread-title">💬 Comments ({comments.length})</h3>

      {comments.length === 0 && (
        <p style={{ color:'var(--text-muted)', fontSize:'0.875rem', marginBottom:'1rem' }}>
          No comments yet. Be the first to add one.
        </p>
      )}

      <div className="comment-list">
        {comments.map(c => (
          <div key={c.id} className="comment-item">
            <div className="comment-author-row">
              {c.authorPicture
                ? <img src={c.authorPicture} alt={c.authorName} className="user-avatar-lg" />
                : <div className="comment-avatar-placeholder">{c.authorName?.[0] ?? '?'}</div>
              }
              <div>
                <span className="comment-author-name">{c.authorName}</span>
                <span className="comment-date">{new Date(c.createdAt).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'})}</span>
              </div>
            </div>
            <p className="comment-content">{c.content}</p>
          </div>
        ))}
      </div>

      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          className="form-input form-textarea"
          placeholder="Add a comment…"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={3}
        />
        {error && <div className="login-error">{error}</div>}
        <div style={{ display:'flex', justifyContent:'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={loading || !content.trim()}
                  style={{ fontSize:'0.85rem', padding:'0.45rem 1.1rem' }}>
            {loading ? 'Posting…' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  )
}

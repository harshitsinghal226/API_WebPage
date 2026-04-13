/**
 * ConfirmModal — custom styled confirm dialog (replaces window.confirm)
 * Props: { isOpen, title, message, onConfirm, onCancel }
 */
export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">🗑️</div>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button id="modal-cancel-btn"  className="btn btn-outline"  onClick={onCancel}>Cancel</button>
          <button id="modal-confirm-btn" className="btn btn-danger"   onClick={onConfirm}
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            🗑 Delete Job
          </button>
        </div>
      </div>
    </div>
  )
}

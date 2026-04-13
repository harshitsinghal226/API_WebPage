/**
 * Toast notification component
 */
export default function Toast({ toast }) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' }
  return (
    <div className={`toast ${toast.type} ${toast.visible ? 'show' : ''}`}>
      <span>{icons[toast.type]}</span>
      <span>{toast.msg}</span>
    </div>
  )
}

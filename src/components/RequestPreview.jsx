/**
 * RequestPreview — shows the last HTTP request sent
 */
export default function RequestPreview({ request }) {
  return (
    <div className="card code-card">
      <div className="card-header">
        <span className="card-icon">📡</span>
        <div>
          <h2 className="card-title">Last API Request</h2>
          <p className="card-desc">The actual HTTP request sent to the API</p>
        </div>
      </div>
      <pre className="code-block">{request}</pre>
    </div>
  )
}

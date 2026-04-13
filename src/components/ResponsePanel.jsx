/**
 * ResponsePanel — shows live JSON response + status badge + response time
 */
export default function ResponsePanel({ response }) {
  const { text, status, ms } = response

  const badgeClass = !status ? '' : status >= 200 && status < 300 ? 'ok' : status >= 400 && status < 500 ? 'warn' : 'err'
  const badgeLabel = !status ? '' : status >= 200 && status < 300 ? `${status} OK` : `${status} Error`

  return (
    <div className="card response-card">
      <div className="card-header">
        <span className="card-icon">📨</span>
        <div>
          <h2 className="card-title">API Response</h2>
          <p className="card-desc">Live JSON response from the server</p>
        </div>
        {status && (
          <div className="response-header">
            <span className={`http-badge ${badgeClass}`}>{badgeLabel}</span>
            {ms !== null && <span className="response-time">{ms}ms</span>}
          </div>
        )}
      </div>
      <pre className="code-block response-block">{text}</pre>
    </div>
  )
}

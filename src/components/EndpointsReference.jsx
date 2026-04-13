/**
 * EndpointsReference — shows all API routes
 */
const ENDPOINTS = [
  { method: 'GET',    path: '/api/integration/health',       desc: 'Check if API is running' },
  { method: 'GET',    path: '/api/integration/jobs',         desc: 'Fetch all job listings (public)' },
  { method: 'GET',    path: '/api/integration/jobs/:id',     desc: 'Get a specific job by external ID' },
  { method: 'POST',   path: '/api/integration/jobs',         desc: 'Create a new job (auth required)' },
  { method: 'PATCH',  path: '/api/integration/jobs/:id',     desc: 'Update a job (auth required)' },
  { method: 'DELETE', path: '/api/integration/jobs/:id',     desc: 'Delete a job (auth required)' },
]

export default function EndpointsReference() {
  return (
    <div className="card howto-card">
      <div className="card-header">
        <span className="card-icon">🗺️</span>
        <div>
          <h2 className="card-title">API Endpoints</h2>
          <p className="card-desc">Available REST endpoints · Backend runs on <code style={{ color: '#a5b4fc', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem' }}>http://localhost:5000</code></p>
        </div>
      </div>
      <div className="endpoints-list">
        {ENDPOINTS.map(ep => (
          <div className="endpoint-item" key={ep.path + ep.method}>
            <span className={`method ${ep.method.toLowerCase()}`}>{ep.method}</span>
            <code className="endpoint-path">{ep.path}</code>
            <span className="endpoint-desc">{ep.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

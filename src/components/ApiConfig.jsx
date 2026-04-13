import { useState } from 'react'

/**
 * ApiConfig card — API key + base URL entry + connect button
 */
export default function ApiConfig({ onConnect, loading, connStatus, defaultKey }) {
  const [key,  setKey]  = useState(defaultKey || '')
  const [show, setShow] = useState(false)

  // Locally: use Vite proxy (/api/integration → localhost:5000)
  // On Vercel: use the full deployed Render URL directly
  const REQUEST_URL = import.meta.env.VITE_API_BASE_URL || '/api/integration'
  const DISPLAY_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/integration'

  const handleConnect = () => onConnect(key, REQUEST_URL)
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleConnect() }

  return (
    <div className="card config-card">
      <div className="card-header">
        <span className="card-icon">🔑</span>
        <div>
          <h2 className="card-title">API Configuration</h2>
          <p className="card-desc">Enter your company's API key to authenticate requests</p>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">API Key</label>
        <div className="input-row">
          <input
            id="api-key-input"
            type={show ? 'text' : 'password'}
            className="form-input mono"
            placeholder="jp-integration-key-2026-secure"
            value={key}
            onChange={e => setKey(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <button
            className="icon-btn"
            onClick={() => setShow(s => !s)}
            title={show ? 'Hide key' : 'Show key'}
          >
            {show ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">API Base URL</label>
        <div style={{ position: 'relative' }}>
          <input
            id="base-url-display"
            type="text"
            className="form-input mono"
            value={DISPLAY_URL}
            readOnly
            style={{ paddingRight: '90px', color: '#a5b4fc', cursor: 'default' }}
          />
          <span style={{
            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
            fontSize: '0.68rem', background: 'rgba(99,102,241,0.15)', color: '#818cf8',
            border: '1px solid rgba(99,102,241,0.3)', borderRadius: '4px', padding: '2px 7px',
            fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap'
          }}>via proxy</span>
        </div>
      </div>

      <button
        id="connect-btn"
        className="btn btn-primary btn-full"
        onClick={handleConnect}
        disabled={loading}
      >
        {loading
          ? <><span className="spinner" /> Validating…</>
          : <><span>🔗</span> Connect to API</>
        }
      </button>

      <div className={`status-bar status-${connStatus.type}`}>
        <span className="status-dot" />
        <span className="status-text">{connStatus.text}</span>
      </div>
    </div>
  )
}

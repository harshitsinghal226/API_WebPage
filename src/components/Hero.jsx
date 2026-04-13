// Hero section with animated stats
export default function Hero({ jobCount }) {
  return (
    <section className="hero">
      <div className="container">
        <span className="hero-eyebrow">🎓 Professor Demo · B.Tech Project</span>
        <h1 className="hero-title">
          CareerConnect <span className="gradient-text">Integration API</span>
        </h1>
        <p className="hero-subtitle">
          A secure RESTful API that lets any company integrate with CareerConnect —
          post new jobs or remove them in real time using a unique API key.
        </p>
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-number">{jobCount > 0 ? jobCount : '—'}</span>
            <span className="stat-label">Jobs Listed</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">REST</span>
            <span className="stat-label">Architecture</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">API Key</span>
            <span className="stat-label">Auth (x-api-key)</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">MongoDB</span>
            <span className="stat-label">Database</span>
          </div>
        </div>
      </div>
    </section>
  )
}

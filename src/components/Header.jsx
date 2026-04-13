// Header component
export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <a className="logo" href="/">
          <span className="logo-icon">⚡</span>
          <span>CareerConnect <span className="logo-api">API</span></span>
        </a>
        <div className="header-badges">
          <span className="badge badge-live">
            <span className="pulse-dot" />
            Live Demo
          </span>
          <span className="badge badge-version">v1.0</span>
        </div>
      </div>
    </header>
  )
}

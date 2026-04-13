/**
 * JobCard — single job row with delete button
 */
const EMOJIS = ['💼','🚀','🌟','🔧','💡','🎯','⚙️','🛠️','📊','🎨','🖥️','🌐']

function formatINR(n) {
  const num = Number(n)
  if (!num) return null
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} LPA`
  return `₹${num.toLocaleString('en-IN')}`
}

export default function JobCard({ job, index, onDelete, loading }) {
  const id     = job.externalJobId || job._id || `job-${index}`
  const source = job.source || ''
  const title  = job.title  || 'Untitled'
  const co     = job.company?.name || job.companyId?.name || 'Unknown Company'
  const loc    = job.location  || ''
  const level  = job.level     || ''
  const sal    = formatINR(job.salary)
  const cat    = job.category  || ''
  const icon   = EMOJIS[index % EMOJIS.length]
  const shortId = String(id).slice(0, 22)

  return (
    <div className="job-item">
      <div className="job-logo">{icon}</div>
      <div className="job-info">
        <div className="job-title-text">{title}</div>
        <div className="job-company-text">{co}</div>
        <div className="job-tags">
          {loc   && <span className="job-tag tag-location">📍 {loc}</span>}
          {level && <span className="job-tag tag-exp">🎓 {level}</span>}
          {sal   && <span className="job-tag tag-salary">💰 {sal}</span>}
          {cat   && <span className="job-tag tag-cat">🏷 {cat}</span>}
        </div>
        <div className="job-id-text">ID: {shortId}{id.length > 22 ? '…' : ''}</div>
      </div>
      <button
        className="btn btn-danger"
        onClick={() => onDelete(id, source, title)}
        disabled={loading}
        title="Delete via API"
      >
        🗑 Delete
      </button>
    </div>
  )
}

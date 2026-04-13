import { useState } from 'react'

const LEVELS      = ['Entry', 'Mid', 'Senior', 'Lead', 'Manager']
const CATEGORIES  = ['Programming', 'Data Science', 'Designing', 'Networking', 'Management', 'Marketing', 'Cybersecurity']

const empty = {
  title: '', description: '', location: '',
  salary: '', level: 'Entry', category: 'Programming',
  source: 'demo-company', externalJobId: '',
  companyName: '', companyEmail: '',
}

/**
 * PostJobForm — collects data and calls onPost(payload)
 */
export default function PostJobForm({ onPost, loading, connected }) {
  const [form, setForm]   = useState({ ...empty })
  const [errors, setErrors] = useState({})

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim())                               e.title       = 'Required'
    if (!form.description.trim())                         e.description = 'Required'
    if (!form.location.trim())                            e.location    = 'Required'
    if (!form.companyName.trim())                         e.companyName = 'Required'
    if (!form.companyEmail.trim())                        e.companyEmail = 'Required'
    if (!form.salary.toString().trim())                   e.salary      = 'Required'
    else if (isNaN(Number(form.salary)) || Number(form.salary) <= 0)
                                                          e.salary      = 'Must be a positive number (e.g. 1200000)'
    return e
  }

  const handleSubmit = async () => {
    if (!connected) return
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    // Auto-generate a unique externalJobId if blank (timestamp + random to avoid 409 conflicts)
    const extId = form.externalJobId.trim() || `JOB-${Date.now()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`

    const payload = {
      title:         form.title.trim(),
      description:   form.description.trim(),
      location:      form.location.trim(),
      salary:        Number(form.salary),          // server requires > 0
      level:         form.level,
      category:      form.category,
      source:        form.source.trim() || 'demo-company',
      externalJobId: extId,
      company: {
        name:  form.companyName.trim(),
        email: form.companyEmail.trim(),
      },
    }

    const ok = await onPost(payload)
    if (ok) setForm({ ...empty })
  }

  const field = (key, label, placeholder, type = 'text', required = true) => (
    <div className="form-group">
      <label className="form-label">
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <input
        id={`field-${key}`}
        type={type}
        className={`form-input${errors[key] ? ' error-border' : ''}`}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => set(key, e.target.value)}
        style={errors[key] ? { borderColor: '#ef4444' } : {}}
      />
      {errors[key] && <span style={{ color: '#fca5a5', fontSize: '0.75rem' }}>{errors[key]}</span>}
    </div>
  )

  return (
    <div className="card form-card">
      <div className="card-header">
        <span className="card-icon">➕</span>
        <div>
          <h2 className="card-title">Post a New Job</h2>
          <p className="card-desc">Fill in the details to publish a job via API</p>
        </div>
      </div>

      <div className="form-row">
        {field('title', 'Job Title', 'e.g. Senior React Developer')}
        {field('location', 'Location', 'e.g. Bangalore, India')}
      </div>

      <div className="form-row">
        {field('companyName', 'Company Name', 'e.g. TechCorp Pvt. Ltd.')}
        {field('companyEmail', 'Company Email', 'hr@company.com', 'email')}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Experience Level <span style={{ color: '#ef4444' }}>*</span></label>
          <select className="form-input" value={form.level} onChange={e => set('level', e.target.value)}>
            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Category <span style={{ color: '#ef4444' }}>*</span></label>
          <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="form-row">
        {field('salary', 'Salary (Annual, INR)', 'e.g. 1200000', 'number', true)}
        {field('externalJobId', 'External Job ID', 'e.g. JOB-001 (auto if blank)', 'text', false)}
      </div>

      {field('source', 'Source Identifier', 'e.g. my-company', 'text', false)}

      <div className="form-group">
        <label className="form-label">Job Description <span style={{ color: '#ef4444' }}>*</span></label>
        <textarea
          id="field-description"
          className="form-input form-textarea"
          placeholder="Describe the role, responsibilities, and qualifications…"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          style={errors.description ? { borderColor: '#ef4444' } : {}}
        />
        {errors.description && <span style={{ color: '#fca5a5', fontSize: '0.75rem' }}>{errors.description}</span>}
      </div>

      <button
        id="post-job-btn"
        className="btn btn-success btn-full"
        onClick={handleSubmit}
        disabled={loading || !connected}
      >
        {loading
          ? <><span className="spinner" /> Posting…</>
          : <><span>🚀</span> Post Job via API</>
        }
      </button>

      {!connected && (
        <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '10px' }}>
          Connect to the API above first
        </p>
      )}
    </div>
  )
}

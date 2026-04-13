import './App.css'

import { useState } from 'react'
import Header             from './components/Header'
import Hero               from './components/Hero'
import ApiConfig          from './components/ApiConfig'
import PostJobForm        from './components/PostJobForm'
import RequestPreview     from './components/RequestPreview'
import ResponsePanel      from './components/ResponsePanel'
import JobsList           from './components/JobsList'
import EndpointsReference from './components/EndpointsReference'
import ConfirmModal       from './components/ConfirmModal'
import Toast              from './components/Toast'

import { useApi }   from './useApi'
import { useToast } from './useToast'

export default function App() {
  const api   = useApi()
  const { toast, showToast } = useToast()

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState({ open: false, id: '', source: '', title: '' })

  const handleConnect = async (key, url) => {
    await api.connect(key, url)
    if (key.length >= 8) showToast('API key validated! Ready to post jobs.', 'success')
    else                 showToast('Invalid API key — must be ≥ 8 characters.', 'error')
  }

  const handlePost = async (payload) => {
    const ok = await api.postJob(payload)
    if (ok) showToast(`Job "${payload.title}" posted successfully!`, 'success')
    else    showToast('Failed to post job. Check the response panel.', 'error')
    return ok
  }

  // Show confirm modal instead of window.confirm
  const handleDelete = (id, source, title) => {
    setConfirmModal({ open: true, id, source, title })
  }

  const confirmDelete = async () => {
    const { id, source, title } = confirmModal
    setConfirmModal({ open: false, id: '', source: '', title: '' })
    const ok = await api.deleteJob(id, source)
    if (ok) showToast(`Job "${title}" removed via API.`, 'success')
    else    showToast('Failed to delete job.', 'error')
  }

  const cancelDelete = () => setConfirmModal({ open: false, id: '', source: '', title: '' })

  const handleRefresh = async () => {
    await api.refresh()
    showToast('Jobs refreshed!', 'info')
  }

  // ─── Render ─────────────────────────────────────────────────────────
  return (
    <>
      {/* Animated background */}
      <div className="bg-grid" />
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      <Header />

      <Hero jobCount={api.jobs.length} />

      <main className="container main-grid">
        {/* ── LEFT PANEL ── */}
        <div className="left-panel">
          <ApiConfig
            onConnect={handleConnect}
            loading={api.loading}
            connStatus={api.connStatus}
            defaultKey={api.REAL_API_KEY}
          />

          <PostJobForm
            onPost={handlePost}
            loading={api.loading}
            connected={api.connected}
          />

          <RequestPreview request={api.lastRequest} />
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel">
          <ResponsePanel response={api.response} />

          <JobsList
            jobs={api.jobs}
            loading={api.loading}
            connected={api.connected}
            onDelete={handleDelete}
            onRefresh={handleRefresh}
          />

          <EndpointsReference />
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <p>🎓 B.Tech Project — CareerConnect Integration API &nbsp;|&nbsp; Built with ❤️ by <strong>Harshit Singhal</strong></p>
          <p className="footer-note">
            This demo page showcases API-based job management using HTTP requests with <code style={{ color: '#a5b4fc', fontFamily: 'JetBrains Mono, monospace' }}>x-api-key</code> authentication.
          </p>
        </div>
      </footer>

      <Toast toast={toast} />

      <ConfirmModal
        isOpen={confirmModal.open}
        title="Delete Job"
        message={`Are you sure you want to delete "${confirmModal.title}"? This will send a DELETE request to the API and cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  )
}

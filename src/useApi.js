import { useState, useCallback, useRef } from 'react'

// ─── Config ────────────────────────────────────────────────────────────────
// Set DEMO_MODE = true  → fake in-memory data (no backend needed for presentation)
// Set DEMO_MODE = false → real HTTP requests to your Express + MongoDB backend
const DEMO_MODE        = false

// Use a relative URL so Vite proxies it to http://localhost:5000 — no CORS issues!
const BASE_INTEGRATION = '/api/integration'
const REAL_API_KEY     = 'jp-integration-key-2026-secure'

// ─── Demo seed data ────────────────────────────────────────────────────────
let _counter = 1
const genId  = () => `DEMO-${String(_counter++).padStart(3, '0')}`

const SEED_JOBS = [
  {
    externalJobId: genId(),
    title:       'Full Stack Developer',
    description: 'Build scalable web applications with React & Node.js. Work in an agile team.',
    location:    'Bangalore, India',
    salary:      1500000,
    level:       'Mid',
    category:    'Programming',
    source:      'demo-company',
    company:     { name: 'InnoTech Solutions', email: 'hr@innotech.com' },
  },
  {
    externalJobId: genId(),
    title:       'UI/UX Designer',
    description: 'Design stunning user interfaces for our client apps using Figma & Adobe XD.',
    location:    'Remote',
    salary:      900000,
    level:       'Entry',
    category:    'Designing',
    source:      'demo-company',
    company:     { name: 'PixelCraft Studios', email: 'hr@pixelcraft.io' },
  },
  {
    externalJobId: genId(),
    title:       'Data Scientist',
    description: 'Analyze large datasets, build ML models, and derive actionable insights.',
    location:    'Hyderabad, India',
    salary:      2000000,
    level:       'Senior',
    category:    'Data Science',
    source:      'demo-company',
    company:     { name: 'DataViz Corp.', email: 'hiring@dataviz.in' },
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

const formatINR = (n) => {
  const num = Number(n)
  if (!num) return 'Not disclosed'
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} LPA`
  return `₹${num.toLocaleString('en-IN')}`
}

// ─── Main hook ────────────────────────────────────────────────────────────
export function useApi() {
  const [apiKey,      setApiKey]      = useState('')
  const [baseUrl,     setBaseUrl]     = useState(BASE_INTEGRATION)
  const [connected,   setConnected]   = useState(false)
  const [demoMode,    setDemoMode]    = useState(true)
  const [jobs,        setJobs]        = useState([])
  const [loading,     setLoading]     = useState(false)
  const [connStatus,  setConnStatus]  = useState({ type: 'idle', text: 'Not connected — enter your API key to begin' })
  const [lastRequest, setLastRequest] = useState('// Your next API request will appear here\n// Click "Connect" or "Post Job" to see the request')
  const [response,    setResponse]    = useState({ text: '// Waiting for a request...\n// Connect your API key and try posting a job!', status: null, ms: null })

  // demo jobs stored in a ref so mutations work without re-render loops
  const demoJobsRef = useRef([...SEED_JOBS])

  // ─── Utilities ────────────────────────────────────────────────────────
  const setReq = useCallback((method, endpoint, body = null) => {
    const bodyStr = body ? `\nContent-Type: application/json\n\n${JSON.stringify(body, null, 2)}` : ''
    setLastRequest(`${method} ${endpoint}\nx-api-key: ${apiKey || '<your-api-key>'}\nAccept: application/json${bodyStr}`)
  }, [apiKey])

  const setRes = useCallback((data, status, ms) => {
    setResponse({ text: JSON.stringify(data, null, 2), status, ms })
  }, [])

  // ─── Connect ──────────────────────────────────────────────────────────
  // ─── Fetch jobs (real) ────────────────────────────────────────────────
  const fetchJobsReal = useCallback(async (key, url) => {
    const endpoint = `${url}/jobs`
    setReq('GET', endpoint)
    const start = Date.now()
    try {
      const res  = await fetch(endpoint, { headers: { 'x-api-key': key } })
      const ms   = Date.now() - start
      const data = await res.json()
      setRes(data, res.status, ms)
      if (res.ok) setJobs(data.jobs || [])
    } catch (err) {
      setRes({ error: err.message }, 0, Date.now() - start)
    }
  }, [setReq, setRes])

  // ─── Connect ──────────────────────────────────────────────────────────
  const connect = useCallback(async (key, url) => {
    const trimKey = key.trim()
    const trimUrl = url.trim() || BASE_INTEGRATION
    setApiKey(trimKey)
    setBaseUrl(trimUrl)

    // Use the top-level DEMO_MODE constant — flip it manually if needed
    const isDemo = DEMO_MODE
    setDemoMode(isDemo)

    setLoading(true)
    setReq('GET', `${trimUrl}/health`)
    const start = Date.now()

    if (isDemo) {
      await sleep(700)
      const ms = Date.now() - start
      if (trimKey.length >= 8) {
        setConnected(true)
        setConnStatus({ type: 'success', text: '✓ Connected — API key accepted. Ready to make requests.' })
        setRes({
          success: true,
          message: 'Integration API is up',
          timestamp: new Date().toISOString(),
          keyValidated: true,
          permissions: ['jobs:read', 'jobs:write', 'jobs:delete'],
          rateLimit: '60 write / 300 read per 15 min',
        }, 200, ms)
        demoJobsRef.current = [...SEED_JOBS]
        setJobs([...demoJobsRef.current])
      } else {
        setConnected(false)
        setConnStatus({ type: 'error', text: '✗ Invalid or rejected API key.' })
        setRes({ success: false, message: 'Invalid API key', error: 'Unauthorized' }, 401, ms)
      }
    } else {
      try {
        const res  = await fetch(`${trimUrl}/health`, { headers: { 'x-api-key': trimKey } })
        const ms   = Date.now() - start
        const data = await res.json()
        setRes(data, res.status, ms)
        if (res.ok) {
          setConnected(true)
          setConnStatus({ type: 'success', text: `✓ Connected — ${data.message || 'API key accepted.'}` })
          fetchJobsReal(trimKey, trimUrl)   // ← now uses the correct reference
        } else {
          setConnected(false)
          setConnStatus({ type: 'error', text: `✗ ${data.message || 'Invalid API key.'}` })
        }
      } catch (err) {
        const ms = Date.now() - start
        setRes({ error: err.message, hint: 'Is your server running?' }, 0, ms)
        setConnected(false)
        setConnStatus({ type: 'error', text: '✗ Cannot reach server. Check the Base URL.' })
      }
    }
    setLoading(false)
  }, [setReq, setRes, fetchJobsReal])   // ← fetchJobsReal now in deps



  // ─── Refresh ──────────────────────────────────────────────────────────
  const refresh = useCallback(async () => {
    if (!connected) return
    setLoading(true)
    if (demoMode) {
      setReq('GET', `${baseUrl}/jobs`)
      await sleep(400)
      setRes({ success: true, count: demoJobsRef.current.length, jobs: demoJobsRef.current }, 200, 400)
      setJobs([...demoJobsRef.current])
    } else {
      await fetchJobsReal(apiKey, baseUrl)
    }
    setLoading(false)
  }, [connected, demoMode, apiKey, baseUrl, setReq, setRes, fetchJobsReal])

  // ─── Post Job ─────────────────────────────────────────────────────────
  const postJob = useCallback(async (payload) => {
    if (!connected) return false
    const endpoint = `${baseUrl}/jobs`
    setReq('POST', endpoint, payload)
    setLoading(true)
    const start = Date.now()

    if (demoMode) {
      await sleep(900)
      const ms = Date.now() - start
      const newJob = { ...payload, _id: `mongo_${Math.random().toString(16).slice(2,14)}`, createdAt: new Date().toISOString() }
      demoJobsRef.current = [newJob, ...demoJobsRef.current]
      setJobs([...demoJobsRef.current])
      setRes({ success: true, message: 'Job created successfully', job: newJob }, 201, ms)
      setLoading(false)
      return true
    } else {
      try {
        const res  = await fetch(endpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
          body: JSON.stringify(payload),
        })
        const ms   = Date.now() - start
        const data = await res.json()
        setRes(data, res.status, ms)
        if (res.ok) await fetchJobsReal(apiKey, baseUrl)
        setLoading(false)
        return res.ok
      } catch (err) {
        setRes({ error: err.message }, 0, Date.now() - start)
        setLoading(false)
        return false
      }
    }
  }, [connected, demoMode, baseUrl, apiKey, setReq, setRes, fetchJobsReal])

  // ─── Delete Job ───────────────────────────────────────────────────────
  const deleteJob = useCallback(async (externalJobId, source) => {
    if (!connected) return false
    const endpoint = `${baseUrl}/jobs/${externalJobId}${source ? `?source=${source}` : ''}`
    setReq('DELETE', endpoint)
    setLoading(true)
    const start = Date.now()

    if (demoMode) {
      await sleep(700)
      const ms = Date.now() - start
      demoJobsRef.current = demoJobsRef.current.filter(j => j.externalJobId !== externalJobId)
      setJobs([...demoJobsRef.current])
      setRes({ success: true, message: 'Job deleted successfully', deletedJobId: externalJobId }, 200, ms)
      setLoading(false)
      return true
    } else {
      try {
        const res  = await fetch(endpoint, { method: 'DELETE', headers: { 'x-api-key': apiKey } })
        const ms   = Date.now() - start
        const data = await res.json()
        setRes(data, res.status, ms)
        if (res.ok) await fetchJobsReal(apiKey, baseUrl)
        setLoading(false)
        return res.ok
      } catch (err) {
        setRes({ error: err.message }, 0, Date.now() - start)
        setLoading(false)
        return false
      }
    }
  }, [connected, demoMode, baseUrl, apiKey, setReq, setRes, fetchJobsReal])

  return {
    apiKey, setApiKey,
    baseUrl, setBaseUrl,
    connected, demoMode,
    jobs, loading,
    connStatus, lastRequest, response,
    connect, refresh, postJob, deleteJob,
    REAL_API_KEY,
    formatINR,
  }
}

export { formatINR }

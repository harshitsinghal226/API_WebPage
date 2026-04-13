import JobCard from './JobCard'

/**
 * JobsList — full jobs panel with refresh button
 */
export default function JobsList({ jobs, loading, connected, onDelete, onRefresh }) {
  return (
    <div className="card jobs-card">
      <div className="card-header">
        <span className="card-icon">📋</span>
        <div>
          <h2 className="card-title">Jobs Published via API</h2>
          <p className="card-desc">All jobs posted through this demo session</p>
        </div>
        <div className="card-header-actions">
          <button
            id="refresh-btn"
            className="btn btn-outline btn-sm"
            onClick={onRefresh}
            disabled={loading || !connected}
          >
            {loading ? <span className="spinner" /> : '🔄'} Refresh
          </button>
        </div>
      </div>

      <div className="jobs-list">
        {jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-text">
              {connected
                ? 'No jobs yet. Post your first job using the form!'
                : 'Connect to the API to see jobs.'}
            </p>
          </div>
        ) : (
          jobs.map((j, i) => (
            <JobCard
              key={j.externalJobId || j._id || i}
              job={j}
              index={i}
              onDelete={onDelete}
              loading={loading}
            />
          ))
        )}
      </div>
    </div>
  )
}

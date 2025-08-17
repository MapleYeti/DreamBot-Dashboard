import React from 'react'
import './LiveLogsCard.css'

const LiveLogsCard: React.FC = () => {
  return (
    <section className="dashboard-section">
      <div className="section-header">
        <div className="section-title">
          <span className="section-icon">📄</span>
          <h2>Live Logs</h2>
        </div>
        <div className="section-actions">
          <a href="#" className="log-link">
            Recent Activity
          </a>
          <a href="#" className="log-link">
            Clear
          </a>
        </div>
      </div>

      <div className="log-console">
        <div className="log-placeholder">
          Program output will appear here when monitoring is active.
        </div>
        <div className="log-entries">
          <div className="log-entry config">
            <div className="log-icon config">■</div>
            <span className="log-label">CONFIG</span>
            <span className="log-message">Loading configuration...</span>
            <span className="log-time">11:53:40 PM</span>
          </div>
          <div className="log-entry config success">
            <div className="log-icon success">✓</div>
            <span className="log-label">CONFIG</span>
            <span className="log-message">Configuration loaded successfully.</span>
            <span className="log-time">11:53:40 PM</span>
          </div>
          <div className="log-entry system success">
            <div className="log-icon success">✓</div>
            <span className="log-label">SYSTEM</span>
            <span className="log-message">RuneScape Bot Monitor initialized successfully.</span>
            <span className="log-time">11:53:40 PM</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LiveLogsCard

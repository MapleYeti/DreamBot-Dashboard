import React from 'react'
import './ConfigurationCard.css'

const ConfigurationCard: React.FC = () => {
  return (
    <section className="dashboard-section">
      <div className="section-header">
        <div className="section-title">
          <span className="section-icon">⚙️</span>
          <h2>Configuration</h2>
        </div>
        <div className="section-actions">
          <button className="saved-button">
            <span className="button-icon">✓</span>
            Saved
          </button>
          <button className="dropdown-button">▼</button>
        </div>
      </div>
    </section>
  )
}

export default ConfigurationCard

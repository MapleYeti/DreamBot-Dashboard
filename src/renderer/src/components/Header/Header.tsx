import React from 'react'
import './Header.css'

const Header: React.FC = () => {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <div className="bot-icon">🤖</div>
        <h1>DreamBot Dashboard</h1>
      </div>
      <div className="header-right">
        <div className="status-indicator stopped">
          <div className="status-dot"></div>
          <span>Stopped</span>
        </div>
      </div>
    </header>
  )
}

export default Header

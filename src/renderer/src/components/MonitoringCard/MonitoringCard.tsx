import React from 'react'
import './MonitoringCard.css'

interface Bot {
  id: string
  name: string
  status: 'Unknown' | 'Running' | 'Stopped'
}

interface MonitoringControlProps {
  isMonitoring: boolean
  bots: Bot[]
  onStartMonitoring: () => void
  onLaunchBot: (botId: string) => void
}

const MonitoringControl: React.FC<MonitoringControlProps> = ({
  isMonitoring,
  bots,
  onStartMonitoring,
  onLaunchBot
}) => {
  return (
    <section className="dashboard-section">
      <div className="section-header">
        <div className="section-title">
          <span className="section-icon">🎮</span>
          <h2>Monitoring Control</h2>
        </div>
      </div>

      <div className="monitoring-control">
        <button className="start-button" onClick={onStartMonitoring} disabled={isMonitoring}>
          Start Monitoring
        </button>
      </div>

      <div className="bot-status">
        <h3>Bot Status</h3>
        <div className="bot-table">
          <div className="table-header">
            <div className="header-cell">Bot Name</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Actions</div>
          </div>
          {bots.map((bot) => (
            <div key={bot.id} className="table-row">
              <div className="table-cell">{bot.name}</div>
              <div className="table-cell">
                <div className="status-indicator unknown">
                  <div className="status-dot"></div>
                  <span>{bot.status}</span>
                </div>
              </div>
              <div className="table-cell">
                <button className="launch-button" onClick={() => onLaunchBot(bot.id)}>
                  <span className="button-icon">🚀</span>
                  Launch
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MonitoringControl

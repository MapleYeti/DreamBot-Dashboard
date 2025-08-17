import React, { useState } from 'react'
import './MonitoringCard.css'

interface Bot {
  id: string
  name: string
  status: 'Online' | 'Offline' | 'Starting' | 'Error'
  enabled: boolean
}

interface MonitoringState {
  enabled: boolean
  bots: Bot[]
}

const MonitoringCard: React.FC = () => {
  const [monitoring, setMonitoring] = useState<MonitoringState>({
    enabled: false,
    bots: [
      {
        id: '1',
        name: 'Woodcutter Bot',
        status: 'Offline',
        enabled: true
      },
      {
        id: '2',
        name: 'Fishing Bot',
        status: 'Online',
        enabled: true
      },
      {
        id: '3',
        name: 'Mining Bot',
        status: 'Starting',
        enabled: false
      },
      {
        id: '4',
        name: 'Combat Bot',
        status: 'Error',
        enabled: true
      }
    ]
  })

  const handleStartMonitoring = (): void => {
    setMonitoring((prev) => ({
      ...prev,
      enabled: !prev.enabled
    }))
  }

  const handleLaunchBot = (botId: string): void => {
    setMonitoring((prev) => ({
      ...prev,
      bots: prev.bots.map((bot) =>
        bot.id === botId ? { ...bot, status: 'Starting' as const } : bot
      )
    }))
  }

  return (
    <section className="dashboard-section">
      <div className="section-header">
        <div className="section-title">
          <span className="section-icon">🎮</span>
          <h2>Monitoring Control</h2>
        </div>
      </div>

      <div className="monitoring-control">
        <button
          className="start-button"
          onClick={handleStartMonitoring}
          disabled={monitoring.enabled}
        >
          {monitoring.enabled ? 'Stop Monitoring' : 'Start Monitoring'}
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
          {monitoring.bots.map((bot) => (
            <div key={bot.id} className="table-row">
              <div className="table-cell">{bot.name}</div>
              <div className="table-cell">
                <div className={`status-indicator ${bot.status.toLowerCase()}`}>
                  <div className="status-dot"></div>
                  <span>{bot.status}</span>
                </div>
              </div>
              <div className="table-cell">
                <button
                  className="launch-button"
                  onClick={() => handleLaunchBot(bot.id)}
                  disabled={!bot.enabled}
                >
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

export default MonitoringCard

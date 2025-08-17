import React, { useState } from 'react'
import styles from './MonitoringCard.module.css'

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
    <section className={styles.dashboardSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🎮</span>
          <h2>Monitoring Control</h2>
        </div>
      </div>

      <div className={styles.monitoringControl}>
        <button
          className={styles.startButton}
          onClick={handleStartMonitoring}
          disabled={monitoring.enabled}
        >
          {monitoring.enabled ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
      </div>

      <div className={styles.botStatus}>
        <h3>Bot Status</h3>
        <div className={styles.botTable}>
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>Bot Name</div>
            <div className={styles.headerCell}>Status</div>
            <div className={styles.headerCell}>Actions</div>
          </div>
          {monitoring.bots.map((bot) => (
            <div key={bot.id} className={styles.tableRow}>
              <div className={styles.tableCell}>{bot.name}</div>
              <div className={styles.tableCell}>
                <div className={`${styles.statusIndicator} ${styles[bot.status.toLowerCase()]}`}>
                  <div className={styles.statusDot}></div>
                  <span>{bot.status}</span>
                </div>
              </div>
              <div className={styles.tableCell}>
                <button
                  className={styles.launchButton}
                  onClick={() => handleLaunchBot(bot.id)}
                  disabled={!bot.enabled}
                >
                  <span className={styles.buttonIcon}>🚀</span>
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

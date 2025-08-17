import React, { useState, useEffect } from 'react'
import { useAppConfig } from '../../../hooks/useAppConfig'
import styles from './MonitoringCard.module.css'

interface BotStatus {
  id: string
  name: string
  status: 'Online' | 'Offline' | 'Starting' | 'Error'
  enabled: boolean
  webhookUrl: string
  launchScript: string
}

interface MonitoringState {
  enabled: boolean
  bots: BotStatus[]
}

const MonitoringCard: React.FC = () => {
  const appConfigContext = useAppConfig()
  const [monitoring, setMonitoring] = useState<MonitoringState>({
    enabled: false,
    bots: []
  })

  // Update bots list when config changes
  useEffect(() => {
    if (appConfigContext.config?.BOT_CONFIG) {
      const botEntries = Object.entries(appConfigContext.config.BOT_CONFIG)
      const botStatusList: BotStatus[] = botEntries.map(([botName, botConfig]) => ({
        id: botName,
        name: botName,
        status: 'Offline' as const, // Default status for new bots
        enabled: true, // Default to enabled
        webhookUrl: botConfig.webhookUrl,
        launchScript: botConfig.launchScript
      }))

      setMonitoring((prev) => ({
        ...prev,
        bots: botStatusList
      }))
    }
  }, [appConfigContext.config])

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

  if (appConfigContext.isLoading) {
    return (
      <section className={styles.dashboardSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🎮</span>
            <h2>Monitoring Control</h2>
          </div>
        </div>
        <div className={styles.loadingMessage}>Loading bot configurations...</div>
      </section>
    )
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
        {monitoring.bots.length === 0 ? (
          <div className={styles.noBotsMessage}>
            No bots configured. Add bots in the Configuration section to see them here.
          </div>
        ) : (
          <div className={styles.botTable}>
            <div
              className={styles.tableHeader}
              style={{
                gridTemplateColumns: appConfigContext.config?.DREAMBOT_VIP_FEATURES
                  ? '1fr 1fr 1fr 1fr 1fr'
                  : '1fr 1fr 1fr'
              }}
            >
              <div className={styles.headerCell}>Bot Name</div>
              <div className={styles.headerCell}>Status</div>
              <div className={styles.headerCell}>Webhook</div>
              {appConfigContext.config?.DREAMBOT_VIP_FEATURES && (
                <div className={styles.headerCell}>Launch Script</div>
              )}
              {appConfigContext.config?.DREAMBOT_VIP_FEATURES && (
                <div className={styles.headerCell}>Actions</div>
              )}
            </div>
            {monitoring.bots.map((bot) => (
              <div
                key={bot.id}
                className={styles.tableRow}
                style={{
                  gridTemplateColumns: appConfigContext.config?.DREAMBOT_VIP_FEATURES
                    ? '1fr 1fr 1fr 1fr 1fr'
                    : '1fr 1fr 1fr'
                }}
              >
                <div className={styles.tableCell}>{bot.name}</div>
                <div className={styles.tableCell}>
                  <div className={`${styles.statusIndicator} ${styles[bot.status.toLowerCase()]}`}>
                    <div className={styles.statusDot}></div>
                    <span>{bot.status}</span>
                  </div>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.configStatus}>
                    {bot.webhookUrl ? (
                      <span className={styles.configured}>✓ Configured</span>
                    ) : (
                      <span className={styles.notConfigured}>✗ Not configured</span>
                    )}
                  </div>
                </div>
                {appConfigContext.config?.DREAMBOT_VIP_FEATURES && (
                  <div className={styles.tableCell}>
                    <div className={styles.configStatus}>
                      {bot.launchScript ? (
                        <span className={styles.configured}>✓ Configured</span>
                      ) : (
                        <span className={styles.notConfigured}>✗ Not configured</span>
                      )}
                    </div>
                  </div>
                )}
                <div className={styles.tableCell}>
                  {appConfigContext.config?.DREAMBOT_VIP_FEATURES && (
                    <button
                      className={styles.launchButton}
                      onClick={() => handleLaunchBot(bot.id)}
                      disabled={!bot.enabled}
                    >
                      <span className={styles.buttonIcon}>🚀</span>
                      Launch
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default MonitoringCard

import React, { useState, useEffect } from 'react'
import { useAppConfig } from '../../../hooks/useAppConfig'
import { useMonitoring } from '../../../hooks/useMonitoring'
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges'
import styles from './MonitoringCard.module.css'

interface BotStatus {
  id: string
  name: string
  status: 'Online' | 'Offline' | 'Starting' | 'Error'
  enabled: boolean
  webhookUrl: string
  launchScript: string
}

const MonitoringCard: React.FC = () => {
  const appConfigContext = useAppConfig()
  const monitoring = useMonitoring()
  const { hasUnsavedChanges } = useUnsavedChanges()
  const [bots, setBots] = useState<BotStatus[]>([])

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

      setBots(botStatusList)
    }
  }, [appConfigContext.config])

  const handleStartMonitoring = async (): Promise<void> => {
    await monitoring.startMonitoring()
  }

  const handleStopMonitoring = async (): Promise<void> => {
    await monitoring.stopMonitoring()
  }

  const handleLaunchBot = (botId: string): void => {
    setBots((prev) =>
      prev.map((bot) => (bot.id === botId ? { ...bot, status: 'Starting' as const } : bot))
    )
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
          <h2>Monitoring</h2>
        </div>
      </div>

      <div className={styles.monitoringControl}>
        {monitoring.error && <div className={styles.errorMessage}>Error: {monitoring.error}</div>}

        <div className={styles.monitoringRow}>
          <button
            className={monitoring.status.isMonitoring ? styles.stopButton : styles.startButton}
            onClick={monitoring.status.isMonitoring ? handleStopMonitoring : handleStartMonitoring}
            disabled={
              monitoring.isLoading || (!monitoring.status.isMonitoring && hasUnsavedChanges)
            }
          >
            {monitoring.isLoading
              ? 'Processing...'
              : monitoring.status.isMonitoring
                ? 'Stop Monitoring'
                : 'Start Monitoring'}
          </button>

          <div
            className={`${styles.monitoringStatus} ${
              monitoring.status.isMonitoring
                ? styles.active
                : hasUnsavedChanges
                  ? styles.pending
                  : ''
            }`}
          >
            {monitoring.status.isMonitoring ? (
              <>
                <span className={`${styles.statusIndicator} ${styles.online}`}>
                  <div className={`${styles.statusDot} ${styles.online}`}></div>
                  Active
                </span>
                <span className={styles.statusDetails}>
                  Watching {monitoring.status.watchedFiles.length} files in{' '}
                  {monitoring.status.watchedFolders.length} bot folders
                </span>
              </>
            ) : (
              <>
                <span
                  className={`${styles.statusIndicator} ${hasUnsavedChanges ? styles.pending : styles.offline}`}
                >
                  <div
                    className={`${styles.statusDot} ${hasUnsavedChanges ? styles.pending : styles.offline}`}
                  ></div>
                  {hasUnsavedChanges ? 'Pending' : 'Inactive'}
                </span>
                <span className={styles.statusDetails}>
                  {hasUnsavedChanges
                    ? '⚠️ Save config to start monitoring'
                    : 'No monitoring active'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.botStatus}>
        <h3>Bot Status</h3>
        {bots.length === 0 ? (
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
            {bots.map((bot) => (
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
                {appConfigContext.config?.DREAMBOT_VIP_FEATURES && (
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
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {monitoring.logUpdates.length > 0 && (
        <div className={styles.logUpdates}>
          <div className={styles.logUpdatesHeader}>
            <h3>Recent Log Updates</h3>
            <button className={styles.clearButton} onClick={monitoring.clearLogUpdates}>
              Clear
            </button>
          </div>
          <div className={styles.logUpdatesList}>
            {monitoring.logUpdates.slice(0, 10).map((update, index) => (
              <div key={index} className={styles.logUpdate}>
                <div className={styles.logUpdateHeader}>
                  <span className={styles.logBotName}>{update.botName}</span>
                  <span className={styles.logFileName}>{update.fileName}</span>
                  <span className={styles.logTimestamp}>
                    {new Date(update.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className={styles.logContent}>{update.newContent}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default MonitoringCard

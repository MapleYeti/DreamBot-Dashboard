import React, { useMemo } from 'react'
import { useAppConfig } from '../../../hooks/useAppConfig'
import { useMonitoring } from '../../../hooks/useMonitoring'
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges'
import { useBotLaunch } from '../../../hooks/useBotLaunch'
import styles from './MonitoringCard.module.css'

interface BotStatus {
  id: string
  name: string
  status: 'Online' | 'Offline' | 'Starting' | 'Error'
  enabled: boolean
  webhookUrl: string
  launchScript: string
  isRunning?: boolean
  pid?: number
}

const MonitoringCard: React.FC = () => {
  const appConfigContext = useAppConfig()
  const monitoring = useMonitoring()
  const { hasUnsavedChanges } = useUnsavedChanges()
  const { botStatuses, launchBot, stopBot, isLoading: botLaunchLoading } = useBotLaunch()

  // Derive bots list from config and bot statuses
  const bots: BotStatus[] = useMemo(() => {
    if (!appConfigContext.config?.BOT_CONFIG) return []

    return Object.entries(appConfigContext.config.BOT_CONFIG).map(([botName, botConfig]) => {
      const status = botStatuses[botName]
      return {
        id: botName,
        name: botName,
        status: status?.isRunning ? ('Online' as const) : ('Offline' as const),
        enabled: true,
        webhookUrl: botConfig.webhookUrl,
        launchScript: botConfig.launchScript,
        isRunning: status?.isRunning ?? false,
        pid: status?.pid
      }
    })
  }, [appConfigContext.config?.BOT_CONFIG, botStatuses])

  const handleStartMonitoring = () => monitoring.startMonitoring()
  const handleStopMonitoring = () => monitoring.stopMonitoring()

  const handleLaunchBot = async (botId: string): Promise<void> => {
    try {
      const result = await launchBot(botId)
      if (!result.success) {
        console.error(`Failed to launch bot ${botId}:`, result.message)
      }
      // Success case is handled by real-time status updates
    } catch (error) {
      console.error(`Error launching bot ${botId}:`, error)
    }
  }

  const handleStopBot = async (botId: string): Promise<void> => {
    try {
      const result = await stopBot(botId)
      if (!result.success) {
        console.error(`Failed to stop bot ${botId}:`, result.message)
      }
      // Success case is handled by real-time status updates
    } catch (error) {
      console.error(`Error stopping bot ${botId}:`, error)
    }
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

      {appConfigContext.config?.DREAMBOT_VIP_FEATURES && (
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
                style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}
              >
                <div className={styles.headerCell}>Bot Name</div>
                <div className={styles.headerCell}>Status</div>
                <div className={styles.headerCell}>Webhook</div>
                <div className={styles.headerCell}>Launch Script</div>
                <div className={styles.headerCell}>Actions</div>
              </div>
              {bots.map((bot) => (
                <div
                  key={bot.id}
                  className={styles.tableRow}
                  style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}
                >
                  <div className={styles.tableCell}>{bot.name}</div>
                  <div className={styles.tableCell}>
                    <div
                      className={`${styles.statusIndicator} ${styles[bot.status.toLowerCase()]}`}
                    >
                      <div className={styles.statusDot}></div>
                      <span>{bot.status}</span>
                      {bot.isRunning && bot.pid && (
                        <span className={styles.pidInfo}> (PID: {bot.pid})</span>
                      )}
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
                  <div className={styles.tableCell}>
                    <div className={styles.configStatus}>
                      {bot.launchScript ? (
                        <span className={styles.configured}>✓ Configured</span>
                      ) : (
                        <span className={styles.notConfigured}>✗ Not configured</span>
                      )}
                    </div>
                  </div>
                  <div className={styles.tableCell}>
                    {bot.isRunning ? (
                      <button
                        className={styles.stopButton}
                        onClick={() => handleStopBot(bot.id)}
                        disabled={botLaunchLoading}
                      >
                        <span className={styles.buttonIcon}>⏹️</span>
                        Stop
                      </button>
                    ) : (
                      <button
                        className={styles.launchButton}
                        onClick={() => handleLaunchBot(bot.id)}
                        disabled={!bot.launchScript || botLaunchLoading}
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
      )}

      {appConfigContext.config?.DREAMBOT_VIP_FEATURES && (
        <div className={styles.footer}>
          <p className={styles.helpText}>💡 Must launch bot through dashboard to track status</p>
        </div>
      )}
    </section>
  )
}

export default MonitoringCard

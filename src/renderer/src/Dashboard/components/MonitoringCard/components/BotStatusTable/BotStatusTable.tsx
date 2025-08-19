import React from 'react'
import Button from '../../../../../components/Button'
import styles from './BotStatusTable.module.css'

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

interface BotStatusTableProps {
  bots: BotStatus[]
  isLoading: boolean
  isConfigReady: boolean
  onLaunchBot: (botId: string) => Promise<void>
  onStopBot: (botId: string) => Promise<void>
}

const BotStatusTable: React.FC<BotStatusTableProps> = ({
  bots,
  isLoading,
  isConfigReady,
  onLaunchBot,
  onStopBot
}) => {
  if (bots.length === 0) {
    return (
      <div className={styles.noBotsMessage}>
        No bots configured. Add bots in the Configuration section to see them here.
      </div>
    )
  }

  return (
    <div className={styles.botTable}>
      <div className={styles.tableHeader} style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>
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
              <Button
                color="danger"
                size="small"
                onClick={() => onStopBot(bot.id)}
                disabled={isLoading}
                icon="⏹️"
                fullWidth
              >
                Stop
              </Button>
            ) : (
              <Button
                color="success"
                size="small"
                onClick={() => onLaunchBot(bot.id)}
                disabled={!bot.launchScript || isLoading || !isConfigReady}
                title={
                  !isConfigReady
                    ? 'Fix configuration errors before launching'
                    : !bot.launchScript
                      ? 'Configure launch script before launching'
                      : undefined
                }
                icon="🚀"
                fullWidth
              >
                Launch
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default BotStatusTable

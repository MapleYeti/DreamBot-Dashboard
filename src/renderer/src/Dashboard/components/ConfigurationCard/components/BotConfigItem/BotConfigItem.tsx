import React from 'react'
import styles from './BotConfigItem.module.css'

interface Bot {
  id: string
  name: string
  webhookUrl: string
  launchScript: string
}

interface BotConfigItemProps {
  bot: Bot
  onEdit: (botId: string) => void
  onRemove: (botId: string) => void
}

const BotConfigItem: React.FC<BotConfigItemProps> = ({ bot, onEdit, onRemove }) => {
  const hasWebhook = !!bot.webhookUrl
  const hasLaunchScript = !!bot.launchScript

  return (
    <div className={styles.botConfigItem}>
      <div className={styles.botInfo}>
        <div className={styles.botName}>{bot.name}</div>
        <div className={styles.botStatus}>
          <div className={styles.statusItem}>
            <span
              className={`${styles.statusIcon} ${hasWebhook ? styles.statusConfigured : styles.statusNotConfigured}`}
            >
              {hasWebhook ? '✓' : '✗'}
            </span>
            <span className={styles.statusText}>
              {hasWebhook ? 'Webhook configured' : 'Webhook not configured'}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span
              className={`${styles.statusIcon} ${hasLaunchScript ? styles.statusConfigured : styles.statusNotConfigured}`}
            >
              {hasLaunchScript ? '✓' : '✗'}
            </span>
            <span className={styles.statusText}>
              {hasLaunchScript ? 'Launch CLI configured' : 'Launch CLI not configured'}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.botActions}>
        <button className={styles.editButton} onClick={() => onEdit(bot.id)}>
          Edit
        </button>
        <button className={styles.removeButton} onClick={() => onRemove(bot.id)}>
          Remove
        </button>
      </div>
    </div>
  )
}

export default BotConfigItem

import React from 'react'
import styles from './BotConfigItem.module.css'

interface Bot {
  id: string
  name: string
  webhookConfigured: boolean
  launchCliConfigured: boolean
}

interface BotConfigItemProps {
  bot: Bot
  onEdit: (botId: string) => void
  onRemove: (botId: string) => void
}

const BotConfigItem: React.FC<BotConfigItemProps> = ({ bot, onEdit, onRemove }) => {
  return (
    <div className={styles.botConfigItem}>
      <div className={styles.botInfo}>
        <div className={styles.botName}>{bot.name}</div>
        <div className={styles.botStatus}>
          <div className={styles.statusItem}>
            <span className={styles.statusIcon}>
              {bot.webhookConfigured ? '✓' : '✗'}
            </span>
            <span className={styles.statusText}>
              {bot.webhookConfigured ? 'Webhook configured' : 'Webhook not configured'}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusIcon}>
              {bot.launchCliConfigured ? '✓' : '✗'}
            </span>
            <span className={styles.statusText}>
              {bot.launchCliConfigured ? 'Launch CLI configured' : 'Launch CLI not configured'}
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

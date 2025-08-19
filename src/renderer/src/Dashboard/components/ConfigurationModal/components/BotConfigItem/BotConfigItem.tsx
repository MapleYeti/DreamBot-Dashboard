import React, { useState } from 'react'
import Button from '../../../../../components/Button'
import styles from './BotConfigItem.module.css'
import BotConfigModal from '../BotConfigModal'
import type { BotConfig } from '@shared/types/configTypes'

interface Bot {
  id: string
  name: string
  webhookUrl: string
  launchScript: string
}

interface BotConfigItemProps {
  bot: Bot
  onEdit: (botName: string, botConfig: BotConfig) => void
  onRemove: (botId: string) => void
  disabled?: boolean
}

const BotConfigItem: React.FC<BotConfigItemProps> = ({
  bot,
  onEdit,
  onRemove,
  disabled = false
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const hasWebhook = !!bot.webhookUrl
  const hasLaunchScript = !!bot.launchScript

  const handleEdit = () => {
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = (botName: string, botConfig: BotConfig) => {
    onEdit(botName, botConfig)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
  }

  return (
    <>
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
          <Button
            color="primary"
            variant="outline"
            size="small"
            onClick={handleEdit}
            disabled={disabled}
          >
            Edit
          </Button>
          <Button
            color="danger"
            variant="outline"
            size="small"
            onClick={() => onRemove(bot.id)}
            disabled={disabled}
          >
            Remove
          </Button>
        </div>
      </div>

      {isEditModalOpen ? (
        <BotConfigModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          mode="edit"
          botName={bot.name}
          botConfig={{ webhookUrl: bot.webhookUrl, launchScript: bot.launchScript }}
          onSubmit={handleEditSubmit}
        />
      ) : null}
    </>
  )
}

export default BotConfigItem

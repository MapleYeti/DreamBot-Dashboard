import React, { useState } from 'react'
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
  vipFeaturesEnabled: boolean
  onEdit: (botName: string, botConfig: BotConfig) => void
  onRemove: (botId: string) => void
}

const BotConfigItem: React.FC<BotConfigItemProps> = ({
  bot,
  vipFeaturesEnabled,
  onEdit,
  onRemove
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
            {vipFeaturesEnabled && (
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
            )}
          </div>
        </div>
        <div className={styles.botActions}>
          <button className={styles.editButton} onClick={handleEdit}>
            Edit
          </button>
          <button className={styles.removeButton} onClick={() => onRemove(bot.id)}>
            Remove
          </button>
        </div>
      </div>

      {isEditModalOpen ? (
        <BotConfigModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          mode="edit"
          botName={bot.name}
          botConfig={{ webhookUrl: bot.webhookUrl, launchScript: bot.launchScript }}
          vipFeaturesEnabled={vipFeaturesEnabled}
          onSubmit={handleEditSubmit}
        />
      ) : null}
    </>
  )
}

export default BotConfigItem

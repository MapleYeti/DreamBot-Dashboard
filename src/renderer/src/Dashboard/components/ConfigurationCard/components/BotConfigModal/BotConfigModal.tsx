import React, { useState } from 'react'
import type { BotConfig } from '@shared/types/configTypes'
import styles from './BotConfigModal.module.css'

interface BotConfigModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  botName?: string
  botConfig?: BotConfig
  onSubmit: (botName: string, botConfig: BotConfig) => void
}

const BotConfigModal: React.FC<BotConfigModalProps> = ({
  isOpen,
  onClose,
  mode,
  botName: initialBotName = '',
  botConfig: initialBotConfig = { webhookUrl: '', launchScript: '' },
  onSubmit
}) => {
  const [botName, setBotName] = useState(initialBotName)
  const [webhookUrl, setWebhookUrl] = useState(initialBotConfig.webhookUrl)
  const [launchScript, setLaunchScript] = useState(initialBotConfig.launchScript)
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: string[] = []

    if (!botName.trim()) {
      newErrors.push('Bot name is required')
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    const newBotConfig: BotConfig = {
      webhookUrl: webhookUrl.trim() || '',
      launchScript: launchScript.trim() || ''
    }

    onSubmit(botName.trim(), newBotConfig)
    handleClose()
  }

  const handleClose = () => {
    setBotName('')
    setWebhookUrl('')
    setLaunchScript('')
    setErrors([])
    onClose()
  }

  if (!isOpen) return null

  const isEditMode = mode === 'edit'
  const title = isEditMode ? `Edit Bot: ${initialBotName}` : 'Add New Bot'
  const submitButtonText = isEditMode ? 'Save Changes' : 'Add Bot'

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="botName">Bot Name:</label>
            <input
              id="botName"
              type="text"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              placeholder="e.g., MiningBot, FishingBot"
              className={styles.input}
              disabled={isEditMode}
            />
            <small className={styles.fieldHint}>
              ⚠️ This is the bot account&apos;s nickname in DreamBot, not the bot&apos;s RSN
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="webhookUrl">Webhook URL (Optional):</label>
            <input
              id="webhookUrl"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="launchScript">Launch Script (Optional):</label>
            <input
              id="launchScript"
              type="text"
              value={launchScript}
              onChange={(e) => setLaunchScript(e.target.value)}
              placeholder="script_name.txt"
              className={styles.input}
            />
          </div>

          {errors.length > 0 && (
            <div className={styles.errors}>
              {errors.map((error, index) => (
                <div key={index} className={styles.error}>
                  {error}
                </div>
              ))}
            </div>
          )}

          <div className={styles.modalActions}>
            <button type="button" onClick={handleClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BotConfigModal

import React, { useState, useEffect } from 'react'
import type { BotConfig } from '@shared/types/configTypes'
import Button from '../../../../../components/Button'
import Modal from '../../../../../components/Modal'
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

  // Reset form when modal opens with new initial values
  useEffect(() => {
    if (isOpen) {
      setBotName(initialBotName)
      setWebhookUrl(initialBotConfig.webhookUrl)
      setLaunchScript(initialBotConfig.launchScript)
      setErrors([])
    }
  }, [isOpen, initialBotName, initialBotConfig.webhookUrl, initialBotConfig.launchScript])

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
  const submitButtonText = isEditMode ? 'Done' : 'Add Bot'

  // Check if there are any changes
  const hasChanges = () => {
    if (mode === 'add') {
      // For add mode, enable if bot name is filled
      return botName.trim() !== ''
    } else {
      // For edit mode, check if any field has changed
      return (
        botName.trim() !== initialBotName ||
        webhookUrl.trim() !== initialBotConfig.webhookUrl ||
        launchScript.trim() !== initialBotConfig.launchScript
      )
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      icon="🤖"
      size="small"
      footer={
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.modalActions}>
            <Button color="secondary" variant="outline" onClick={handleClose} type="button">
              Cancel
            </Button>
            <Button
              color="success"
              type="submit"
              disabled={!hasChanges()}
              title={
                mode === 'edit'
                  ? !hasChanges()
                    ? 'No changes to save'
                    : 'Save changes'
                  : !hasChanges()
                    ? 'Bot name is required'
                    : 'Add bot configuration'
              }
            >
              {submitButtonText}
            </Button>
          </div>
        </form>
      }
    >
      <div className={styles.formContent}>
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
      </div>
    </Modal>
  )
}

export default BotConfigModal

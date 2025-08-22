import React, { useState, useEffect, useCallback } from 'react'
import { Card } from '../../../components/Card'
import Button from '../../../components/Button'
import HelpText from '../../../components/HelpText'
import type { AppConfig, BotConfig } from '@shared/types/configTypes'
import Modal from '../../../components/Modal'
import styles from './ConfigurationModal.module.css'
import StatusBadge from './components/StatusBadge'
import ConfigInput from './components/ConfigInput'
import CheckboxField from './components/CheckboxField'
import BotConfigItem from './components/BotConfigItem'

import BotConfigModal from './components/BotConfigModal'
import { useAppConfig } from '../../../hooks/useAppConfig'
import { useConfigApi } from '../../../hooks/useConfigApi'
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges'
import { useMonitoring } from '../../../hooks/useMonitoring'
import { ConfigStatus } from './types/ConfigStatus'

interface ConfigurationModalProps {
  isOpen: boolean
  onClose: () => void
}

const ConfigurationModal: React.FC<ConfigurationModalProps> = ({ isOpen, onClose }) => {
  const appConfigContext = useAppConfig()
  const { setHasUnsavedChanges } = useUnsavedChanges()
  const { saveConfig } = useConfigApi()
  const monitoring = useMonitoring()
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isBotModalOpen, setIsBotModalOpen] = useState(false)
  const [localConfig, setLocalConfig] = useState<AppConfig>(
    appConfigContext.config || {
      BASE_LOG_DIRECTORY: '',
      DREAMBOT_VIP_FEATURES: false,
      BASE_WEBHOOK_URL: '',
      BOT_CONFIG: {},
      THEME_MODE: 'light'
    }
  )

  const isDisabled = monitoring.status.isMonitoring

  // Update local config when context changes
  useEffect(() => {
    if (appConfigContext.config) {
      setLocalConfig(appConfigContext.config)
      setValidationErrors(appConfigContext.errors)
    }
  }, [appConfigContext.config, appConfigContext.errors])

  // Check if there are unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    if (!appConfigContext.config) return false

    return (
      localConfig.BASE_LOG_DIRECTORY !== appConfigContext.config.BASE_LOG_DIRECTORY ||
      localConfig.DREAMBOT_VIP_FEATURES !== appConfigContext.config.DREAMBOT_VIP_FEATURES ||
      localConfig.BASE_WEBHOOK_URL !== appConfigContext.config.BASE_WEBHOOK_URL ||
      JSON.stringify(localConfig.BOT_CONFIG) !== JSON.stringify(appConfigContext.config.BOT_CONFIG)
    )
  }, [localConfig, appConfigContext.config])

  // Determine config status based on validation errors and unsaved changes
  const getConfigStatus = useCallback((): ConfigStatus => {
    if (monitoring.status.isMonitoring) return ConfigStatus.MONITORING
    if (validationErrors.length > 0) return ConfigStatus.ERROR
    if (hasUnsavedChanges()) return ConfigStatus.UNSAVED
    return ConfigStatus.SAVED
  }, [monitoring.status.isMonitoring, validationErrors.length, hasUnsavedChanges])

  // Update unsaved changes state when local config changes
  useEffect(() => {
    const hasChanges = hasUnsavedChanges()
    setHasUnsavedChanges(hasChanges)
  }, [localConfig, appConfigContext.config, setHasUnsavedChanges, hasUnsavedChanges])

  const handleClose = () => {
    handleReset()
    setIsBotModalOpen(false)
    onClose()
  }

  const handleLogsDirectoryChange = (value: string) => {
    setLocalConfig((prev) => ({ ...prev, BASE_LOG_DIRECTORY: value }))
  }

  const handleBaseWebhookUrlChange = (value: string) => {
    setLocalConfig((prev) => ({ ...prev, BASE_WEBHOOK_URL: value }))
  }

  const handleVipFeaturesChange = (checked: boolean) => {
    setLocalConfig((prev) => ({ ...prev, DREAMBOT_VIP_FEATURES: checked }))
  }

  const handleAddBot = () => {
    if (!isDisabled) {
      setIsBotModalOpen(true)
    }
  }

  const handleEditBot = () => {
    if (!isDisabled) {
      setIsBotModalOpen(true)
    }
  }

  const handleDeleteBot = (botName: string) => {
    if (!isDisabled) {
      const updatedBotConfig = { ...localConfig.BOT_CONFIG }
      delete updatedBotConfig[botName]
      setLocalConfig((prev) => ({ ...prev, BOT_CONFIG: updatedBotConfig }))
    }
  }

  const handleBotConfigSubmit = (botName: string, botConfig: BotConfig) => {
    setLocalConfig((prev) => ({
      ...prev,
      BOT_CONFIG: {
        ...prev.BOT_CONFIG,
        [botName]: botConfig
      }
    }))
  }

  const handleSave = async () => {
    await saveConfig(localConfig)
    handleClose()
  }

  const handleReset = () => {
    if (appConfigContext.config) {
      setLocalConfig(appConfigContext.config)
    }
  }

  const handleSelectDirectory = async () => {
    try {
      const selectedPath = await window.api.dialog.selectDirectory()
      if (selectedPath) {
        handleLogsDirectoryChange(selectedPath)
      }
    } catch (error) {
      console.error('Failed to select directory:', error)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Configuration Settings"
      icon="⚙️"
      size="large"
      headerActions={<StatusBadge status={getConfigStatus()} />}
      footer={
        <div className={styles.footerActions}>
          <Button
            color="secondary"
            onClick={handleClose}
            disabled={isDisabled}
            title="Cancel changes and revert to saved configuration"
          >
            Cancel
          </Button>
          <Button
            color="success"
            onClick={handleSave}
            disabled={isDisabled || !hasUnsavedChanges()}
            title={!hasUnsavedChanges() ? 'No changes to save' : 'Save configuration changes'}
          >
            Save Changes
          </Button>
        </div>
      }
    >
      <div className={styles.configurationModalContent}>
        <Card title="Log Directory" icon="📁" spacing="tight">
          <HelpText>
            Select the directory where DreamBot stores log files. This is typically located in your
            DreamBot installation folder.
          </HelpText>
          <div className={styles.logDirectorySection}>
            <ConfigInput
              label="Logs Directory Path"
              value={localConfig.BASE_LOG_DIRECTORY}
              onChange={handleLogsDirectoryChange}
              placeholder="C:/Users/YourName/DreamBot/Logs"
              disabled={isDisabled}
            />
            <Button
              color="secondary"
              variant="outline"
              size="small"
              onClick={handleSelectDirectory}
              disabled={isDisabled}
              icon="📁"
            >
              Browse
            </Button>
          </div>
        </Card>

        <Card title="Webhook Configuration" icon="🔗" spacing="tight">
          <HelpText>
            Configure the base webhook URL for Discord notifications. Individual bot configurations
            can override this setting.
          </HelpText>
          <ConfigInput
            label="Base Webhook URL"
            value={localConfig.BASE_WEBHOOK_URL}
            onChange={handleBaseWebhookUrlChange}
            placeholder="https://discord.com/api/webhooks/..."
            disabled={isDisabled}
          />
        </Card>

        <Card title="Features" icon="✨" spacing="tight">
          <CheckboxField
            label="Enable VIP Features"
            checked={localConfig.DREAMBOT_VIP_FEATURES}
            onChange={handleVipFeaturesChange}
            disabled={isDisabled}
            description="Enables advanced features for DreamBot VIP users, including enhanced monitoring and additional bot status indicators."
          />
        </Card>

        {localConfig.DREAMBOT_VIP_FEATURES ? (
          <Card title="Bot Configurations" icon="🤖" spacing="tight">
            <div className={styles.sectionHeader}>
              <Button
                color="primary"
                onClick={handleAddBot}
                disabled={isDisabled}
                title={
                  isDisabled
                    ? 'Cannot modify while monitoring is active'
                    : 'Add new bot configuration'
                }
                icon="➕"
              >
                Add Bot
              </Button>
            </div>

            {Object.entries(localConfig.BOT_CONFIG).length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>🤖</div>
                <h5 className={styles.emptyStateTitle}>No Bot Configurations</h5>
                <p className={styles.emptyStateDescription}>
                  Add your first bot configuration to start monitoring and managing your DreamBot
                  instances.
                </p>
                <Button color="primary" onClick={handleAddBot} disabled={isDisabled} icon="➕">
                  Add Your First Bot
                </Button>
              </div>
            ) : (
              <div className={styles.botList}>
                {Object.entries(localConfig.BOT_CONFIG).map(([botName, botConfig]) => (
                  <BotConfigItem
                    key={botName}
                    bot={{
                      id: botName,
                      name: botName,
                      webhookUrl: botConfig.webhookUrl,
                      launchScript: botConfig.launchScript
                    }}
                    onEdit={() => handleEditBot()}
                    onRemove={handleDeleteBot}
                    disabled={isDisabled}
                  />
                ))}
              </div>
            )}
          </Card>
        ) : null}

        <BotConfigModal
          isOpen={isBotModalOpen}
          onClose={() => setIsBotModalOpen(false)}
          mode="add"
          onSubmit={handleBotConfigSubmit}
        />
      </div>
    </Modal>
  )
}

export default ConfigurationModal

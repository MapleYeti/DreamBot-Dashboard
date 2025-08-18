import React, { useState, useEffect, useCallback } from 'react'

import { Card } from '../../../components/Card'
import HelpText from '../../../components/HelpText'
import type { AppConfig } from '@shared/types/configTypes'
import styles from './ConfigurationCard.module.css'
import StatusBadge from './components/StatusBadge/StatusBadge'
import ConfigInput from './components/ConfigInput/ConfigInput'
import CheckboxField from './components/CheckboxField/CheckboxField'
import BotConfigItem from './components/BotConfigItem/BotConfigItem'
import ActionButtons from './components/ActionButtons/ActionButtons'
import BotConfigModal from './components/BotConfigModal'
import { useAppConfig } from '../../../hooks/useAppConfig'
import { useConfigApi } from '../../../hooks/useConfigApi'
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges'
import { useMonitoring } from '../../../hooks/useMonitoring'
import { ConfigStatus } from './types/ConfigStatus'

const ConfigurationCard: React.FC = () => {
  const appConfigContext = useAppConfig()
  const { setHasUnsavedChanges } = useUnsavedChanges()
  const { saveConfig } = useConfigApi()
  const monitoring = useMonitoring()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isBotModalOpen, setIsBotModalOpen] = useState(false)
  const [localConfig, setLocalConfig] = useState<AppConfig>(
    appConfigContext.config || {
      BASE_LOG_DIRECTORY: '',
      DREAMBOT_VIP_FEATURES: false,
      BASE_WEBHOOK_URL: '',
      BOT_CONFIG: {}
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
  const hasUnsavedChanges = React.useCallback(() => {
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
    if (appConfigContext.errors && appConfigContext.errors.length > 0) return ConfigStatus.ERROR
    if (hasUnsavedChanges()) return ConfigStatus.UNSAVED
    return ConfigStatus.SAVED
  }, [monitoring.status.isMonitoring, appConfigContext.errors, hasUnsavedChanges])

  // Update unsaved changes state when local config changes
  // Probably refactor this later
  useEffect(() => {
    const hasChanges = hasUnsavedChanges()
    setHasUnsavedChanges(hasChanges)
  }, [localConfig, appConfigContext.config, setHasUnsavedChanges, hasUnsavedChanges])

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
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

  const handleBotSubmit = (
    botName: string,
    botConfig: import('@shared/types/configTypes').BotConfig
  ) => {
    setLocalConfig((prev) => ({
      ...prev,
      BOT_CONFIG: {
        ...prev.BOT_CONFIG,
        [botName]: botConfig
      }
    }))
  }

  const handleRemoveBot = (botId: string) => {
    setLocalConfig((prev) => {
      const newBotConfig = { ...prev.BOT_CONFIG }
      delete newBotConfig[botId]

      return {
        ...prev,
        BOT_CONFIG: newBotConfig
      }
    })
  }

  const handleSave = async () => {
    try {
      const result = await saveConfig(localConfig)
      if (result.success) {
        setValidationErrors([])
        // Config context will automatically refresh via event from backend
      } else {
        setValidationErrors(result.errors)
      }
    } catch (error) {
      console.error('Failed to save configuration:', error)
      setValidationErrors(['Failed to save configuration'])
    }
  }

  const handleUndo = () => {
    if (appConfigContext.config) {
      setLocalConfig(appConfigContext.config)
      setValidationErrors(appConfigContext.errors)
    }
  }

  const handleBrowseLogs = async () => {
    try {
      const selectedPath = await window.api.dialog.selectDirectory()
      if (selectedPath) {
        handleLogsDirectoryChange(selectedPath)
      }
    } catch (error) {
      console.error('Failed to select directory:', error)
    }
  }

  const handleCloseBotModal = () => {
    setIsBotModalOpen(false)
  }

  return (
    <>
      <Card
        isCollapsible={true}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        title="Configuration"
        icon="⚙️"
        headerActions={
          <>
            <StatusBadge status={getConfigStatus()} />
            <button className={styles.dropdownButton} onClick={handleToggleCollapse}>
              {isCollapsed ? '▼' : '▲'}
            </button>
          </>
        }
      >
        <ConfigInput
          label="DreamBot Logs Directory:"
          value={localConfig.BASE_LOG_DIRECTORY}
          onChange={handleLogsDirectoryChange}
          showBrowseButton={true}
          onBrowseClick={handleBrowseLogs}
          placeholder="C:\Users\username\DreamBot\Logs"
          disabled={isDisabled}
        />

        <ConfigInput
          label={`Webhook URL${localConfig.DREAMBOT_VIP_FEATURES ? ' (Optional when using Bot Configuration Webhooks)' : ''}`}
          value={localConfig.BASE_WEBHOOK_URL}
          onChange={handleBaseWebhookUrlChange}
          placeholder="https://discord.com/api/webhooks/..."
          disabled={isDisabled}
        />

        <CheckboxField
          label="DreamBot VIP Features"
          checked={localConfig.DREAMBOT_VIP_FEATURES}
          onChange={handleVipFeaturesChange}
          description="Enable advanced features Bot Configurations and Launch Scripts. Requires DreamBot VIP subscription."
          disabled={isDisabled}
        />

        {localConfig.DREAMBOT_VIP_FEATURES && (
          <div className={styles.botConfigurations}>
            <h3>Bot Configurations</h3>
            <div style={{ marginBottom: '10px' }}>
              <HelpText icon="💡" variant="info">
                Must launch bot with CLI script to use Bot-specific webhooks due to DreamBot&apos;s
                log file system
              </HelpText>
            </div>

            {Object.entries(localConfig.BOT_CONFIG).length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>🤖</div>
                <h4 className={styles.emptyStateTitle}>No Bot Configurations</h4>
                <p className={styles.emptyStateDescription}>
                  Get started by adding your first bot configuration. Each bot can have its own
                  webhook URL and launch script for automated management.
                </p>
                <button
                  className={styles.emptyStateButton}
                  onClick={handleAddBot}
                  disabled={isDisabled}
                >
                  <span>➕</span>
                  Add Your First Bot
                </button>
              </div>
            ) : (
              <>
                {Object.entries(localConfig.BOT_CONFIG).map(([botName, bot]) => (
                  <BotConfigItem
                    key={botName}
                    bot={{
                      id: botName,
                      name: botName,
                      webhookUrl: bot.webhookUrl,
                      launchScript: bot.launchScript
                    }}
                    onEdit={handleBotSubmit}
                    onRemove={handleRemoveBot}
                    disabled={isDisabled}
                  />
                ))}
                <button
                  className={styles.addBotButton}
                  onClick={handleAddBot}
                  disabled={isDisabled}
                >
                  + Add Bot
                </button>
              </>
            )}
          </div>
        )}

        <ActionButtons
          onSave={handleSave}
          onUndo={handleUndo}
          formHasChanges={hasUnsavedChanges()}
          disabled={isDisabled}
        />

        {validationErrors.length > 0 && (
          <div className={styles.validationErrors}>
            <h4>Configuration Issues:</h4>
            <ul>
              {validationErrors.map((error, index) => (
                <li key={index} className={styles.validationError}>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {isBotModalOpen ? (
        <BotConfigModal
          isOpen={isBotModalOpen}
          onClose={handleCloseBotModal}
          mode="add"
          onSubmit={handleBotSubmit}
        />
      ) : null}
    </>
  )
}

export default ConfigurationCard

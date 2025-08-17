import React, { useState, useEffect } from 'react'

import { Card } from '../../../components/Card'
import type { AppConfig } from '@shared/types/configTypes'
import styles from './ConfigurationCard.module.css'
import StatusBadge, { ConfigStatus } from './components/StatusBadge/StatusBadge'
import ConfigInput from './components/ConfigInput/ConfigInput'
import CheckboxField from './components/CheckboxField/CheckboxField'
import BotConfigItem from './components/BotConfigItem/BotConfigItem'
import ActionButtons from './components/ActionButtons/ActionButtons'
import FooterNotes from './components/FooterNotes/FooterNotes'
import BotConfigModal from './components/BotConfigModal'
import { useAppConfig } from '../../../hooks/useAppConfig'
import { useConfigApi } from '../../../hooks/useConfigApi'

const ConfigurationCard: React.FC = () => {
  const appConfigContext = useAppConfig()
  const { saveConfig } = useConfigApi()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [configStatus, setConfigStatus] = useState<ConfigStatus>('saved')
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isBotModalOpen, setIsBotModalOpen] = useState(false)
  const [localConfig, setLocalConfig] = useState<AppConfig>(
    appConfigContext.config || {
      BASE_LOG_DIRECTORY: '',
      DREAMBOT_VIP_FEATURES: true,
      BASE_WEBHOOK_URL: '',
      BOT_CONFIG: {}
    }
  )

  // Update local config when context changes
  useEffect(() => {
    if (appConfigContext.config) {
      setLocalConfig(appConfigContext.config)
      setValidationErrors(appConfigContext.errors)
      if (appConfigContext.errors.length > 0) {
        setConfigStatus('error')
      } else {
        setConfigStatus('saved')
      }
    }
  }, [appConfigContext.config, appConfigContext.errors])

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const handleLogsDirectoryChange = (value: string) => {
    setLocalConfig((prev) => ({ ...prev, BASE_LOG_DIRECTORY: value }))
    setConfigStatus('unsaved')
  }

  const handleBaseWebhookUrlChange = (value: string) => {
    setLocalConfig((prev) => ({ ...prev, BASE_WEBHOOK_URL: value }))
    setConfigStatus('unsaved')
  }

  const handleVipFeaturesChange = (checked: boolean) => {
    setLocalConfig((prev) => ({ ...prev, DREAMBOT_VIP_FEATURES: checked }))
    setConfigStatus('unsaved')
  }

  const handleAddBot = () => {
    setIsBotModalOpen(true)
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
    setConfigStatus('unsaved')
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
    setConfigStatus('unsaved')
  }

  const handleSave = async () => {
    try {
      const result = await saveConfig(localConfig)
      if (result.success) {
        setConfigStatus('saved')
        setValidationErrors([])
      } else {
        setConfigStatus('error')
        setValidationErrors(result.errors)
      }
    } catch (error) {
      console.error('Failed to save configuration:', error)
      setConfigStatus('error')
      setValidationErrors(['Failed to save configuration'])
    }
  }

  const handleUndo = () => {
    // TODO: Implement undo functionality
    console.log('Undoing changes')
  }

  const handleImport = () => {
    // TODO: Implement import functionality
    console.log('Importing configuration')
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting configuration')
  }

  const handleBrowseLogs = () => {
    // TODO: Implement file browser
    console.log('Opening logs directory browser')
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
            <StatusBadge status={configStatus} />
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
        />

        <ConfigInput
          label="Base Webhook URL (Optional):"
          value={localConfig.BASE_WEBHOOK_URL}
          onChange={handleBaseWebhookUrlChange}
          placeholder="https://discord.com/api/webhooks/..."
        />

        <CheckboxField
          label="DreamBot VIP Features"
          checked={localConfig.DREAMBOT_VIP_FEATURES}
          onChange={handleVipFeaturesChange}
          description="Enable advanced features like CLI bot launching. Requires DreamBot VIP subscription."
        />

        <div className={styles.botConfigurations}>
          <h3>Bot Configurations</h3>
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
            />
          ))}
          <button className={styles.addBotButton} onClick={handleAddBot}>
            + Add Bot
          </button>
        </div>

        <ActionButtons
          onSave={handleSave}
          onUndo={handleUndo}
          onImport={handleImport}
          onExport={handleExport}
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
        <FooterNotes />
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

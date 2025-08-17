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
import { useConfigApi } from '../../../hooks/useConfigApi'

const ConfigurationCard: React.FC = () => {
  const { getConfig, saveConfig } = useConfigApi()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [configStatus, setConfigStatus] = useState<ConfigStatus>('saved')
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [localConfig, setLocalConfig] = useState<AppConfig>({
    BASE_LOG_DIRECTORY: '',
    DREAMBOT_VIP_FEATURES: true,
    BOT_CONFIG: {
      WoodcutterBot: {
        webhookUrl: '',
        launchScript: ''
      }
    }
  })

  useEffect(() => {
    const loadConfig = async () => {
      const result = await getConfig()
      if (result) {
        setLocalConfig(result.config)
        setValidationErrors(result.errors)
        if (result.errors.length > 0) {
          setConfigStatus('error')
        } else {
          setConfigStatus('saved')
        }
      }
    }
    loadConfig()
  }, [getConfig])

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const handleLogsDirectoryChange = (value: string) => {
    setLocalConfig((prev) => ({ ...prev, BASE_LOG_DIRECTORY: value }))
    setConfigStatus('unsaved')
  }

  const handleWebhookUrlChange = (value: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      BOT_CONFIG: {
        ...prev.BOT_CONFIG,
        WoodcutterBot: {
          ...prev.BOT_CONFIG.WoodcutterBot,
          webhookUrl: value
        }
      }
    }))
    setConfigStatus('unsaved')
  }

  const handleVipFeaturesChange = (checked: boolean) => {
    setLocalConfig((prev) => ({ ...prev, DREAMBOT_VIP_FEATURES: checked }))
    setConfigStatus('unsaved')
  }

  const handleAddBot = () => {
    // TODO: Implement bot editing modal/form
    console.log('Add bot')
  }

  const handleEditBot = (botId: string) => {
    // TODO: Implement bot editing modal/form
    console.log('Edit bot:', botId)
  }

  const handleRemoveBot = (botId: string) => {
    // TODO: Implement bot editing modal/form
    console.log('Remove bot:', botId)
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

  return (
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
        label="General Chat Webhook URL:"
        value={localConfig.BOT_CONFIG.WoodcutterBot.webhookUrl}
        onChange={handleWebhookUrlChange}
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
              webhookConfigured: !!bot.webhookUrl,
              launchCliConfigured: !!bot.launchScript
            }}
            onEdit={handleEditBot}
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
  )
}

export default ConfigurationCard

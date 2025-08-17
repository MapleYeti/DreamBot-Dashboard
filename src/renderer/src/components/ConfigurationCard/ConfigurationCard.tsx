import React, { useState } from 'react'
import { ConfigInput, CheckboxField, BotConfigItem, ActionButtons, FooterNotes } from './components'
import { Card } from '../Card'
import { AppConfig } from '@shared/types/configTypes'
import styles from './ConfigurationCard.module.css'

const ConfigurationCard: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
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

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const handleLogsDirectoryChange = (value: string) => {
    setLocalConfig((prev) => ({ ...prev, BASE_LOG_DIRECTORY: value }))
  }

  const handleWebhookUrlChange = (value: string) => {
    setLocalConfig((prev) => ({ ...prev, webhookUrl: value }))
  }

  const handleVipFeaturesChange = (checked: boolean) => {
    setLocalConfig((prev) => ({ ...prev, DREAMBOT_VIP_FEATURES: checked }))
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

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving configuration:', localConfig)
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
          <button className={styles.savedButton}>
            <span className={styles.buttonIcon}>✓</span>
            Saved
          </button>
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

      <FooterNotes />
    </Card>
  )
}

export default ConfigurationCard

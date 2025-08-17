import React, { useState } from 'react'
import { ConfigInput, CheckboxField, BotConfigItem, ActionButtons, FooterNotes } from './components'
import './ConfigurationCard.css'
import { AppConfig } from '@shared/types/configTypes'

const ConfigurationCard: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [config, setConfig] = useState<AppConfig>({
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
    setConfig((prev) => ({ ...prev, BASE_LOG_DIRECTORY: value }))
  }

  const handleWebhookUrlChange = (value: string) => {
    setConfig((prev) => ({ ...prev, webhookUrl: value }))
  }

  const handleVipFeaturesChange = (checked: boolean) => {
    console.log('VIP features changed to:', checked)
    setConfig((prev) => ({ ...prev, DREAMBOT_VIP_FEATURES: checked }))
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
    console.log('Saving configuration:', config)
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
    <section className="dashboard-section">
      <div className="section-header" onClick={handleToggleCollapse}>
        <div className="section-title">
          <span className="section-icon">⚙️</span>
          <h2>Configuration</h2>
        </div>
        <div className="section-actions">
          <button className="saved-button">
            <span className="button-icon">✓</span>
            Saved
          </button>
          <button
            className={`dropdown-button ${isCollapsed ? 'collapsed' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              handleToggleCollapse()
            }}
          >
            {isCollapsed ? '▼' : '▲'}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="configuration-content">
          <ConfigInput
            label="DreamBot Logs Directory:"
            value={config.BASE_LOG_DIRECTORY}
            onChange={handleLogsDirectoryChange}
            showBrowseButton={true}
            onBrowseClick={handleBrowseLogs}
            placeholder="C:\Users\username\DreamBot\Logs"
          />

          <ConfigInput
            label="General Chat Webhook URL:"
            value={config.BOT_CONFIG.WoodcutterBot.webhookUrl}
            onChange={handleWebhookUrlChange}
            placeholder="https://discord.com/api/webhooks/..."
          />

          <CheckboxField
            label="DreamBot VIP Features"
            checked={config.DREAMBOT_VIP_FEATURES}
            onChange={handleVipFeaturesChange}
            description="Enable advanced features like CLI bot launching. Requires DreamBot VIP subscription."
          />

          <div className="bot-configurations">
            <h3>Bot Configurations</h3>
            {Object.entries(config.BOT_CONFIG).map(([botName, bot]) => (
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
            <button className="add-bot-button" onClick={handleAddBot}>
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
        </div>
      )}
    </section>
  )
}

export default ConfigurationCard

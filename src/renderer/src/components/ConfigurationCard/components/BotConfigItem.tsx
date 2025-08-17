import React from 'react'

interface BotConfigItemProps {
  bot: {
    id: string
    name: string
    webhookConfigured: boolean
    launchCliConfigured: boolean
  }
  onEdit: (botId: string) => void
  onRemove: (botId: string) => void
}

const BotConfigItem: React.FC<BotConfigItemProps> = ({ bot, onEdit, onRemove }) => {
  return (
    <div className="bot-config-item">
      <div className="bot-info">
        <div className="bot-name">{bot.name}</div>
        <div className="bot-status">
          <div className="status-item">
            <span className="status-icon">✓</span>
            <span className="status-text">Webhook Configured</span>
          </div>
          <div className="status-item">
            <span className="status-icon">✓</span>
            <span className="status-text">Launch CLI Configured</span>
          </div>
        </div>
      </div>
      <div className="bot-actions">
        <button className="edit-button" onClick={() => onEdit(bot.id)}>
          Edit
        </button>
        <button className="remove-button" onClick={() => onRemove(bot.id)}>
          Remove
        </button>
      </div>
    </div>
  )
}

export default BotConfigItem

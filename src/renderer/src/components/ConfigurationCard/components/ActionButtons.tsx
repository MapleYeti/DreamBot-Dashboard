import React from 'react'

interface ActionButtonsProps {
  onSave: () => void
  onUndo: () => void
  onImport: () => void
  onExport: () => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onSave, onUndo, onImport, onExport }) => {
  return (
    <div className="action-buttons">
      <button className="save-button" onClick={onSave}>
        Save Configuration
      </button>
      <button className="undo-button" onClick={onUndo}>
        Undo Changes
      </button>
      <button className="import-button" onClick={onImport}>
        Import Configuration
      </button>
      <button className="export-button" onClick={onExport}>
        Export Configuration
      </button>
    </div>
  )
}

export default ActionButtons

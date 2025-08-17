import React from 'react'
import styles from './ActionButtons.module.css'

interface ActionButtonsProps {
  onSave: () => void
  onUndo: () => void
  onImport: () => void
  onExport: () => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onSave, onUndo, onImport, onExport }) => {
  return (
    <div className={styles.actionButtons}>
      <button className={styles.saveButton} onClick={onSave}>
        Save
      </button>
      <button className={styles.undoButton} onClick={onUndo}>
        Undo
      </button>
      <button className={styles.importButton} onClick={onImport}>
        Import
      </button>
      <button className={styles.exportButton} onClick={onExport}>
        Export
      </button>
    </div>
  )
}

export default ActionButtons

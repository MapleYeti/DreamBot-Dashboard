import React from 'react'
import styles from './ActionButtons.module.css'

interface ActionButtonsProps {
  onSave: () => void
  onUndo: () => void
  onImport: () => void
  onExport: () => void
  formHasChanges: boolean
  disabled?: boolean
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSave,
  onUndo,
  onImport,
  onExport,
  formHasChanges,
  disabled = false
}) => {
  return (
    <div className={styles.actionButtons}>
      <button
        className={`${styles.saveButton} ${!formHasChanges ? styles.disabled : ''}`}
        onClick={onSave}
        disabled={!formHasChanges || disabled}
      >
        Save
      </button>
      <button
        className={`${styles.undoButton} ${!formHasChanges ? styles.disabled : ''}`}
        onClick={onUndo}
        disabled={!formHasChanges || disabled}
      >
        Undo
      </button>
      <button className={styles.importButton} onClick={onImport} disabled={disabled}>
        Import
      </button>
      <button className={styles.exportButton} onClick={onExport} disabled={disabled}>
        Export
      </button>
    </div>
  )
}

export default ActionButtons

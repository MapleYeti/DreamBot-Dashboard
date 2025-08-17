import React from 'react'
import styles from './ActionButtons.module.css'

interface ActionButtonsProps {
  onSave: () => void
  onUndo: () => void
  onImport: () => void
  onExport: () => void
  formHasChanges: boolean
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSave,
  onUndo,
  onImport,
  onExport,
  formHasChanges
}) => {
  return (
    <div className={styles.actionButtons}>
      <button
        className={`${styles.saveButton} ${!formHasChanges ? styles.disabled : ''}`}
        onClick={onSave}
        disabled={!formHasChanges}
      >
        Save
      </button>
      <button
        className={`${styles.undoButton} ${!formHasChanges ? styles.disabled : ''}`}
        onClick={onUndo}
        disabled={!formHasChanges}
      >
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

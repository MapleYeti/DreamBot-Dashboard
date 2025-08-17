import React from 'react'
import styles from './ConfigInput.module.css'

interface ConfigInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  showBrowseButton?: boolean
  onBrowseClick?: () => void
}

const ConfigInput: React.FC<ConfigInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  showBrowseButton = false,
  onBrowseClick
}) => {
  return (
    <div className={styles.configInputGroup}>
      <label className={styles.configLabel}>{label}</label>
      <div className={styles.inputRow}>
        <input
          type="text"
          className={styles.configInput}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {showBrowseButton && onBrowseClick && (
          <button className={styles.browseButton} onClick={onBrowseClick}>
            Browse
          </button>
        )}
      </div>
    </div>
  )
}

export default ConfigInput

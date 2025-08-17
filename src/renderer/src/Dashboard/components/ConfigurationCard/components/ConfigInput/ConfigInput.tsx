import React from 'react'
import styles from './ConfigInput.module.css'

interface ConfigInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  showBrowseButton?: boolean
  onBrowseClick?: () => void
  disabled?: boolean
}

const ConfigInput: React.FC<ConfigInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  showBrowseButton = false,
  onBrowseClick,
  disabled = false
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
          disabled={disabled}
        />
        {showBrowseButton && onBrowseClick && (
          <button className={styles.browseButton} onClick={onBrowseClick} disabled={disabled}>
            Browse
          </button>
        )}
      </div>
    </div>
  )
}

export default ConfigInput

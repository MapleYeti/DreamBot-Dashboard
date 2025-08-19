import React from 'react'
import styles from './ConfigInput.module.css'

interface ConfigInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

const ConfigInput: React.FC<ConfigInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  disabled = false
}) => {
  return (
    <div className={styles.configInputGroup}>
      <label className={styles.configLabel}>{label}</label>
      <input
        type="text"
        className={styles.configInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  )
}

export default ConfigInput

import React from 'react'
import styles from './CheckboxField.module.css'

interface CheckboxFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, checked, onChange, description }) => {
  return (
    <div className={styles.checkboxField}>
      <h3 className={styles.checkboxTitle}>{label}</h3>
      <div className={styles.checkboxRow}>
        <input
          type="checkbox"
          id="vip-features"
          className={styles.configCheckbox}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label htmlFor="vip-features" className={styles.checkboxLabel}>
          {description}
        </label>
      </div>
    </div>
  )
}

export default CheckboxField

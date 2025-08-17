import React from 'react'

interface CheckboxFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, checked, onChange, description }) => {
  return (
    <div className="checkbox-field">
      <h3 className="checkbox-title">{label}</h3>
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="vip-features"
          className="config-checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label htmlFor="vip-features" className="checkbox-label">
          {description}
        </label>
      </div>
    </div>
  )
}

export default CheckboxField

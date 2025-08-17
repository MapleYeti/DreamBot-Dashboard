import React from 'react'

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
  placeholder,
  showBrowseButton = false,
  onBrowseClick
}) => {
  return (
    <div className="config-input-group">
      <label className="config-label">{label}</label>
      <div className="input-row">
        <input
          type="text"
          className="config-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {showBrowseButton && (
          <button className="browse-button" onClick={onBrowseClick}>
            Browse
          </button>
        )}
      </div>
    </div>
  )
}

export default ConfigInput

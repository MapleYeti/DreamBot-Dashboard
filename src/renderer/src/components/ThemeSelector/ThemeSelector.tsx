import React from 'react'
import { useTheme } from '../../contexts/useTheme'
import type { ThemeMode } from '@shared/types/themeTypes'
import styles from './ThemeSelector.module.css'

const ThemeToggle: React.FC = () => {
  const { themeMode, setThemeMode } = useTheme()

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value as ThemeMode
    setThemeMode(selectedTheme)
  }

  return (
    <select
      className={styles.themeSelect}
      value={themeMode}
      onChange={handleThemeChange}
      title="Select Theme"
      aria-label="Select theme"
    >
      <option value="light">☀️ Light</option>
      <option value="dark">🌙 Dark</option>
      <option value="osrs">⚔️ OSRS</option>
    </select>
  )
}

export default ThemeToggle

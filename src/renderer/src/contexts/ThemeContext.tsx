import React, { useState, useEffect, ReactNode } from 'react'
import type { ThemeMode } from '@shared/types/themeTypes'
import { themes } from '@shared/themes'
import { ThemeContext, type ThemeContextValue } from './ThemeContextValue'
import { useAppConfig } from '../hooks/useAppConfig'

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { config, updateThemeMode } = useAppConfig()

  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    // Get theme from config if available, otherwise default to light
    if (config?.THEME_MODE) {
      return config.THEME_MODE
    }
    return 'light'
  })

  const theme = themes[themeMode]

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode)

    // Save to config service (which persists to file)
    try {
      await updateThemeMode(mode)
    } catch (error) {
      console.error('Failed to save theme mode to config:', error)
    }
  }

  // Update local state when config changes
  useEffect(() => {
    if (config?.THEME_MODE && config.THEME_MODE !== themeMode) {
      setThemeModeState(config.THEME_MODE)
    }
  }, [config?.THEME_MODE, themeMode])

  // Apply CSS custom properties when theme changes
  useEffect(() => {
    const root = document.documentElement
    const colors = theme.colors

    // Core colors
    root.style.setProperty('--color-primary', colors.primary)
    root.style.setProperty('--color-secondary', colors.secondary)
    root.style.setProperty('--color-accent', colors.accent)

    // Background colors
    root.style.setProperty('--bg-main', colors.background.main)
    root.style.setProperty('--bg-card', colors.background.card)
    root.style.setProperty('--bg-item', colors.background.item)
    root.style.setProperty('--bg-modal', colors.background.modal)
    root.style.setProperty('--bg-overlay', colors.background.overlay)
    root.style.setProperty('--bg-header', colors.background.header)
    root.style.setProperty('--bg-info', colors.background.info)
    root.style.setProperty('--bg-success', colors.background.success)
    root.style.setProperty('--bg-warning', colors.background.warning)
    root.style.setProperty('--bg-danger', colors.background.danger)

    // Text colors
    root.style.setProperty('--text-primary', colors.text.primary)
    root.style.setProperty('--text-secondary', colors.text.secondary)
    root.style.setProperty('--text-muted', colors.text.muted)
    root.style.setProperty('--text-inverse', colors.text.inverse)
    root.style.setProperty('--text-header', colors.text.header)
    root.style.setProperty('--text-item', colors.text.item)
    root.style.setProperty('--text-success', colors.text.success)
    root.style.setProperty('--text-danger', colors.text.danger)
    root.style.setProperty('--text-warning', colors.text.warning)
    root.style.setProperty('--text-info', colors.text.info)

    // Border colors
    root.style.setProperty('--border-main', colors.border.main)
    root.style.setProperty('--border-light', colors.border.light)
    root.style.setProperty('--border-focus', colors.border.focus)
    root.style.setProperty('--border-item', colors.border.item)
    root.style.setProperty('--border-success', colors.border.success)
    root.style.setProperty('--border-warning', colors.border.warning)
    root.style.setProperty('--border-danger', colors.border.danger)
    root.style.setProperty('--border-info', colors.border.info)

    // Status colors
    root.style.setProperty('--status-success', colors.status.success)
    root.style.setProperty('--status-danger', colors.status.danger)
    root.style.setProperty('--status-warning', colors.status.warning)
    root.style.setProperty('--status-info', colors.status.info)

    // Button colors (simplified)
    root.style.setProperty('--btn-primary-bg', colors.button.primary)
    root.style.setProperty('--btn-primary-bg-hover', colors.button.primaryHover)
    root.style.setProperty('--btn-primary-text', colors.button.primaryText)

    root.style.setProperty('--btn-secondary-bg', colors.button.secondary)
    root.style.setProperty('--btn-secondary-bg-hover', colors.button.secondaryHover)
    root.style.setProperty('--btn-secondary-text', colors.button.secondaryText)

    root.style.setProperty('--btn-success-bg', colors.button.success)
    root.style.setProperty('--btn-success-bg-hover', colors.button.successHover)
    root.style.setProperty('--btn-success-text', colors.button.successText)

    root.style.setProperty('--btn-danger-bg', colors.button.danger)
    root.style.setProperty('--btn-danger-bg-hover', colors.button.dangerHover)
    root.style.setProperty('--btn-danger-text', colors.button.dangerText)

    // Shadow colors
    root.style.setProperty('--shadow-small', colors.shadow.small)
    root.style.setProperty('--shadow-medium', colors.shadow.medium)
    root.style.setProperty('--shadow-large', colors.shadow.large)

    // Set theme mode attribute for any CSS that needs it
    root.setAttribute('data-theme', themeMode)
  }, [theme, themeMode])

  const value: ThemeContextValue = {
    theme,
    themeMode,
    setThemeMode
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

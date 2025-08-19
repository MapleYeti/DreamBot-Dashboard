export type ThemeMode = 'light' | 'dark' | 'osrs'

export interface ThemeColors {
  // Core colors
  primary: string
  secondary: string
  accent: string

  // Background colors
  background: {
    main: string
    card: string
    item: string
    modal: string
    header: string
    overlay: string
    info: string
    success: string
    warning: string
    danger: string
  }

  // Text colors
  text: {
    primary: string
    secondary: string
    muted: string
    inverse: string
    header: string
    item: string
    success: string
    danger: string
    warning: string
    info: string
  }

  // Border colors
  border: {
    main: string
    light: string
    focus: string
    item: string
    success: string
    warning: string
    danger: string
    info: string
  }

  // Status colors
  status: {
    success: string
    danger: string
    warning: string
    info: string
  }

  // Button colors (simplified)
  button: {
    primary: string
    primaryHover: string
    primaryText: string

    secondary: string
    secondaryHover: string
    secondaryText: string

    success: string
    successHover: string
    successText: string

    danger: string
    dangerHover: string
    dangerText: string
  }

  // Shadow colors
  shadow: {
    small: string
    medium: string
    large: string
  }
}

export interface Theme {
  mode: ThemeMode
  colors: ThemeColors
}

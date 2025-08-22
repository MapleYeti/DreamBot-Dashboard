import type { Theme } from '@shared/types/themeTypes'

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    // Core colors
    primary: 'hsl(220, 13%, 60%)',
    secondary: 'hsl(220, 13%, 40%)',
    accent: 'hsl(160, 84%, 39%)',

    // Background colors
    background: {
      main: 'hsl(220, 13%, 16%)',
      card: 'hsl(220, 13%, 22%)',
      item: 'hsl(220, 13%, 26%)',
      modal: 'hsl(220, 13%, 20%)',
      header: 'linear-gradient(135deg, hsl(220, 13%, 30%) 0%, hsl(220, 13%, 25%) 100%)',
      overlay: 'hsla(0, 0%, 0%, 0.7)',
      info: 'hsl(220, 13%, 26%)',
      success: 'hsl(160, 35%, 22%)',
      warning: 'hsl(25, 95%, 22%)',
      danger: 'hsl(0, 84%, 22%)'
    },

    // Text colors
    text: {
      primary: 'hsl(220, 13%, 95%)',
      secondary: 'hsl(220, 13%, 85%)',
      muted: 'hsl(220, 13%, 65%)',
      inverse: 'hsl(220, 13%, 12%)',
      header: 'hsl(0, 0%, 100%)',
      item: 'hsl(220, 13%, 65%)',
      success: 'hsl(160, 35%, 45%)',
      danger: 'hsl(0, 84%, 67%)',
      warning: 'hsl(48, 96%, 53%)',
      info: 'hsl(220, 13%, 65%)'
    },

    // Border colors
    border: {
      main: 'hsl(220, 13%, 35%)',
      light: 'hsl(220, 13%, 55%)',
      focus: 'hsl(220, 13%, 70%)',
      item: 'hsl(220, 13%, 45%)',
      success: 'hsl(160, 35%, 45%)',
      warning: 'hsl(25, 95%, 53%)',
      danger: 'hsl(0, 84%, 60%)',
      info: 'hsl(220, 13%, 45%)'
    },

    // Status colors
    status: {
      success: 'hsl(160, 35%, 40%)',
      danger: 'hsl(0, 84%, 60%)',
      warning: 'hsl(25, 57.50%, 50.20%)',
      info: 'hsl(220, 13%, 55%)'
    },

    // Button colors (simplified)
    button: {
      primary: 'hsl(270, 25%, 55%)',
      primaryHover: 'hsl(270, 25%, 65%)',
      primaryText: 'hsl(0, 0%, 100%)',

      secondary: 'hsl(220, 13%, 45%)',
      secondaryHover: 'hsl(220, 13%, 55%)',
      secondaryText: 'hsl(0, 0%, 100%)',

      success: 'hsl(160, 35%, 40%)',
      successHover: 'hsl(160, 35%, 45%)',
      successText: 'hsl(0, 0%, 100%)',

      danger: 'hsl(0, 84%, 59%)',
      dangerHover: 'hsl(0, 84%, 65%)',
      dangerText: 'hsl(0, 0%, 100%)'
    },

    // Shadow colors
    shadow: {
      small: 'hsla(0, 0%, 0%, 0.2)',
      medium: 'hsla(0, 0%, 0%, 0.3)',
      large: 'hsla(0, 0%, 0%, 0.4)'
    }
  }
}

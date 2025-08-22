import type { Theme } from '@shared/types/themeTypes'

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    // Core colors
    primary: 'hsl(226, 70%, 66%)',
    secondary: 'hsl(220, 13%, 46%)',
    accent: 'hsl(160, 84%, 39%)',

    // Background colors
    background: {
      main: 'hsl(0, 0%, 100%)',
      card: 'hsl(0, 0%, 100%)',
      item: 'hsl(0, 0.00%, 98.00%)',
      modal: 'hsl(0, 0%, 100%)',
      header: 'linear-gradient(135deg, hsl(226, 70%, 66%) 0%, hsl(271, 39%, 53%) 100%)',
      overlay: 'hsla(0, 0%, 0%, 0.5)',
      info: 'hsl(220, 69.20%, 97.50%)',
      success: 'hsl(138, 76%, 97%)',
      warning: 'hsl(48, 96%, 89%)',
      danger: 'hsl(0, 100%, 97%)'
    },

    // Text colors
    text: {
      primary: 'hsl(222, 47%, 11%)',
      secondary: 'hsl(215, 16%, 27%)',
      muted: 'hsl(220, 13%, 46%)',
      inverse: 'hsl(0, 0%, 100%)',
      header: 'hsl(0, 0%, 100%)',
      item: 'hsl(220, 13%, 46%)',
      info: 'hsl(201, 34.20%, 52.40%)',
      success: 'hsl(160, 84%, 39%)',
      danger: 'hsl(0, 84%, 60%)',
      warning: 'hsl(25, 95%, 53%)'
    },

    // Border colors
    border: {
      main: 'hsl(220, 13%, 91%)',
      light: 'hsl(220, 14%, 96%)',
      focus: 'hsl(226, 70%, 66%)',
      item: 'hsl(0, 0.00%, 83.90%)',
      success: 'hsl(160, 84%, 39%)',
      warning: 'hsl(51, 93.40%, 58.60%)',
      danger: 'hsl(0, 84%, 60%)',
      info: 'hsl(217, 100.00%, 87.60%)'
    },

    // Status colors
    status: {
      success: 'hsl(160, 84%, 39%)',
      danger: 'hsl(0, 84%, 60%)',
      warning: 'hsl(51, 93.40%, 58.60%)',
      info: 'hsl(217, 91%, 60%)'
    },

    // Button colors (simplified)
    button: {
      primary: 'hsl(226, 70%, 66%)',
      primaryHover: 'hsl(226, 70%, 60%)',
      primaryText: 'hsl(0, 0%, 100%)',

      secondary: 'hsl(220, 13%, 46%)',
      secondaryHover: 'hsl(220, 13%, 40%)',
      secondaryText: 'hsl(0, 0%, 100%)',

      success: 'hsl(160, 84%, 39%)',
      successHover: 'hsl(160, 84%, 33%)',
      successText: 'hsl(0, 0%, 100%)',

      danger: 'hsl(0, 84%, 60%)',
      dangerHover: 'hsl(0, 84%, 54%)',
      dangerText: 'hsl(0, 0%, 100%)'
    },

    // Shadow colors
    shadow: {
      small: 'hsla(0, 0%, 0%, 0.05)',
      medium: 'hsla(0, 0%, 0%, 0.1)',
      large: 'hsla(0, 0%, 0%, 0.15)'
    }
  }
}

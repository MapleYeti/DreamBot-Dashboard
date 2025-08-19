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
      warning: 'hsl(25, 95%, 53%)',
      danger: 'hsl(0, 84%, 60%)',
      info: 'hsl(217, 100.00%, 87.60%)'
    },

    // Status colors
    status: {
      success: 'hsl(160, 84%, 39%)',
      danger: 'hsl(0, 84%, 60%)',
      warning: 'hsl(25, 95%, 53%)',
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

export const osrsTheme: Theme = {
  mode: 'osrs',
  colors: {
    // Core colors
    primary: 'hsl(30, 17%, 32%)',
    secondary: 'hsl(25, 76%, 31%)',
    accent: 'hsl(43, 74%, 49%)',

    // Background colors
    background: {
      main: 'linear-gradient(135deg, hsl(38, 27.80%, 66.90%) 0%, hsl(39, 29%, 45%) 100%)',
      card: 'linear-gradient(135deg, hsl(42, 18.50%, 89.40%) 0%, hsl(43, 21%, 70%) 100%)',
      item: 'linear-gradient(135deg, hsl(25, 10%, 98%) 0%, hsl(25, 10%, 85%) 100%)',
      modal: 'hsl(39, 31.10%, 63%)',
      header: 'hsl(0, 22%, 26%)',
      overlay: 'hsla(0, 22%, 7%, 0.9)',
      info: 'hsl(33, 35.40%, 80.60%)',
      success: 'hsl(120, 29%, 88%)',
      warning: 'hsl(48, 100%, 88%)',
      danger: 'hsl(0, 100%, 88%)'
    },

    // Text colors
    text: {
      primary: 'hsl(0, 22%, 13%)',
      secondary: 'hsl(0, 22%, 22%)',
      muted: 'hsl(30, 17%, 32%)',
      inverse: 'hsl(43, 74%, 49%)',
      header: 'hsl(82, 50%, 47.1%)',
      item: 'hsl(30, 17%, 32%)',
      success: 'hsl(120, 61%, 34%)',
      danger: 'hsl(0, 100%, 27%)',
      warning: 'hsl(43, 74%, 49%)',
      info: 'hsl(35, 30%, 25%)'
    },

    // Border colors
    border: {
      main: 'hsl(20, 21.60%, 39.00%)',
      light: 'hsl(0, 22%, 22%)',
      focus: 'hsl(43, 74%, 49%)',
      item: 'hsl(20, 21.60%, 39.00%)',
      success: 'hsl(120, 61%, 34%)',
      warning: 'hsl(43, 74%, 49%)',
      danger: 'hsl(0, 100%, 27%)',
      info: 'hsl(25, 19.20%, 52.90%)'
    },

    // Status colors
    status: {
      success: 'hsl(120, 32.00%, 47.80%)',
      danger: 'hsl(0, 57.30%, 62.40%)',
      warning: 'hsl(43, 74%, 49%)',
      info: 'hsl(25, 45%, 40%)'
    },

    // Button colors
    button: {
      primary: 'hsl(30, 17%, 32%)',
      primaryHover: 'hsl(30, 17%, 36%)',
      primaryText: 'hsl(0, 0%, 100%)',

      secondary: 'hsl(25, 76%, 31%)',
      secondaryHover: 'hsl(25, 76%, 25%)',
      secondaryText: 'hsl(39, 29%, 88%)',

      success: 'hsl(30, 17%, 32%)',
      successHover: 'hsl(30, 17%, 36%)',
      successText: 'hsl(0, 0%, 100%)',

      danger: 'hsl(15, 70%, 35%)',
      dangerHover: 'hsl(15, 70%, 28%)',
      dangerText: 'hsl(0, 0%, 100%)'
    },

    // Shadow colors
    shadow: {
      small: 'hsla(0, 22%, 7%, 0.2)',
      medium: 'hsla(0, 22%, 7%, 0.3)',
      large: 'hsla(0, 22%, 7%, 0.4)'
    }
  }
}

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  osrs: osrsTheme
} as const

export const defaultTheme = lightTheme

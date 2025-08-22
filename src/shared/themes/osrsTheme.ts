import type { Theme } from '@shared/types/themeTypes'

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

import { lightTheme } from './lightTheme'
import { darkTheme } from './darkTheme'
import { osrsTheme } from './osrsTheme'

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  osrs: osrsTheme
} as const

export const defaultTheme = lightTheme

// Re-export individual themes for direct access
export { lightTheme, darkTheme, osrsTheme }

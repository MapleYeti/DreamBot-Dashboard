import { BrowserWindow, shell, screen } from 'electron'
import { join } from 'path'
import icon from '../../../resources/icon.png?asset'

export function createMainWindow(): BrowserWindow {
  // Get the primary display's work area (excludes taskbar/dock)
  const primaryDisplay = screen.getPrimaryDisplay()
  const { height: screenHeight } = primaryDisplay.workAreaSize

  // Calculate window dimensions (e.g., 80% of screen height, max 900px)
  const windowHeight = Math.min(Math.floor(screenHeight * 0.8), 850)
  const mainWindow = new BrowserWindow({
    width: 910,
    height: windowHeight,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  return mainWindow
}

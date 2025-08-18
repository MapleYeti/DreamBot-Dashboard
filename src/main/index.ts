import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { join } from 'path'
import { createMainWindow } from './windows'
import { registerAllIpcHandlers } from './ipc'
import { ConfigService } from './application'

let mainWindow: Electron.BrowserWindow | null = null

function createWindow(): void {
  mainWindow = createMainWindow()

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  console.log('App is ready, initializing configuration...')

  // Initialize app configuration using singleton instance
  const configService = ConfigService.getInstance()
  console.log('Created config service instance')

  try {
    await configService.loadConfig()
    console.log('App configuration loaded successfully')

    // Test getting the config to verify it's loaded
    const testConfig = await configService.getConfig()
    console.log('Test config retrieval successful:', testConfig)
  } catch (error) {
    console.error('Failed to load app configuration:', error)
  }

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  console.log('Registering IPC handlers...')
  registerAllIpcHandlers()
  console.log('IPC handlers registered')

  createWindow()
  console.log('Main window created')

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

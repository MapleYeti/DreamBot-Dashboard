import { spawn, type ChildProcess, exec } from 'child_process'
import { promisify } from 'util'
import { webContents } from 'electron'
import { configService } from '../configService'

interface BotProcess {
  process: ChildProcess
  pid: number
  startTime: Date
  command: string
}

export default class BotLaunchService {
  private botProcesses = new Map<string, BotProcess>()

  constructor() {
    // Constructor for singleton pattern
  }

  async launchBot(botName: string): Promise<{ success: boolean; message: string }> {
    try {
      if (this.botProcesses.has(botName)) {
        return { success: false, message: `Bot ${botName} is already running` }
      }

      const config = await configService.getConfig()
      const botConfig = config.BOT_CONFIG[botName]
      if (!botConfig || !botConfig.launchScript) {
        return { success: false, message: `No launch script configured for bot ${botName}` }
      }

      const commandArgs = this.parseCommandToArgs(botConfig.launchScript)
      const child = spawn('cmd.exe', ['/k', ...commandArgs], {
        detached: true,
        stdio: 'ignore' as const,
        windowsHide: false
      })

      const botProcess: BotProcess = {
        process: child,
        pid: child.pid!,
        startTime: new Date(),
        command: botConfig.launchScript
      }

      this.botProcesses.set(botName, botProcess)

      child.on('exit', (code) => {
        console.log(`Bot ${botName} process exited with code ${code}`)
        this.botProcesses.delete(botName)
        this.emitBotStatusUpdate()
      })

      child.on('error', (error) => {
        console.error(`Bot ${botName} process error:`, error)
        this.botProcesses.delete(botName)
        this.emitBotStatusUpdate()
      })

      console.log(`Launched bot ${botName} with PID ${child.pid}`)
      this.emitBotStatusUpdate()
      return {
        success: true,
        message: `Bot ${botName} launched successfully with PID ${child.pid}`
      }
    } catch (error) {
      console.error(`Failed to launch bot ${botName}:`, error)
      return {
        success: false,
        message: `Failed to launch bot ${botName}: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  async stopBot(botName: string): Promise<{ success: boolean; message: string }> {
    try {
      const botProcess = this.botProcesses.get(botName)
      if (!botProcess) {
        return { success: false, message: `Bot ${botName} is not running` }
      }

      const { process, pid } = botProcess

      // Kill the process tree on Windows
      if (process.pid) {
        try {
          // Use taskkill to kill the entire process tree on Windows
          const execAsync = promisify(exec)

          try {
            // Kill the entire process tree (PID and all child processes)
            await execAsync(`taskkill /F /T /PID ${process.pid}`)
            console.log(
              `Successfully killed process tree for bot ${botName} with PID ${process.pid}`
            )
          } catch (taskkillError) {
            console.warn(
              `taskkill failed for PID ${process.pid}, trying alternative method:`,
              taskkillError
            )

            // Fallback: try to kill the main process directly
            try {
              process.kill('SIGTERM')

              // Force kill after a short delay if SIGTERM doesn't work
              setTimeout(() => {
                if (this.botProcesses.has(botName)) {
                  try {
                    process.kill('SIGKILL')
                  } catch (killError) {
                    console.error(`Failed to force kill bot ${botName}:`, killError)
                  }
                }
              }, 2000)
            } catch (killError) {
              console.error(`Failed to kill process ${process.pid}:`, killError)
            }
          }

          // Verify the process was actually killed
          const isStillRunning = await this.isProcessRunning(process.pid)
          if (isStillRunning) {
            console.warn(`Process ${process.pid} is still running after kill attempt`)
          } else {
            console.log(`Process ${process.pid} successfully terminated`)
          }

          this.botProcesses.delete(botName)
          console.log(`Stopped bot ${botName} with PID ${pid}`)
          this.emitBotStatusUpdate()
          return { success: true, message: `Bot ${botName} stopped successfully` }
        } catch (killError) {
          console.error(`Failed to kill bot ${botName}:`, killError)
          return {
            success: false,
            message: `Failed to stop bot ${botName}: ${killError instanceof Error ? killError.message : 'Unknown error'}`
          }
        }
      } else {
        return { success: false, message: `Bot ${botName} has no valid PID` }
      }
    } catch (error) {
      console.error(`Failed to stop bot ${botName}:`, error)
      return {
        success: false,
        message: `Failed to stop bot ${botName}: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  getBotStatus(botName: string): {
    isRunning: boolean
    pid?: number
    startTime?: Date
    command?: string
  } {
    const botProcess = this.botProcesses.get(botName)
    if (!botProcess) {
      return { isRunning: false }
    }

    return {
      isRunning: true,
      pid: botProcess.pid,
      startTime: botProcess.startTime,
      command: botProcess.command
    }
  }

  getAllBotStatuses(): Record<
    string,
    { isRunning: boolean; pid?: number; startTime?: Date; command?: string }
  > {
    const statuses: Record<
      string,
      { isRunning: boolean; pid?: number; startTime?: Date; command?: string }
    > = {}

    for (const [botName, botProcess] of this.botProcesses) {
      statuses[botName] = {
        isRunning: true,
        pid: botProcess.pid,
        startTime: botProcess.startTime,
        command: botProcess.command
      }
    }

    return statuses
  }

  private parseCommandToArgs(command: string): string[] {
    const regex = /"([^"]*)"|(\S+)/g
    const args: string[] = []
    let match

    while ((match = regex.exec(command)) !== null) {
      const arg = match[1] || match[2]
      if (arg.trim()) {
        args.push(arg.trim())
      }
    }

    return args
  }

  private emitBotStatusUpdate() {
    const allStatuses = this.getAllBotStatuses()
    webContents.getAllWebContents().forEach((webContent) => {
      webContent.send('bot:status-update', allStatuses)
    })
  }

  private async isProcessRunning(pid: number): Promise<boolean> {
    try {
      const execAsync = promisify(exec)
      await execAsync(`tasklist /FI "PID eq ${pid}" /FO CSV`)
      return true
    } catch {
      return false
    }
  }
}

// Export a single instance (singleton)
const botLaunchService = new BotLaunchService()
export { botLaunchService }

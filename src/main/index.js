import { app, BrowserWindow, ipcMain, Menu, dialog } from 'electron'
import { join } from 'path'
import fs from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

let currentFile = null

function createWindow() {
  /**
   * Create the browser window.
   * @type {BrowserWindow}
   */
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    webPreferences: {
      /**
       * Preload script that has access to Node.js and Electron APIs.
       */
      preload: join(__dirname, '../preload/index.js'),
      /**
       * Enable Node.js integration.
       */
      nodeIntegration: true
      // contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  /**
   * Loads the renderer process either from a local file or from a dev server.
   */
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // const menu = Menu.buildFromTemplate([
  //   {
  //     label: 'File',
  //     submenu: [
  //       {
  //         label: 'New',
  //         click: () => {
  //           //resets the current file and sends a IPC message to the renderer process
  //           currentFile = null
  //           mainWindow.webContents.send('file-content', '')
  //         }
  //       },
  //       {
  //         label: 'Open',
  //         click: async () => {
  //           //shows a dialog to open a txt file
  //           const result = await dialog.showOpenDialog(mainWindow, {
  //             properties: ['openFile'],
  //             filters: [{ name: 'Text Files', extensions: ['txt'] }]
  //           })

  //           //ensures that a file is selected or not canceled and sent to the renderer
  //           if (!result.canceled && result.filePaths.length > 0) {
  //             const content = fs.readFileSync(result.filePaths[0], 'utf-8')

  //             currentFile = result.filePaths[0]

  //             mainWindow.webContents.send('file-content', content)
  //           }
  //         }
  //       },
  //       {
  //         label: 'Save',
  //         click: async () => {
  //           mainWindow.webContents.send('request-editor-content')
  //         }
  //       }
  //     ]
  //   }
  // ])

  // Menu.setApplicationMenu(menu)
  Menu.setApplicationMenu(null)

  /**
   * Listens for the `response-editor-content` event from the renderer process,
   *
   * If the `currentFile` variable is set, it means that the user has opened a file
   * before, so we write the content to the current file. Otherwise, we show a
   * save dialog to the user and write the content to the selected file.
   *
   * @param {Electron.IpcMainEvent} event The event object.
   * @param {string} content The content of the editor.
   */
  ipcMain.once('response-editor-content', async (event, content) => {
    if (currentFile) {
      //writes the content to the current file
      fs.writeFileSync(currentFile, content)
    } else {
      const result = await dialog.showSaveDialog(mainWindow, {
        filters: [{ name: 'Text Files', extensions: ['txt'] }]
      })

      if (!result.canceled && result.filePath) {
        fs.writeFileSync(result.filePath, content)

        currentFile = result.filePath
      }
    }
  })
}

/**
 * Creates the main window and configures the application.
 */
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  // Watches for window shortcuts and optimizes them.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Creates the main window.
  createWindow()

  // Creates a new window when the application is activated.
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

/**
 * Handles the 'window-all-closed' event by quitting the application if the
 * platform is not macOS.
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

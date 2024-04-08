import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import store from './config/electronStore';

let mainWindow: BrowserWindow | null = null;
// let settingWindow: BrowserWindow | null = null;
// let PreviewWindow: BrowserWindow | null = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'mainWindow.js'),
      // nodeIntegration: true,
      // contextIsolation: false
    },
  });
  console.log(__dirname)
  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
// import { SerialPort } from 'serialport';
// SerialPort.list().then(data => console.log(data))
ipcMain.on('main-window', async (event, data: string) => {
  console.log(data)
})


// electron-store
ipcMain.handle('electron-store:get', (event, key: string) => {
  return store.get(key)
});

ipcMain.on("ping", (_event, _args) => {
  console.log('ping')
  mainWindow?.webContents.send('pong', (_args))
})
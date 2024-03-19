const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
let settingWindow, mainWindow;
const Store = require('electron-store');

// const low = require('lowdb');
// const FileSync = require('lowdb/adapters/FileSync');
// const adapter = new FileSync('db.json'); // FileSync adapter, change to appropriate adapter if needed
// const db = low(adapter);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    width: 1024,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Initialize electron-store for renderer process
  Store.initRenderer();
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
ipcMain.on('settingWindow', function (e, args) {
  if (settingWindow && args == 'close') {
    settingWindow.close()
    return;
  }

  if (settingWindow) {
    settingWindow.focus(); //focus to new window
    return;
  }

  if (args == 'open') {
    settingWindow = new BrowserWindow({//1. create new Window
      width: 640,
      height: 480,
      minWidth: 640,
      minHeight: 480,
      parent: mainWindow,
      modal: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      settingWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL + '/setting.html');
    } else {
      settingWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/setting.html`));
    }

    settingWindow.once('ready-to-show', () => { //when the new window is ready, show it up
      settingWindow.show()
    })
  }

  settingWindow.on('closed', function () { //set new window to null when we're done
    mainWindow.webContents.send('mainWindow', 'update-config')
    settingWindow = null
  })
});

ipcMain.on('mainWindow', function (e, args) {
  dialog.showMessageBox(mainWindow, {
    'type': 'question',
    'title': 'Confirmation',
    'message': "Apakah Anda yakin ingin memulai rekaman? Data lama akan terhapus",
    'buttons': [
      'Yes',
      'No'
    ]
  }).then((result) => {
    if (result.response !== 0) return 

    if (result.response === 0) {
      mainWindow.webContents.send('mainWindow', 'record-confirm')
    }
})
})
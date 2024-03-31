const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');

import store from './config/electronStore.js'
import tempData from './model/tempdata.js';
import serialPort from './config/serialport.js';
import commonHelper from './helper/common.js';
import serialCommand from './helper/serialCommand.js';
import { ByteLengthParser } from 'serialport';
import mockTemp from './test/mockTemp.js';
import menu from './menu.js';

let settingWindow, mainWindow, port, writeIntervalId;
let count = 0;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
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

  Menu.setApplicationMenu(menu);

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  const initSerialDevice = async () => {
    port = await serialPort()
    if (!port) return setTimeout(initSerialDevice, 1500)
    const parser = port.pipe(new ByteLengthParser({
      length: 35
    }))

    port.on('error', commonHelper.handleError);

    // TODO: Device model number validation
    // Retry device search if model number is incorrect
    const test = () => {
      const intvId = setInterval(() => {
        if (count > 300) clearInterval(intvId)
        count++
        port.port.emitData(Buffer.from('000000' + mockTemp(count).join('').repeat(4) + '000000000000000000000000000000000000000000000000', 'hex'))
  
      }, 2000)

    }

    port.on('open', () => {
      console.log("Device connected")
      serialCommand.data.sendOnce(port)
      writeIntervalId = setInterval(() => {
        serialCommand.data.sendOnce(port)
      }, 1500)
    });

    port.on('close', () => {
      if (writeIntervalId) clearInterval()
      console.log("Device disconnected")
      initSerialDevice()
    })

    parser.on('data', async (byte) => {
      console.log(byte)
      const t1 = commonHelper.parseTemp(byte[3], byte[4])
      const t2 = commonHelper.parseTemp(byte[5], byte[6])
      const t3 = commonHelper.parseTemp(byte[7], byte[8])
      const t4 = commonHelper.parseTemp(byte[9], byte[10])
      const title = store.get('config.title')
      const subtitle = store.get('config.subtitle')
      const created_at = new Date().getTime()

      const data = { t1, t2, t3, t4, title, subtitle, created_at }
      await tempData.insertData(data)

      mainWindow.webContents.send('main-window', {
        ...data,
        command: 'update-temp-graph'
      })
    })
  }

  initSerialDevice()
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
ipcMain.handle("database", async (event, data) => {
  if (data.command === "fetch-all") return await tempData.fetchAllData()
  if (data.command === "insert") return await tempData.insertData(data)
  if (data.command === "soft-delete") return await tempData.softDeleteAllData(data)
  if (data.command === "hard-delete") return await tempData.hardDeleteAllData()
})

// handle opening and closing setting window
ipcMain.on('setting-window', (event, data) => {
  if (settingWindow && data == 'close') return settingWindow.close()
  if (settingWindow) return settingWindow.focus()

  if (data === 'open') {
    settingWindow = new BrowserWindow({
      width: 640,
      height: 480,
      minWidth: 640,
      minHeight: 480,
      parent: mainWindow,
      modal: true,
      show: false,
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

    settingWindow.once('ready-to-show', () => settingWindow.show())
  }

  settingWindow.on('closed', () => {
    mainWindow.webContents.send('main-window', {
      command: 'update-config'
    })
    settingWindow = null
  })
});

ipcMain.on('main-process', (event, data) => {

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
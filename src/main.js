const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');

import store from './config/electronStore.js'
import tempData from './model/tempdata.js';
import serialPort from './config/serialport.js';
// import serialPort from './config/serialmock.js';
import commonHelper from './helper/common.js';
import serialCommand from './helper/serialCommand.js';
import { ByteLengthParser } from 'serialport';

// Electron BrowserWindow
let mainWindow = null, settingWindow = null, printWindow = null;
// Other variables
let port = null, writeIntervalId = 0, isStopRecordManually = false, isRecording = false

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

  // Menu.setApplicationMenu(menu);
  Menu.setApplicationMenu(null);
  /* eslint-disable no-undef */
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
  /* eslint-enable no-undef */
  const initSerialDevice = async () => {
    port = await serialPort()
    if (!port) return setTimeout(initSerialDevice, 1500)
    const parser = port.pipe(new ByteLengthParser({
      length: 35
    }))

    port.on('error', commonHelper.handleError);

    // TODO: Device model number validation
    // Retry device search if model number is incorrect
    // const test = () => {
    //   const intvId = setInterval(() => {
    //     count++
    //     port.port.emitData(Buffer.from('000000' + mockTemp(count).join('').repeat(4) + '000000000000000000000000000000000000000000000000', 'hex'))
    //   }, 2000)
    // }

    port.on('open', () => {
      // test()
      console.log("Device connected")
      serialCommand.data.sendOnce(port)
      writeIntervalId = setInterval(() => {
        if (!port || !port.isOpen) {
          clearInterval(writeIntervalId)
          mainWindow.webContents.send('main-window', {
            t1: null, t2: null, t3: null, t4: null,
            command: 'update-temp-display'
          })
          isRecording = false
          mainWindow.webContents.send('main-window', {
            command: 'stop-record'
          })
        }
        serialCommand.data.sendOnce(port)
      }, 1500)
    });

    port.on('close', () => {
      if (writeIntervalId) clearInterval()
      console.log("Device disconnected")
      initSerialDevice()
      mainWindow.webContents.send('main-window', {
        t1: null, t2: null, t3: null, t4: null,
        command: 'update-temp-display'
      })
      isRecording = false
      mainWindow.webContents.send('main-window', {
        command: 'stop-record'
      })
    })

    parser.on('data', async (byte) => {
      const t1 = commonHelper.parseTemp(byte[3], byte[4])
      const t2 = commonHelper.parseTemp(byte[5], byte[6])
      const t3 = commonHelper.parseTemp(byte[7], byte[8])
      const t4 = commonHelper.parseTemp(byte[9], byte[10])
      const title = store.get('config.title')
      const subtitle = store.get('config.subtitle')

      const data = { t1, t2, t3, t4, title, subtitle }

      if (!mainWindow) return

      if (isRecording) {
        await tempData.insertData(data)
        const fetchDownsampledData = await tempData.fetchDownsampledData({recording_sessions_id:""})
        mainWindow.webContents.send('main-window', {
          result: fetchDownsampledData,
          command: 'update-temp-graph'
        })
      }

      mainWindow.webContents.send('main-window', {
        ...data,
        command: 'update-temp-display'
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
app.on('window-all-closed', async () => {
  if (isStopRecordManually) await tempData.softDeleteAllData()
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
  if (data.command === "fetch-downsampled") return await tempData.fetchDownsampledData({recording_sessions_id:''})
  if (data.command === "insert") return await tempData.insertData(data)
  if (data.command === "soft-delete") return await tempData.softDeleteAllData()
  if (data.command === "hard-delete") return await tempData.hardDeleteAllData()
})

const printOptions = {
  silent: false,
  printBackground: true,
  color: true,
  margin: {
    marginType: 'printableArea',
  },
  landscape: false,
  pagesPerSheet: 1,
  collate: false,
  copies: 1,
  header: 'Page header',
  footer: 'Page footer',
};

// handle opening and closing setting window
ipcMain.on('setting-window', (event, data) => {
  if (settingWindow && data.command == 'close') return settingWindow.close()
  if (settingWindow) return settingWindow.focus()

  if (data.command == 'open') {
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

    /* eslint-disable no-undef */
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      settingWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL + '/setting.html');
    } else {
      settingWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/setting.html`));
    }
    /* eslint-enable no-undef */
    settingWindow.once('ready-to-show', () => settingWindow.show())
  }

  settingWindow.on('closed', () => {
    mainWindow.webContents.send('main-window', {
      command: 'update-config'
    })
    settingWindow = null
  })
});

ipcMain.on('main-window', async (event, data) => {
  try {
    if (data.command == 'start-record' && data.isDataExists) {
      const userResponse = await dialog.showMessageBox(mainWindow, {
        'type': 'question',
        'title': 'Confirmation',
        'message': "Apakah Anda yakin ingin memulai rekaman?",
        'buttons': [
          'Hapus data dan mulai rekaman',
          'Lanjut merekam data',
          'Tidak'
        ]
      })
      console.log(userResponse)
      if (userResponse.response === 2) return

      if (userResponse.response === 0) {
        const softDelete = await tempData.softDeleteAllData()
        mainWindow.webContents.send('main-window', { command: 'record-confirm' })
        isRecording = true
        console.log("soft delete : " + softDelete)
      }

      if (userResponse.response === 1) {
        mainWindow.webContents.send('main-window', { command: 'record-confirm' })
        isRecording = true
        console.log("soft delete : " + false)
      }
    } else if (data.command == 'start-record' && !data.isDataExists) {
      mainWindow.webContents.send('main-window', { command: 'record-confirm' })
      isRecording = true
      console.log("is record")
    }
  } catch (error) {
    console.log(error)
  }

  // Flagging if user stopped recording manually
  // Indicates recording process is successful
  if (data.command == 'stop-record' && data.isStopRecordManually) {
    isStopRecordManually = data.isStopRecordManually
    isRecording = false
  }
})

ipcMain.on('print-window', async (event, data) => {
  if (printWindow && data.command == 'close') return printWindow.close()
  if (printWindow) return printWindow.focus()

  if (data.command == 'open') {
    console.log('ef')
    printWindow = new BrowserWindow({
      width: 800,
      height: 600,
    });
    /* eslint-disable no-undef */
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      printWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL + '/pdf.html');
    } else {
      printWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/pdf.html`));
    }
    /* eslint-enable no-undef */
    printWindow.webContents.once("did-finish-load", () => {
      console.log("ey")
      // printWindow.webContents.print(printOptions, (success, failureReason) => {
      //   console.log("Print Initiated in Main...");
      //   if (!success) console.log(failureReason);
      // })
      //   printWindow.webContents.printToPDF({}).then(data => {
      //     const url = "data:application/pdf;base64," + Buffer.from(data).toString('base64')
      //     console.log(url)
      //     printWindow.loadURL(url)
      //     //   printWindow.webContents.on("ready-to-show", () => {
      //     //     printWindow.once("page-title-updated", (e) => e.preventDefault());
      //     //     printWindow.show();
      //     //   });

      //     //   printWindow.webContents.on("closed", () => printWindow = null);
      //     //   printWindow.loadURL(url);
      //     // })

      //   }).catch((error) => {
      //     console.log(error);
      //   })
    })
  }
  printWindow.on("closed", () => printWindow = null)
});
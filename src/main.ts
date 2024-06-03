import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import { ByteLengthParser, SerialPort } from 'serialport';
import { MockBindingInterface } from '@serialport/binding-mock';
import { SerialPortStream } from '@serialport/stream';
import dotenv from 'dotenv';
import path from 'path';

import recordingSessions from './model/recordingSessions';
import { graphSettingForm } from './types/settingWindow';
import serialCommand from './helper/serialCommand';
import commonHelper from './helper/commonHelper';
import fileSaver from './helper/fileSaver';
import customMenuTemplate from './config/menu';
import serialport from './config/serialport';
import serialmock from './config/serialmock';
import store from './config/electronStore';
import { Temps } from './types/mainWindow';
import mockTemp from './helper/mockTemp';
import tempData from './model/tempData';
import db from './config/sqlite';
import { PrintPreviewConfing } from './types/printPreviewWindow';
import { SaveFileArgs } from './types/main';
import format from './helper/format';

dotenv.config()

let mainWindow: BrowserWindow | null = null;
let settingWindow: BrowserWindow | null = null;
let printPreviewWindow: BrowserWindow | null = null;
let port: SerialPort | SerialPortStream<MockBindingInterface> | null = null;
const isMockPort: boolean = !!process.env.SERIALMOCK
let count: number = 0;

if (require('electron-squirrel-startup')) app.quit();

Menu.setApplicationMenu(null);

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    width: 1024,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'main.preload.js'),
    },
  });

  console.log(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  mainWindow.setMenu(Menu.buildFromTemplate(customMenuTemplate()))
};

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') return

  // Cleanup
  if (store.get('state').isStopRecordingManually) {
    tempData.softDeleteAllData()
    recordingSessions.softDeleteAllData()
  }

  db.close(commonHelper.handleError("Error closing database", "Successfully closed database"))

  port?.close()
  store.reset('state')
  store.reset('devicePath')
  ipcMain.removeAllListeners('main-window:console-log')
  ipcMain.removeAllListeners('main-window:start-record')
  ipcMain.removeAllListeners('main-window:stop-record')
  ipcMain.removeAllListeners('setting-window:console-log')
  ipcMain.removeAllListeners('setting-window:manage')
  ipcMain.removeAllListeners('electron-store:set')
  ipcMain.removeHandler('electron-store:get')

  app.quit();
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// Handle serial device auto reconnect and communication
const initSerialDevice = async (isMockPort: boolean): Promise<void> => {
  port?.close()

  port = isMockPort ? await serialmock() : await serialport()

  if (port === null) {
    !port && setTimeout(initSerialDevice, 1500)
    return
  }

  let writeIntvId: NodeJS.Timeout | undefined;
  const parser = port.pipe(new ByteLengthParser({
    length: 35
  }));

  port.on('error', (error) => { throw error });

  port.on('open', () => {
    console.log('Device connected');
    if (isMockPort) {
      writeIntvId = setInterval(() => {
        (port as SerialPortStream<MockBindingInterface>).port?.emitData(
          Buffer.from('000000' + mockTemp(count).join('').repeat(4) + '000000000000000000000000000000000000000000000000', 'hex')
        )
        count++
      }, 10000)
    } else {
      port && serialCommand.data.sendOnce(port as SerialPort);
      writeIntvId = setInterval(() => port && serialCommand.data.sendOnce(port as SerialPort), 1500)
    }
  })

  port.on('close', () => {
    console.log('Device disconnected')
    store.set('state.devicePath', '')
    clearInterval(writeIntvId)
    const defaultTemps: Temps = {
      t1: undefined,
      t2: undefined,
      t3: undefined,
      t4: undefined
    }
    mainWindow?.webContents.send('main-window:update-temp-display', defaultTemps)
    mainWindow?.webContents.send('main-window:stop-record-callback')
    store.set('state.isRecording', false)
    store.set('state.recordingSessionID', 0)
    initSerialDevice(isMockPort)
  });

  parser.on('data', async (chunks: number[]) => {
    const parsedTemp: Temps<number | undefined> = {
      t1: commonHelper.parseTemp(chunks[3], chunks[4]),
      t2: commonHelper.parseTemp(chunks[5], chunks[6]),
      t3: commonHelper.parseTemp(chunks[7], chunks[8]),
      t4: commonHelper.parseTemp(chunks[9], chunks[10]),
    }

    mainWindow?.webContents.send('main-window:update-temp-display', parsedTemp)

    try {
      const recordingSessionID = store.get('state').recordingSessionID
      if (!store.get('state').isRecording || !recordingSessionID) return

      await tempData.insertData({
        recording_sessions_id: recordingSessionID,
        ...parsedTemp
      })

      const fetchGraphData = await tempData.selectBySampleSize(recordingSessionID, 100);
      // console.log(fetchGraphData)
      mainWindow?.webContents.send('main-window:update-graph', fetchGraphData);
    } catch (error) {
      console.error(error)
    }
  })
}

app.on('ready', () => {
  // console.log(store.get('state'))
  createMainWindow()
  initSerialDevice(isMockPort)
});

// -------------------- Ipc communications --------------------
ipcMain.handle('electron-store:get', (_event, key: string) => store.get(key))
ipcMain.on('electron-store:set', (_event, { key, value }) => store.set(key, value))
store.onDidChange('devicePath', (newValue) => {
  mainWindow?.webContents.send('main-window:update-status-bar', {
    devicePath: newValue
  })
})

ipcMain.on("main-window:start-record", async (event, isDataExists: boolean) => {
  let userResponse: number | undefined
  const currentWindow = BrowserWindow.fromWebContents(event.sender)
  if (!currentWindow) return

  if (isDataExists) {
    const messageBox = await dialog.showMessageBox(currentWindow, {
      type: 'question',
      title: 'Confirmation',
      message: "Apakah Anda yakin ingin memulai rekaman?",
      buttons: [
        'Hapus data dan mulai rekaman',
        'Lanjut merekam data',
        'Tidak'
      ],
      cancelId: 2,
      defaultId: 1
    })
    userResponse = messageBox.response
  }

  if (userResponse === 2) return
  if (userResponse === 0) await tempData.softDeleteAllData()

  if (userResponse === 0 || userResponse === 1 || !isDataExists) {
    event.reply('main-window:start-record-callback', userResponse === 1)
    store.set('state.isRecording', true)

    if (userResponse === 0 || !isDataExists) {
      await recordingSessions.insertData({
        graph_title: store.get('config').title,
        graph_subtitle: store.get('config').subtitle
      })
    }

    const result = await recordingSessions.fetchLastData();
    console.log(result)

    store.set('state.recordingSessionID', result?.id ?? 0)
    console.log('recording session ' + store.get('state').recordingSessionID)
  }
});

ipcMain.on("main-window:stop-record", async () => {
  store.set('state', {
    isStoppedRecordingManually: true,
    isRecording: false,
    recordingSessionID: 0
  })
});

ipcMain.on('setting-window:manage', (_event, args) => {
  if (settingWindow !== null && args === 'close') {
    mainWindow?.webContents.send('main-window:update-config', store.get('config'))
    return settingWindow.close()
  }

  if (args === 'open') {
    if (settingWindow) return settingWindow.focus()
    settingWindow = new BrowserWindow({
      width: 640,
      height: 480,
      minWidth: 640,
      minHeight: 480,
      parent: mainWindow ?? undefined,
      modal: true,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'setting.preload.js'),
      },
    });

    settingWindow.setMenu(null)
    if (SETTING_WINDOW_VITE_DEV_SERVER_URL) {
      settingWindow.loadURL(SETTING_WINDOW_VITE_DEV_SERVER_URL);
      settingWindow.webContents.openDevTools();
    } else {
      settingWindow.loadFile(path.join(__dirname, `../renderer/${SETTING_WINDOW_VITE_NAME}/index.html`));
    }

    settingWindow.once('ready-to-show', () => settingWindow?.show())

    settingWindow.on('closed', () => {
      settingWindow = null
    })
  }
})



ipcMain.on('setting-window:update-config', (_event, newConfigData: graphSettingForm) => {
  store.set('config', newConfigData)
  mainWindow?.webContents.send('main-window:update-config', store.get('config'))
})

ipcMain.on('print-preview-window:update-config', (_event, newConfigData: PrintPreviewConfing) => {
  store.set('printPreview', newConfigData)
})

const createPrintPreviewWindow = () => {
  if (printPreviewWindow) return printPreviewWindow.focus()

  printPreviewWindow = new BrowserWindow({
    width: 650,
    height: 700,
    minWidth: 635,
    minHeight: 594,
    parent: mainWindow ?? undefined,
    modal: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'printPreview.preload.js'),
    },
  })

  if (PRINT_PREVIEW_WINDOW_VITE_DEV_SERVER_URL) {
    printPreviewWindow.loadURL(PRINT_PREVIEW_WINDOW_VITE_DEV_SERVER_URL);
    printPreviewWindow.webContents.openDevTools();
  } else {
    printPreviewWindow.loadFile(path.join(__dirname, `../renderer/${PRINT_PREVIEW_WINDOW_VITE_NAME}/index.html`));
  }

  printPreviewWindow.on('closed', () => {
    printPreviewWindow = null
  })
}

ipcMain.on('print-preview-window:manage', (_event, { args }) => {
  if (printPreviewWindow !== null && args === 'close') {
    return printPreviewWindow.close()
  }

  if (args === 'open') {
    createPrintPreviewWindow()
    printPreviewWindow?.once('ready-to-show', () => printPreviewWindow?.show())
  }

  if (args === "print") {
    printPreviewWindow?.webContents.print({
      pageSize: 'A4'
    }, (_success, failure) => {
      if (failure) console.error(failure)
    })
  }
})

ipcMain.handle('print-preview-window:get-temp-data', async (_event, { recordingSessionID, intervalSeconds }) => {
  try {
    const results = await tempData.selectByTimeInterval(recordingSessionID, intervalSeconds)
    return results
  } catch (error) {
    console.error(error)
  }
})

// TODO: Handle startTimestamp endTimestamp
ipcMain.on('main-process:save-file', async (event, args: SaveFileArgs) => {
  try {
    const currentWindow = BrowserWindow.fromWebContents(event.sender)
    if (!currentWindow) return

    const { startTimestamp, endTimestamp, prefferedType, image } = args
    const validFileExtensions = [".pdf", ".xlsx", ".png"]
    
    let defaultFileName = "KLIN DRY"
    if (startTimestamp) defaultFileName += " " + format.fileDate(startTimestamp, endTimestamp).toUpperCase()
    defaultFileName += prefferedType ? "." + prefferedType : ".pdf"

    const fileFilter = [
      { name: "PDF (*.pdf)", extensions: ["pdf"] },
      { name: "Excel 2007 - 365 (*.xlsx)", extensions: ["xlsx"] },
      { name: "Gambar Grafik (*.png)", extensions: ["png"] },
    ]

    const saveDialog = await dialog.showSaveDialog(currentWindow, {
      title: "Simpan Data Grafik",
      defaultPath: path.join(app.getPath("documents"), defaultFileName),
      filters: prefferedType ? fileFilter.filter((value) => value.extensions[0] === prefferedType) : fileFilter
    })

    if (saveDialog.canceled || !saveDialog.filePath) return
    const fileExtension = path.extname(saveDialog.filePath)

    if (!fileExtension || !validFileExtensions.includes(fileExtension))
      return dialog.showErrorBox("Tipe file tidak valid", `Tipe file ${fileExtension ? "*" + fileExtension + " tidak valid" : "tidak ditemukan"}, mohon simpan file dengan tipe yang didukung (${validFileExtensions.join(", ")})`)

    switch (fileExtension) {
      case ".pdf":
        if (!printPreviewWindow) createPrintPreviewWindow()
        fileSaver.saveAsPDF(printPreviewWindow, saveDialog.filePath)
        break
      case ".xlsx":
        fileSaver.saveAsExcel(saveDialog.filePath)
        break
      case ".png":
        fileSaver.saveAsImage(mainWindow, saveDialog.filePath, image)
        break
    }
  } catch (error) {
    printPreviewWindow?.close()
    console.error(error)
  }
})
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import store from './config/electronStore';
import tempData from './model/tempData';
import commonHelper from './helper/commonHelper';
import serialport from './config/serialport';
import { ByteLengthParser } from 'serialport';
import serialCommand from './helper/serialCommand';
import { Temps } from './types/mainWindow';
import recordingSessions from './model/recordingSessions';

let mainWindow: BrowserWindow | null = null;
// let settingWindow: BrowserWindow | null = null;
let isRecording = false;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let isStopRecordManually = false
let recordingSessionsId: number | undefined;

// let PreviewWindow: BrowserWindow | null = null;

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
      preload: path.join(__dirname, 'main.preload.js'),
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
};



// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    if(isStopRecordManually) {
      await tempData.softDeleteAllData()
      await recordingSessions.softDeleteAllData() 
    }
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

// Handle serial device auto reconnect and communication
const initSerialDevice = async (): Promise<void> => {
  const port = await serialport()
  if (!port) {
    setTimeout(initSerialDevice, 1500)
    return
  }

  let writeIntvId: NodeJS.Timeout | undefined;
  const parser = port.pipe(new ByteLengthParser({
    length: 35
  }));

  port.on('error', commonHelper.handleError);


  port.on('open', () => {
    console.log('Device connected');
    serialCommand.data.sendOnce(port);
    writeIntvId = setInterval(() => serialCommand.data.sendOnce(port), 1500)
  })

  port.on('close', () => {
    console.log('Device disconnected')
    clearInterval(writeIntvId)
    const defaultTemps: Temps = {
      t1: null,
      t2: null,
      t3: null,
      t4: null
    }
    mainWindow?.webContents.send('main-window:update-temp-display', defaultTemps)
    mainWindow?.webContents.send('main-window:stop-record-callback')
    isRecording = false
    recordingSessionsId = undefined
    initSerialDevice()
  });

  parser.on('data', async (chunks: number[]) => {
    if (!isRecording || recordingSessionsId === undefined) return

    const parsedTemp: Temps<number | undefined> = {
      t1: commonHelper.parseTemp(chunks[3], chunks[4]),
      t2: commonHelper.parseTemp(chunks[5], chunks[6]),
      t3: commonHelper.parseTemp(chunks[7], chunks[8]),
      t4: commonHelper.parseTemp(chunks[9], chunks[10]),
    }
    await tempData.insertData({
      recording_sessions_id: recordingSessionsId,
      ...parsedTemp
    })
    const fetchGraphData = await tempData.fetchDownsampledData(recordingSessionsId);
    mainWindow?.webContents.send('main-window:update-graph', fetchGraphData);
    mainWindow?.webContents.send('main-window:update-temp-display', parsedTemp)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  initSerialDevice()
});

ipcMain.on('main-window', async (event, data: string) => {
  console.log(data)
})

// electron-store
ipcMain.handle('electron-store:get', (event, key: string) => {
  return store.get(key)
});

// debug
ipcMain.on("ping", (_event, _args) => {
  console.log('ping')
  mainWindow?.webContents.send('pong', (_args))
});

// startRecord: (isDataExists) => ipcRenderer.send("main-window:start-record", isDataExists),
// stopRecord: (isStoppedManually) => ipcRenderer.send("main-window:stop-record", isStoppedManually),
// manageSettingWindow: (manage) => ipcRenderer.send("setting-window:manage", manage),
// managePrintWindow: (manage) => ipcRenderer.send("print-window:manage", manage),

ipcMain.on("main-window:start-record", async (_event, isDataExists: boolean) => {
  try {
    if (mainWindow === null) return
    if (isDataExists) {
      mainWindow.webContents.send('main-window:start-record-callback')
      isRecording = true
      return
    }

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

    if (userResponse.response === 2) return
    if (userResponse.response === 0) {
      await tempData.softDeleteAllData()
    }
    if (userResponse.response === 1 || userResponse.response === 0) {
      mainWindow.webContents.send('main-window:start-record-callback')
      isRecording = true
      await recordingSessions.insertData({
        graph_title: store.get('config.title'),
        graph_subtitle: store.get('config.subtitle')
      })
      const result = await recordingSessions.fetchLastData();
      recordingSessionsId = result?.id
    }
  } catch (error) {
    commonHelper.handleError(error)
  }
});

ipcMain.on("main-window:stop-record", async (_event, isStoppedManually: boolean) => {
  isStopRecordManually = isStoppedManually
  isRecording = false
  recordingSessionsId = undefined
});
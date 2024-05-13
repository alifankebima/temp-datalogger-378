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
import customMenuTemplate from './config/menu';
import serialport from './config/serialport';
import serialmock from './config/serialmock';
import store from './config/electronStore';
import { Temps } from './types/mainWindow';
import mockTemp from './helper/mockTemp';
import tempData from './model/tempData';

dotenv.config()

let mainWindow: BrowserWindow | null = null;
let settingWindow: BrowserWindow | null = null;
let port: SerialPort | SerialPortStream<MockBindingInterface> | null = null;
const isMockPort: boolean = !!process.env.SERIALMOCK
let count: number = 0;

if (require('electron-squirrel-startup')) app.quit();

Menu.setApplicationMenu(Menu.buildFromTemplate(customMenuTemplate()));

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

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
};

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async () => {
  if (process.platform === 'darwin') return

  // Cleanup
  if (store.get('store.isStopRecordManually')) {
    await tempData.softDeleteAllData()
    await recordingSessions.softDeleteAllData()
  }

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

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

  port.on('error', commonHelper.handleError);

  port.on('open', () => {
    console.log('Device connected');
    if (isMockPort) {
      writeIntvId = setInterval(() => {
        (port as SerialPortStream<MockBindingInterface>).port?.emitData(
          Buffer.from('000000' + mockTemp(count).join('').repeat(4) + '000000000000000000000000000000000000000000000000', 'hex')
        )
        console.log(count)
        count++
      }, 2000)
    } else {
      port && serialCommand.data.sendOnce(port as SerialPort);
      writeIntvId = setInterval(() => port && serialCommand.data.sendOnce(port as SerialPort), 1500)
    }
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
    store.set('state.isRecording', false)
    store.set('state.recordingSessionID', 0)
    initSerialDevice(isMockPort)
  });

  parser.on('data', async (chunks: number[]) => {
    console.log(chunks)

    const parsedTemp: Temps<number | undefined> = {
      t1: commonHelper.parseTemp(chunks[3], chunks[4]),
      t2: commonHelper.parseTemp(chunks[5], chunks[6]),
      t3: commonHelper.parseTemp(chunks[7], chunks[8]),
      t4: commonHelper.parseTemp(chunks[9], chunks[10]),
    }

    mainWindow?.webContents.send('main-window:update-temp-display', parsedTemp)

    if (!store.get('state.isRecording') || store.get('state.recordingSessionID')) return
    await tempData.insertData({
      recording_sessions_id: store.get('state.recordingSessionID'),
      ...parsedTemp
    })
    const fetchGraphData = await tempData.fetchDownsampledData(store.get('state.recordingSessionID'));
    mainWindow?.webContents.send('main-window:update-graph', fetchGraphData);
  })
}

app.on('ready', () => {
  console.log(store.get('config'))
  createMainWindow()
  initSerialDevice(isMockPort)
});

// -------------------- Ipc communications --------------------
ipcMain.on('main-window:console-log', async (_event, data: unknown) => console.log(data))
ipcMain.on('setting-window:console-log', async (_event, data: unknown) => console.log(data))

ipcMain.handle('electron-store:get', (_event, key: string) => store.get(key))
ipcMain.on('electron-store:set', (_event, { key, value }) => store.set(key, value))

ipcMain.on("main-window:start-record", async (_event, isDataExists: boolean) => {
  try {
    if (mainWindow === null) return
    if (!isDataExists) {
      mainWindow.webContents.send('main-window:start-record-callback')
      store.set('state.isRecording', true)
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
      store.set('state.isRecording', true)
      await recordingSessions.insertData({
        graph_title: store.get('config.title'),
        graph_subtitle: store.get('config.subtitle')
      })
      const result = await recordingSessions.fetchLastData();
      store.set('state.recordingSessionID', result?.id ?? 0)
    }
  } catch (error) {
    commonHelper.handleError(error)
  }
});

ipcMain.on("main-window:stop-record", async (_event, isStoppedManually: boolean) => {
  store.set('state.isStopRecordingManually', isStoppedManually)
  store.set('state.isRecording', false)
  store.set('state.recordingSessionID', 0)
});

ipcMain.on('setting-window:manage', (_event, args) => {
  if (settingWindow !== null && args == 'close') {
    mainWindow?.webContents.send('main-window:update-config', store.get('config'))
    return settingWindow.close()
  }

  if (settingWindow) return settingWindow.focus()

  if (args === 'open') {
    settingWindow = new BrowserWindow({
      width: 640,
      height: 480,
      minWidth: 640,
      minHeight: 480,
      parent: mainWindow !== null ? mainWindow : undefined,
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

    settingWindow.once('ready-to-show', () => settingWindow && settingWindow.show())

    settingWindow.on('closed', () => {
      settingWindow = null
    })
  }
})

ipcMain.on('setting-window:update-config', (_event, newConfigData: graphSettingForm) => {
  store.set('config.title', newConfigData.title)
  store.set('config.subtitle', newConfigData.subtitle)
  mainWindow?.webContents.send('main-window:update-config', store.get('config'))
})
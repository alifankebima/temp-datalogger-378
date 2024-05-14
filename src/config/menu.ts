import { MenuItemConstructorOptions } from 'electron';
import recordingSessions from '../model/recordingSessions';
import tempData from '../model/tempData';

const customMenuTemplate = (): MenuItemConstructorOptions[] => {
  return [
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        { label: 'Buka file...' },
        { label: 'Simpan' },
        { label: 'Simpan sebagai...' },
        { label: 'Ekspor...' },
        { label: 'Keluar' },
      ]
    },
    {
      label: 'Debug',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        {
          label: 'Hapus data grafik',
          click: (_menuItem, BrowserWindow) => {
            try {
              tempData.softDeleteAllData()
              recordingSessions.softDeleteAllData()
              BrowserWindow?.webContents.send('main-window:update-graph', [])
            } catch (error) {
              console.error(error)
            }
          }
        },
        {
          label: 'Hapus database',
          click: (_menuItem, BrowserWindow) => {
            try {
              tempData.hardDeleteAllData()
              recordingSessions.hardDeleteAllData()
              BrowserWindow?.webContents.send('main-window:update-graph', [])
            } catch (error) {
              console.error(error)
            }
          }
        }
      ]
    }
  ]
}

export default customMenuTemplate
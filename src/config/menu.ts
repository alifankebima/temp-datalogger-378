import { MenuItemConstructorOptions } from 'electron';
import store from './electronStore';

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
          label: 'Start Mock Serialport',
          click: () => store.set('serialportMock', true),
          enabled: !store.get('serialportMock')
        },
        {
          label: 'Stop Mock Serialport',
          click: () => store.set('serialportMock', false),
          enabled: store.get('serialportMock')
        }
      ]
    }
  ]
}

export default customMenuTemplate
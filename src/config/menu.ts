import { MenuItemConstructorOptions } from 'electron';

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
      ]
    }
  ]
}

export default customMenuTemplate
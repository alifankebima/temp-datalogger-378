const { app, Menu } = require('electron');

const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Debug',
      submenu: [
        { role: 'forceReload' },
        { role: 'toggledevtools' }
      ]
    },
  ];

const menu = Menu.buildFromTemplate(menuTemplate);

export default menu;
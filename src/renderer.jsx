/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './window/Main.jsx'
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Main />
)
// const { SerialPort } = require('serialport')
// const tableify = require('tableify')

// async function listSerialPorts() {
//   await SerialPort.list().then((ports, err) => {
//     if(err) {
//       // document.getElementById('error').textContent = err.message
//       return
//     } else {
//       // document.getElementById('error').textContent = ''
//     }
//     console.log('ports', ports);

//     if (ports.length === 0) {
//       // document.getElementById('error').textContent = 'No ports discovered'
//     }

//     // document.getElementById('ports').innerHTML = tableify(ports)
//   })
// }

// function listPorts() {
//   listSerialPorts();
//   setTimeout(listPorts, 2000);
// }

// // Set a timeout that will check for new serialPorts every 2 seconds.
// // This timeout reschedules itself.
// setTimeout(listPorts, 2000);

// listSerialPorts()
const { SerialPort } = require('serialport');

const port = new SerialPort({
  path: 'COM5',
  baudRate: 9600,
});

module.exports = port;

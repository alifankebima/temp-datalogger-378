const { Buffer } = require('node:buffer');
const port = require('../config/serial');

// Get data
const sendOnce = () => port.write(Buffer.from('02410000000000000003', 'hex'));
const response = () => port.write(Buffer.from('02580000000000000003', 'hex'));
const sendContinuously = () =>
  port.write(Buffer.from('02610000000000000003', 'hex'));
const stopSendContinuously = () =>
  port.write(Buffer.from('02630000000000000003', 'hex'));

// Device buttons
const backlight = () => port.write(Buffer.from('02570000000000000003', 'hex'));
const minOrMax = () => port.write(Buffer.from('024D0000000000000003', 'hex'));
const record = () => port.write(Buffer.from('02450000000000000003', 'hex'));
const hold = () => port.write(Buffer.from('02480000000000000003', 'hex'));
const t1OrT2 = () => port.write(Buffer.from('02540000000000000003', 'hex'));
const celciusOrFahrenheit = () =>
  port.write(Buffer.from('02430000000000000003', 'hex'));
const exitMinOrMax = () =>
  port.write(Buffer.from('024E0000000000000003', 'hex'));

// EEPROM
const load = () => port.write(Buffer.from('02500000000000000003', 'hex'));
const dump = () => port.write(Buffer.from('02550000000000000003', 'hex'));
const write = () => port.write(Buffer.from('02770000000000000003', 'hex'));
const erase = () => port.write(Buffer.from('02650000000000000003', 'hex'));

// Device
const getModelNumber = () =>
  port.write(Buffer.from('024B0000000000000003', 'hex'));
const setDateTime = () =>
  port.write(Buffer.from('02720000000000000003', 'hex'));

module.exports = {
  data: {
    sendOnce,
    sendContinuously,
    stopSendContinuously,
    response,
  },
  button: {
    backlight,
    minOrMax,
    exitMinOrMax,
    record,
    hold,
    t1OrT2,
    celciusOrFahrenheit,
  },
  eeprom: {
    dump,
    write,
    erase,
    load,
  },
  device: {
    getModelNumber,
    setDateTime,
  },
};

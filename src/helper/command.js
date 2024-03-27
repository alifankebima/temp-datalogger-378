const { Buffer } = require('node:buffer');

// Get data
const sendOnce = (port) => port.write(Buffer.from('02410000000000000003', 'hex'));
const response = (port) => port.write(Buffer.from('02580000000000000003', 'hex'));
const sendContinuously = (port) => port.write(Buffer.from('02610000000000000003', 'hex'));
const stopSendContinuously = (port) => port.write(Buffer.from('02630000000000000003', 'hex'));

// Device buttons
const backlight = (port) => port.write(Buffer.from('02570000000000000003', 'hex'));
const minOrMax = (port) => port.write(Buffer.from('024D0000000000000003', 'hex'));
const record = (port) => port.write(Buffer.from('02450000000000000003', 'hex'));
const hold = (port) => port.write(Buffer.from('02480000000000000003', 'hex'));
const t1OrT2 = (port) => port.write(Buffer.from('02540000000000000003', 'hex'));
const celciusOrFahrenheit = (port) => port.write(Buffer.from('02430000000000000003', 'hex'));
const exitMinOrMax = (port) => port.write(Buffer.from('024E0000000000000003', 'hex'));

// EEPROM
const load = (port) => port.write(Buffer.from('02500000000000000003', 'hex'));
const dump = (port) => port.write(Buffer.from('02550000000000000003', 'hex'));
const write = (port) => port.write(Buffer.from('02770000000000000003', 'hex'));
const erase = (port) => port.write(Buffer.from('02650000000000000003', 'hex'));

// Device
const getModelNumber = (port) => port.write(Buffer.from('024B0000000000000003', 'hex'));
const setDateTime = (port) => port.write(Buffer.from('02720000000000000003', 'hex'));

export default {
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

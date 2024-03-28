const { Buffer } = require('node:buffer');
import commonHelper from "./common.js"

// List of Center 378 four channel datalogger thermometer serial commands
// Format : 0x02 (command in ASCII hex) 0x00  0x00 0x00 0x00 0x00 0x00 0x00 0x03

// Get data
const sendOnce = (port) => port.write(Buffer.from('02410000000000000003', 'hex'), commonHelper.handleError);
const response = (port) => port.write(Buffer.from('02580000000000000003', 'hex'), commonHelper.handleError);
const sendContinuously = (port) => port.write(Buffer.from('02610000000000000003', 'hex'), commonHelper.handleError);
const stopSendContinuously = (port) => port.write(Buffer.from('02630000000000000003', 'hex'), commonHelper.handleError);

// Device buttons
const backlight = (port) => port.write(Buffer.from('02570000000000000003', 'hex'), commonHelper.handleError);
const minOrMax = (port) => port.write(Buffer.from('024D0000000000000003', 'hex'), commonHelper.handleError);
const record = (port) => port.write(Buffer.from('02450000000000000003', 'hex'), commonHelper.handleError);
const hold = (port) => port.write(Buffer.from('02480000000000000003', 'hex'), commonHelper.handleError);
const t1OrT2 = (port) => port.write(Buffer.from('02540000000000000003', 'hex'), commonHelper.handleError);
const celciusOrFahrenheit = (port) => port.write(Buffer.from('02430000000000000003', 'hex'), commonHelper.handleError);
const exitMinOrMax = (port) => port.write(Buffer.from('024E0000000000000003', 'hex'), commonHelper.handleError);

// EEPROM
const load = (port) => port.write(Buffer.from('02500000000000000003', 'hex'), commonHelper.handleError);
const dump = (port) => port.write(Buffer.from('02550000000000000003', 'hex'), commonHelper.handleError);
const write = (port) => {
  port.write(Buffer.from('02770000000000000003', 'hex'), commonHelper.handleError);
  port.write(Buffer.from('02450000000000000003', 'hex'), commonHelper.handleError);
}
const erase = (port) => port.write(Buffer.from('02650000000000000003', 'hex'), commonHelper.handleError);

// Device
const getModelNumber = (port) => port.write(Buffer.from('024B0000000000000003', 'hex'), commonHelper.handleError);
const setDateTime = (port) => {
  port.write(Buffer.from('02720000000000000003', 'hex'), commonHelper.handleError);
  port.write(Buffer.from('02740000000000000003', 'hex'), commonHelper.handleError);
  port.write(Buffer.from('02630000000000000003', 'hex'), commonHelper.handleError);
};

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

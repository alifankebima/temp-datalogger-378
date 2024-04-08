import { SerialPort } from "serialport";
import commonHelper from "./commonHelper"

// List of Center 378 four channel datalogger thermometer serial commands
// Format : 0x02 (command in ASCII hex) 0x00  0x00 0x00 0x00 0x00 0x00 0x00 0x03
const hexPrefix = '02';
const hexPostfix = '0000000000000003';

// Get data
const sendOnce = (port: SerialPort): boolean =>
  port.write(hexPrefix + '41' + hexPostfix, 'hex', commonHelper.handleError);
const response = (port: SerialPort): boolean =>
  port.write(hexPrefix + '58' + hexPostfix, 'hex', commonHelper.handleError);
const sendContinuously = (port: SerialPort): boolean =>
  port.write(hexPrefix + '61' + hexPostfix, 'hex', commonHelper.handleError);
const stopSendContinuously = (port: SerialPort): boolean =>
  port.write(hexPrefix + '63' + hexPostfix, 'hex', commonHelper.handleError);

// Device buttons
const backlight = (port: SerialPort): boolean =>
  port.write(hexPrefix + '57' + hexPostfix, 'hex', commonHelper.handleError);
const minOrMax = (port: SerialPort): boolean =>
  port.write(hexPrefix + '4D' + hexPostfix, 'hex', commonHelper.handleError);
const record = (port: SerialPort): boolean =>
  port.write(hexPrefix + '45' + hexPostfix, 'hex', commonHelper.handleError);
const hold = (port: SerialPort): boolean =>
  port.write(hexPrefix + '48' + hexPostfix, 'hex', commonHelper.handleError);
const t1OrT2 = (port: SerialPort): boolean =>
  port.write(hexPrefix + '54' + hexPostfix, 'hex', commonHelper.handleError);
const celciusOrFahrenheit = (port: SerialPort): boolean =>
  port.write(hexPrefix + '43' + hexPostfix, 'hex', commonHelper.handleError);
const exitMinOrMax = (port: SerialPort): boolean =>
  port.write(hexPrefix + '4E' + hexPostfix, 'hex', commonHelper.handleError);

// EEPROM
const load = (port: SerialPort): boolean =>
  port.write(hexPrefix + '50' + hexPostfix, 'hex', commonHelper.handleError);
const dump = (port: SerialPort): boolean =>
  port.write(hexPrefix + '55' + hexPostfix, 'hex', commonHelper.handleError);
const write = (port: SerialPort): boolean => {
  const nextWrite = port.write(hexPrefix + '77' + hexPostfix, 'hex', commonHelper.handleError);
  if (nextWrite) return port.write(hexPrefix + '45' + hexPostfix, 'hex', commonHelper.handleError);
  return nextWrite
};
const erase = (port: SerialPort): boolean =>
  port.write(hexPrefix + '65' + hexPostfix, 'hex', commonHelper.handleError);

// Device
const getModelNumber = (port: SerialPort): boolean =>
  port.write(hexPrefix + '4B' + hexPostfix, 'hex', commonHelper.handleError);
const setDateTime = (port: SerialPort): boolean => {
  let nextWrite = true;
  if (nextWrite) nextWrite = port.write(hexPrefix + '72' + hexPostfix, 'hex', commonHelper.handleError);
  if (nextWrite) nextWrite = port.write(hexPrefix + '74' + hexPostfix, 'hex', commonHelper.handleError);
  if (nextWrite) nextWrite = port.write(hexPrefix + '63' + hexPostfix, 'hex', commonHelper.handleError);
  return nextWrite;
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
import { SerialPort } from "serialport";

// List of Center 378 four channel datalogger thermometer serial commands
// Format : 0x02 (command in ASCII hex) 0x00  0x00 0x00 0x00 0x00 0x00 0x00 0x03
const hexPrefix = '02';
const hexPostfix = '0000000000000003';

// Get data
const sendOnce = (port: SerialPort): boolean =>
  port.write(hexPrefix + '41' + hexPostfix, 'hex', (error) => { throw error });
const response = (port: SerialPort): boolean =>
  port.write(hexPrefix + '58' + hexPostfix, 'hex', (error) => { throw error });
const sendContinuously = (port: SerialPort): boolean =>
  port.write(hexPrefix + '61' + hexPostfix, 'hex', (error) => { throw error });
const stopSendContinuously = (port: SerialPort): boolean =>
  port.write(hexPrefix + '63' + hexPostfix, 'hex', (error) => { throw error });

// Device buttons
const backlight = (port: SerialPort): boolean =>
  port.write(hexPrefix + '57' + hexPostfix, 'hex', (error) => { throw error });
const minOrMax = (port: SerialPort): boolean =>
  port.write(hexPrefix + '4D' + hexPostfix, 'hex', (error) => { throw error });
const record = (port: SerialPort): boolean =>
  port.write(hexPrefix + '45' + hexPostfix, 'hex', (error) => { throw error });
const hold = (port: SerialPort): boolean =>
  port.write(hexPrefix + '48' + hexPostfix, 'hex', (error) => { throw error });
const t1OrT2 = (port: SerialPort): boolean =>
  port.write(hexPrefix + '54' + hexPostfix, 'hex', (error) => { throw error });
const celciusOrFahrenheit = (port: SerialPort): boolean =>
  port.write(hexPrefix + '43' + hexPostfix, 'hex', (error) => { throw error });
const exitMinOrMax = (port: SerialPort): boolean =>
  port.write(hexPrefix + '4E' + hexPostfix, 'hex', (error) => { throw error });

// EEPROM
const load = (port: SerialPort): boolean =>
  port.write(hexPrefix + '50' + hexPostfix, 'hex', (error) => { throw error });
const dump = (port: SerialPort): boolean =>
  port.write(hexPrefix + '55' + hexPostfix, 'hex', (error) => { throw error });
const write = (port: SerialPort): boolean => {
  const nextWrite = port.write(hexPrefix + '77' + hexPostfix, 'hex', (error) => { throw error });
  if (nextWrite) return port.write(hexPrefix + '45' + hexPostfix, 'hex', (error) => { throw error });
  return nextWrite
};
const erase = (port: SerialPort): boolean =>
  port.write(hexPrefix + '65' + hexPostfix, 'hex', (error) => { throw error });

// Device
const getModelNumber = (port: SerialPort): boolean =>
  port.write(hexPrefix + '4B' + hexPostfix, 'hex', (error) => { throw error });
const setDateTime = (port: SerialPort): boolean => {
  let nextWrite = true;
  if (nextWrite) nextWrite = port.write(hexPrefix + '72' + hexPostfix, 'hex', (error) => { throw error });
  if (nextWrite) nextWrite = port.write(hexPrefix + '74' + hexPostfix, 'hex', (error) => { throw error });
  if (nextWrite) nextWrite = port.write(hexPrefix + '63' + hexPostfix, 'hex', (error) => { throw error });
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
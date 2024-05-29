import { SerialPort } from 'serialport';
import store from './electronStore';


const serialport = async () => {
  try {
    const ports = await SerialPort.list()
    const targetDevice = ports.find(port => port.manufacturer?.includes('Silicon Labs'))
    if (!targetDevice) {
      console.log("Target device not found, devices list : \n", ports.map(port => port.manufacturer?.split('\\')[0]).join(", "))
      // store.set('state.devicePath', '')
      return null
    }

    store.set('devicePath', targetDevice.path)

    const port = new SerialPort({
      path: targetDevice.path,
      baudRate: 9600
    }, (error) => {
      console.error(error)
    });

    return port;
  } catch (error) {
    console.error("Error connecting to target device : ", error)
    return null
  }
}

export default serialport;
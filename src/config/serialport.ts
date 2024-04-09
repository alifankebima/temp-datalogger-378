import { SerialPort } from 'serialport';

const serialport = async () => {
  try {
    const ports = await SerialPort.list()
    const targetDevice = ports.find(port => port.manufacturer?.includes('Silicon Laboratories'))
    if (!targetDevice) {
      console.log("Target device not found, devices list : \n", ports.map(port => port.pnpId?.split('\\')[0]).join(", "))
      return null
    }

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
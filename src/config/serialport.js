const { SerialPort } = require('serialport');

const serialport = async () => {
  try {
    const ports = await SerialPort.list()
    const targetDevice = ports.find(port => port.manufacturer.includes('Silicon Laboratories'))
    if (!targetDevice) return console.log("Target device not found, devices list : \n",
      ports.map(port => port.friendlyName).join(", "))

    const port = new SerialPort({
      path: targetDevice.path,
      baudRate: 9600
    }, (error) => {
      if (error) throw new Error(error)
    });

    return port;
  } catch (error) {
    console.error("Error connecting to target device : ", error)
  }
}

export default serialport;
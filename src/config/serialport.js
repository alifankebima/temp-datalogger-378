const { SerialPort } = require('serialport');

const serialDevice = async () => {
  let port;

  const findDevice = async () => {
    try {
      const ports = await SerialPort.list()
      const targetDevice = ports.find(port => port.manufacturer.includes('Silicon Laboratories'))
      if (targetDevice) {
        return targetDevice.path
      } else {
        console.log("Target device not found, devices : ")
        console.log(ports.map(port => port.friendlyName).join(", "))
        return null
      }
    } catch (error) {
      console.error("Error searching Center 378 Device : ", error)
    }
  }

  const connectToDevice = async () => {
    const devicePath = await findDevice()
    if (!devicePath) return setTimeout(connectToDevice, 1500)

    port = new SerialPort({
      path: devicePath,
      baudRate: 9600
    }, (error) => { if (error) return console.log("Error : ", error.message) });

    port.on('open', () => {
      console.log("Serial port opened")
    });

    port.on('error', error => {
      console.error('Error:', error.message);
    });

    port.on('close', () => {
      console.log('Port closed.')
      setTimeout(connectToDevice, 1500);
    });
  }

  connectToDevice()
  return port
}

export default serialDevice;
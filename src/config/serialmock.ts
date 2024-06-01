import { SerialPortStream } from '@serialport/stream';
import { MockBinding } from '@serialport/binding-mock';
import store from './electronStore';

const serialport = async () => {
  try {
    let path = "";
    if (process.platform === "linux") {
      path = "/dev/tty77"
      MockBinding.createPort(path)
    } else if (process.platform === "win32") {
      path = "COM7"
      MockBinding.createPort(path)
    } else {
      throw new Error("Platform not supported")
    }

    const port = new SerialPortStream({
      binding: MockBinding,
      path: path,
      baudRate: 9600,
      endOnClose: true
    })
    store.set('devicePath', port.path)
    return port;
  } catch (error) {
    console.error("Error creating mock device : ", error)
    return null
  }
}

export default serialport;
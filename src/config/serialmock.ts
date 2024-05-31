import { SerialPortStream } from '@serialport/stream';
import { MockBinding } from '@serialport/binding-mock';

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

    return port;
  } catch (error) {
    console.error("Error creating mock device : ", error)
    return null
  }
}

export default serialport;
const { SerialPortStream } = require('@serialport/stream');
const { MockBinding } = require('@serialport/binding-mock');

const serialport = async () => {
  try {
    MockBinding.createPort("COM7")
    const port = new SerialPortStream({
      binding: MockBinding,
      path: "COM7",
      baudRate: 9600
    })

    return port;
  } catch (error) {
    console.error("Error connecting to target device : ", error)
  }
}

export default serialport;
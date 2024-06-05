import { Milliseconds } from "./unit"

type PrefferedFileType = 'pdf' | 'xlsx' | 'png'
type Base64 = string

interface SaveFileArgs {
  startTimestamp?: Milliseconds,
  endTimestamp?: Milliseconds,
  prefferedType?: PrefferedFileType
  image?: Base64
}

export {
  PrefferedFileType,
  SaveFileArgs
}
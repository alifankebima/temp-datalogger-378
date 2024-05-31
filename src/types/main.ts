export interface SaveFileArgs {
    startTimestamp?: number,
    endTimestamp?: number,
    prefferedType?: 'pdf' | 'xlsx' | 'png'
    image?: string
  }
export interface Temps<T = number | null | undefined> {
    t1: T,
    t2: T,
    t3: T,
    t4: T,
}

export interface GraphData extends Temps {
    created_at: number
}

export interface IpcMainWindow extends Temps<number> {
    command: string
    result: GraphData[]
}
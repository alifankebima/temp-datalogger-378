import { Milliseconds } from "./unit";

export interface Temps<T = number | undefined> {
    t1: T,
    t2: T,
    t3: T,
    t4: T,
}

export interface GraphData extends Temps {
    created_at: Milliseconds
}
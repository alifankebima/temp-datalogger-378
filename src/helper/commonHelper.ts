import { Milliseconds } from "../types/unit"

const parseTemp = (firstByte?: number, secondByte?: number): number | undefined => {
    if (firstByte === undefined || secondByte === undefined) return
    return parseInt(firstByte.toString(16).padStart(2, '0') + secondByte.toString(16).padStart(2, '0'), 16) / 10
}

const calcMin = (firstNumber?: number, secondNumber?: number): number | undefined => {
    if (firstNumber === undefined) return
    if (secondNumber === undefined) return firstNumber
    return Math.min(firstNumber, secondNumber)
}

const shiftNumToArray = (array: number[], num?: number): number[] => {
    if (num === undefined) return array
    array.push(num);
    if (array.length > 100) array.shift();
    return array
}

const calcAvgArray = (array: number[]): number => {
    return array.reduce((acc, val) => acc + val, 0) / array.length;
}

const calcMax = (firstNumber?: number, secondNumber?: number): number | undefined => {
    if (firstNumber === undefined) return
    if (secondNumber === undefined) return firstNumber
    return Math.max(firstNumber, secondNumber);
}

const isPastMidnight = (startTimestamp?: Milliseconds, endTimestamp?: Milliseconds): boolean => {
    if (startTimestamp === undefined || endTimestamp === undefined) return false
    const startDate = new Date(startTimestamp)
    const endDate = new Date(endTimestamp)

    return startDate.toDateString() === endDate.toDateString()
}

const handleError = (errorMessage?: string, successMessage?: string) => {
    return (error?: Error | null) => {
        if (error) {
            errorMessage ? console.error(errorMessage, error) : console.error(error)
            throw error
        }
        if (successMessage) console.log(successMessage)
    }
}

export default {
    parseTemp,
    calcMin,
    shiftNumToArray,
    calcAvgArray,
    calcMax,
    isPastMidnight,
    handleError
}
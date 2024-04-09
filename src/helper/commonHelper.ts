const parseTemp = (firstByte: number | undefined, secondByte: number | undefined): number | undefined => {
    if(firstByte === undefined || secondByte === undefined) return
    return parseInt(
        firstByte.toString(16).padStart(2, '0') +
        secondByte.toString(16).padStart(2, '0')
        , 16) / 10
}

const calcMin = (firstNum: number | null | undefined, secondNum: number | null | undefined): number | null => {
    if(secondNum === null || secondNum === undefined) return null
    return Math.min(firstNum ?? secondNum, secondNum)
}

const shiftNumToArray = (array: number[], num: number | null | undefined): number[] => {
    if(num === null || num === undefined) return array
    array.push(num);
    if (array.length > 20) array.shift();
    return array
}

const calcAvgArray = (array: number[]): number => {
    return array.reduce((acc, val) => acc + val, 0) / array.length;
}

const calcMax = (firstNum: number | null | undefined, secondNum: number | null | undefined): number | null => {
    if(secondNum === null || secondNum === undefined) return null
    return Math.max(firstNum ?? secondNum, secondNum);
}

const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu']
    return hari[date.getDay()] + " " + new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(date).split('/').join('-')
}

const handleError = (error: Error | unknown): void =>
    console.error(error);

const isNotNullOrUndefined = (value: unknown): boolean => {
    if(value !== null && value !== undefined) return true
    return false
}

export default {
    parseTemp,
    calcMin,
    shiftNumToArray,
    calcAvgArray,
    calcMax,
    handleError,
    formatDate,
    isNotNullOrUndefined
}
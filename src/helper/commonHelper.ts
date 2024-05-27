const parseTemp = (firstByte: number | undefined, secondByte: number | undefined): number | undefined => {
    if (firstByte === undefined || secondByte === undefined) return
    return parseInt(
        firstByte.toString(16).padStart(2, '0') +
        secondByte.toString(16).padStart(2, '0')
        , 16) / 10
}

const calcMin = (firstNum: number | null | undefined, secondNum: number | null | undefined): number | null => {
    if (secondNum === null || secondNum === undefined) return null
    return Math.min(firstNum ?? secondNum, secondNum)
}

const shiftNumToArray = (array: number[], num: number | null | undefined): number[] => {
    if (num === null || num === undefined) return array
    array.push(num);
    if (array.length > 100) array.shift();
    return array
}

const calcAvgArray = (array: number[]): number => {
    return array.reduce((acc, val) => acc + val, 0) / array.length;
}

const calcMax = (firstNum: number | null | undefined, secondNum: number | null | undefined): number | null => {
    if (secondNum === null || secondNum === undefined) return null
    return Math.max(firstNum ?? secondNum, secondNum);
}

// Example : Senin, 27-05-2024, 11.38.23
const formatDateTime = (timestamp: number): string => {
    if (!timestamp) return ""
    const date = new Date(timestamp)

    return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(date).split('/').join('-')
}

const formatFileDate = (startTimestamp: number, endTimestamp?: number): string => {
    const d: Intl.DateTimeFormatOptions = { day: 'numeric' }
    const dm: Intl.DateTimeFormatOptions = { ...d, month: 'long' }
    const dmy: Intl.DateTimeFormatOptions = { ...dm, year: 'numeric' }

    if (!startTimestamp) return ""
    const startDate = new Date(startTimestamp)

    if (!endTimestamp) return new Intl.DateTimeFormat('id-ID', dmy).format(startDate)
    const endDate = new Date(endTimestamp)
    
    if (startDate.getFullYear() !== endDate.getFullYear()) 
        return new Intl.DateTimeFormat('id-ID', dmy).format(startDate) + " - " + new Intl.DateTimeFormat('id-ID', dmy).format(endDate)

    if (startDate.getMonth() !== endDate.getMonth()) 
        return new Intl.DateTimeFormat('id-ID', dm).format(startDate) + " - " + new Intl.DateTimeFormat('id-ID', dmy).format(endDate)
    
    if (startDate.getDate() !== endDate.getDate())
        return new Intl.DateTimeFormat('id-ID', d).format(startDate) + " - " + new Intl.DateTimeFormat('id-ID', dmy).format(endDate)

    return new Intl.DateTimeFormat('id-ID', dmy).format(startDate)
}

// Example : Jumat, 24 Mei 2024
const formatDate = (timestamp: number): string => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    date.setMonth(8)

    return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date)
}

// Example : 10:04:32
const formatTime = (timestamp: number): string => {
    if (!timestamp) return ""
    const date = new Date(timestamp)

    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(date).split('.').join(':')
}

const formatDuration = (timestamp: number): string => {
    if (!timestamp) return ""

    const days = Math.floor(timestamp / 86400000)
    const hours = Math.floor(timestamp / 3600000) % 24
    const minutes = Math.floor(timestamp / 60000) % 60
    const seconds = Math.floor(timestamp / 1000) % 60

    const results = []
    if (days) results.push(`${days} Hari`)
    if (hours) results.push(`${hours} Jam`)
    if (minutes) results.push(`${minutes} Menit`)
    if (seconds) results.push(`${seconds} Detik`)

    return results.join(', ')
}

const handleError = (error: Error | unknown): void =>
    error ? console.error(error) : undefined;

const isNotNullOrUndefined = (value: unknown): boolean => {
    if (value !== null && value !== undefined) return true
    return false
}

const isPastMidnight = (startTimestamp: number | undefined, endTimestamp: number | undefined): boolean => {
    if (!startTimestamp || !endTimestamp) return false
    const startDate = new Date(startTimestamp)
    const endDate = new Date(endTimestamp)

    return startDate.toDateString() === endDate.toDateString()
}

export default {
    parseTemp,
    calcMin,
    shiftNumToArray,
    calcAvgArray,
    calcMax,
    handleError,
    formatDateTime,
    formatDate,
    formatTime,
    formatDuration,
    formatFileDate,
    isNotNullOrUndefined,
    isPastMidnight
}
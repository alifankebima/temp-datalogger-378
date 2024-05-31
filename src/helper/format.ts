const d: Intl.DateTimeFormatOptions = { day: 'numeric' }
const dm: Intl.DateTimeFormatOptions = { ...d, month: 'long' }
const dmy: Intl.DateTimeFormatOptions = { ...dm, year: 'numeric' }

// Example : 
// 31 Desember 2024 - 1 Januari 2025
// 31 Mei - 1 Juni 2024
// 15 Juli 2024
const fileDate = (startTimestamp?: number, endTimestamp?: number): string => {
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
const date = (timestamp?: number): string => {
    if (!timestamp) return ""
    const date = new Date(timestamp)

    return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        ...dmy
    }).format(date)
}

// Example : 10:04:32
const time = (timestamp?: number): string => {
    if (!timestamp) return ""
    const date = new Date(timestamp)

    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(date).split('.').join(':')
}

// Example : 1 Hari, 2 Jam, 3 Menit, 4 Detik
const duration = (timeMilliseconds?: number): string => {
    if (!timeMilliseconds) return ""

    const days = Math.floor(timeMilliseconds / 86400000)
    const hours = Math.floor(timeMilliseconds / 3600000) % 24
    const minutes = Math.floor(timeMilliseconds / 60000) % 60
    const seconds = Math.floor(timeMilliseconds / 1000) % 60

    const results = []
    if (days) results.push(`${days} Hari`)
    if (hours) results.push(`${hours} Jam`)
    if (minutes) results.push(`${minutes} Menit`)
    if (seconds) results.push(`${seconds} Detik`)

    return results.join(', ')
}

export default {
    fileDate,
    date,
    time,
    duration
}
const addLeadingZeros = (input, zeroAmount) => {
    let result = input.toString();
    for (let i = result.length; i <= zeroAmount; i++) {
        result = '0'.concat(result);
    }
    return result;
}

const parseTemp = (firstByte, secondByte) => {
    return parseInt(
        addLeadingZeros(firstByte.toString(16), 1) +
        addLeadingZeros(secondByte.toString(16), 1)
        , 16) / 10;
}

const calculateMinTemp = (lowTemp, input) => {
    if (!lowTemp) lowTemp = input;
    return Math.min(lowTemp, input)
}

const handleAvgTempArray = (avgTemp, input) => {
    avgTemp.push(input);
    if (avgTemp.length > 20) avgTemp.shift();
    return avgTemp
}

const calculateAvgTemp = (avgTempArray) => {
    const sum = avgTempArray.reduce((acc, val) => acc + val, 0);
    return sum / avgTempArray.length;
}

const calculateMaxTemp = (maxTemp, input) => {
    if (!maxTemp) maxTemp = input;
    return Math.max(maxTemp, input);
}

const formattedDate = (timestamp) => {
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

const handleError = (error) => error && console.error(error.message || error);

export default {
    parseTemp,
    calculateMinTemp,
    handleAvgTempArray,
    calculateAvgTemp,
    calculateMaxTemp,
    handleError,
    formattedDate
}
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

const calculateAvgTemp = (avgTemp, input) => {
    avgTemp.push(input);
    if(avgTemp.length > 10) avgTemp.shift();
    const sum = avgTemp.reduce((acc, val) => acc + val, 0);
    return sum / avgTemp.length;
}

const calculateMaxTemp = (maxTemp, input) => {
    if (!maxTemp) maxTemp = input;
    return Math.max(maxTemp, input);
}

const handleError = (error) => error && console.error(error.message || error);

export default {
    parseTemp,
    calculateMinTemp,
    calculateAvgTemp,
    calculateMaxTemp,
    handleError
}
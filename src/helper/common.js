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

let lowTemp;
const calculateMinTemp = (input) => {
    if (!lowTemp) lowTemp = input;
    return Math.min(lowTemp, input)
}

let avgTemp = [];
const calculateAvgTemp = (input) => {
    avgTemp.push(input);
    if(avgTemp.length > 10) avgTemp.shift();
    const sum = avgTemp.reduce((acc, val) => acc + val, 0);
    return sum / avgTemp.length;
}

let maxTemp;
const calculateMaxTemp = (input) => {
    if (!maxTemp) maxTemp = input;
    return Math.max(maxTemp, input);
}

module.exports = {
    parseTemp,
    calculateMinTemp,
    calculateAvgTemp,
    calculateMaxTemp
}
export function init2DimArray(n) {
    const result = [];
    for (let i = 0; i < n; i++) {
        result[i] = [];
    }
    return result;
}

export function passedTime(startTime) {
    return (new Date() - startTime) / 1000;
}

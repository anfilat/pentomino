export function mirrorX(matrix) {
    const yMax = matrix.length;
    const xMax = matrix[0].length;
    const newMatrix = [];

    for (let y = 0; y < yMax; y++) {
        const line = [];
        for (let x = 0; x < xMax; x++) {
            line.push(matrix[y][xMax - x - 1]);
        }
        newMatrix.push(line);
    }

    return newMatrix;
}

export function mirrorY(matrix) {
    const yMax = matrix.length;
    const xMax = matrix[0].length;
    const newMatrix = [];

    for (let y = 0; y < yMax; y++) {
        const line = [];
        for (let x = 0; x < xMax; x++) {
            line.push(matrix[yMax - y - 1][x]);
        }
        newMatrix.push(line);
    }

    return newMatrix;
}

export function mirrorXY(matrix) {
    const yMax = matrix.length;
    const xMax = matrix[0].length;
    const newMatrix = [];

    for (let y = 0; y < yMax; y++) {
        const line = [];
        for (let x = 0; x < xMax; x++) {
            line.push(matrix[yMax - y - 1][xMax - x - 1]);
        }
        newMatrix.push(line);
    }

    return newMatrix;
}

export function rotate(matrix) {
    const yMax = matrix.length;
    const xMax = matrix[0].length;
    const newMatrix = [];

    for (let x = 0; x < xMax; x++) {
        newMatrix.push([]);
    }
    for (let x = 0; x < xMax; x++) {
        for (let y = 0; y < yMax; y++) {
            newMatrix[x].push(matrix[y][x]);
        }
    }

    return newMatrix;
}

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

export function equalMatrix(m1, m2) {
    const yMax = m1.length;
    const xMax = m1[0].length;

    if (yMax !== m2.length) {
        return false;
    }
    if (xMax !== m2[0].length) {
        return false;
    }

    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            if (m1[y][x] !== m2[y][x]) {
                return false;
            }
        }
    }

    return true;
}

export function equalByMirrorX(m1, m2) {
    const yMax = m1.length;
    const xMax = m1[0].length;

    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            if (m1[y][xMax - x - 1] !== m2[y][x]) {
                return false;
            }
        }
    }

    return true;
}

export function equalByMirrorY(m1, m2) {
    const yMax = m1.length;
    const xMax = m1[0].length;

    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            if (m1[yMax - y - 1][x] !== m2[y][x]) {
                return false;
            }
        }
    }

    return true;
}

export function equalByMirrorXY(m1, m2) {
    const yMax = m1.length;
    const xMax = m1[0].length;

    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            if (m1[yMax - y - 1][xMax - x - 1] !== m2[y][x]) {
                return false;
            }
        }
    }

    return true;
}

export function equalByRotate(m1, m2) {
    const yMax = m1.length;
    const xMax = m1[0].length;

    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            if (m1[x][y] !== m2[y][x]) {
                return false;
            }
        }
    }

    return true;
}

export function equalByRotateAndMirrorX(m1, m2) {
    const yMax = m1.length;
    const xMax = m1[0].length;

    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            if (m1[xMax - x - 1][y] !== m2[y][x]) {
                return false;
            }
        }
    }

    return true;
}

export function equalByRotateAndMirrorY(m1, m2) {
    const yMax = m1.length;
    const xMax = m1[0].length;

    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            if (m1[x][yMax - y - 1] !== m2[y][x]) {
                return false;
            }
        }
    }

    return true;
}

export function equalByRotateAndMirrorXY(m1, m2) {
    const yMax = m1.length;
    const xMax = m1[0].length;

    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            if (m1[xMax - x - 1][yMax - y - 1] !== m2[y][x]) {
                return false;
            }
        }
    }

    return true;
}

export function passedTime(startTime) {
    return (new Date() - startTime) / 1000;
}

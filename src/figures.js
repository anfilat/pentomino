import {mirrorX, mirrorY, mirrorXY, rotate} from './utils.js';

export function variateFigure({name, matrix}) {
    const variants = new Set();
    const results = [];

    addVariant(variants, results, name, matrix);
    addVariant(variants, results, name, mirrorX(matrix));
    addVariant(variants, results, name, mirrorY(matrix));
    addVariant(variants, results, name, mirrorXY(matrix));
    const rotateMatrix = rotate(matrix);
    addVariant(variants, results, name, rotateMatrix);
    addVariant(variants, results, name, mirrorX(rotateMatrix));
    addVariant(variants, results, name, mirrorY(rotateMatrix));
    addVariant(variants, results, name, mirrorXY(rotateMatrix));

    return results;
}

function addVariant(variants, results, name, matrix) {
    const figure = {
        name,
        matrix,
    };
    const s = figureToString(figure);
    if (!variants.has(s)) {
        variants.add(s);
        results.push(figure);
    }
}

function figureToString({matrix}) {
    const yMax = matrix.length;
    const xMax = matrix[0].length;
    let s = '';
    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            s += matrix[y][x] === 1 ? '*' : ' ';
        }
        s += '\n';
    }
    return s;
}

export const figures = {
    I: {
        name: 'I',
        matrix: [
            [1, 1, 1, 1, 1],
        ],
    },
    N: {
        name: 'N',
        matrix: [
            [1, 1, 1, 0],
            [0, 0, 1, 1],
        ],
    },
    L: {
        name: 'L',
        matrix: [
            [1, 1, 1, 1],
            [0, 0, 0, 1],
        ],
    },
    U: {
        name: 'U',
        matrix: [
            [1, 1, 1],
            [1, 0, 1],
        ],
    },
    X: {
        name: 'X',
        matrix: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
        ],
    },
    W: {
        name: 'W',
        matrix: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 1],
        ],
    },
    P: {
        name: 'P',
        matrix: [
            [1, 1, 1],
            [0, 1, 1],
        ],
    },
    F: {
        name: 'F',
        matrix: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 1, 0],
        ],
    },
    Z: {
        name: 'Z',
        matrix: [
            [0, 1, 1],
            [0, 1, 0],
            [1, 1, 0],
        ],
    },
    T: {
        name: 'T',
        matrix: [
            [1, 1, 1],
            [0, 1, 0],
            [0, 1, 0],
        ],
    },
    V: {
        name: 'V',
        matrix: [
            [1, 0, 0],
            [1, 0, 0],
            [1, 1, 1],
        ],
    },
    Y: {
        name: 'Y',
        matrix: [
            [1, 1, 1, 1],
            [0, 0, 1, 0],
        ],
    },
};

import {mirrorX, mirrorY, mirrorXY, rotate} from './utils.js';

export function variateFigure(figure) {
    const results = [];
    const variants = new Set();
    const matrix = figure.matrix;
    const rotateMatrix = rotate(figure.matrix);

    [
        matrix, mirrorX(matrix), mirrorY(matrix), mirrorXY(matrix),
        rotateMatrix, mirrorX(rotateMatrix), mirrorY(rotateMatrix), mirrorXY(rotateMatrix)
    ].forEach(matrix => {
        const newFigure = Object.assign({}, figure, {matrix});
        const s = figureToString(newFigure);
        if (!variants.has(s)) {
            variants.add(s);
            results.push(newFigure);
        }
    });

    return results;
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
        trueColor: '#660000',
        color: 'bgMagenta',
    },
    N: {
        name: 'N',
        matrix: [
            [1, 1, 1, 0],
            [0, 0, 1, 1],
        ],
        trueColor: '#ffff00',
        color: 'bgYellowBright',
    },
    L: {
        name: 'L',
        matrix: [
            [1, 1, 1, 1],
            [0, 0, 0, 1],
        ],
        trueColor: '#994d00',
        color: 'bgMagentaBright',
    },
    U: {
        name: 'U',
        matrix: [
            [1, 1, 1],
            [1, 0, 1],
        ],
        trueColor: '#8000CC',
        color: 'bgBlue',
    },
    X: {
        name: 'X',
        matrix: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
        ],
        trueColor: '#FF0080',
        color: 'bgRed',
    },
    W: {
        name: 'W',
        matrix: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 1],
        ],
        trueColor: '#008000',
        color: 'bgGreen',
    },
    P: {
        name: 'P',
        matrix: [
            [1, 1, 1],
            [0, 1, 1],
        ],
        trueColor: '#FF8000',
        color: 'bgCyanBright',
    },
    F: {
        name: 'F',
        matrix: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 1, 0],
        ],
        trueColor: '#CCCCE6',
        color: 'bgWhite',
    },
    Z: {
        name: 'Z',
        matrix: [
            [0, 1, 1],
            [0, 1, 0],
            [1, 1, 0],
        ],
        trueColor: '#CCCC00',
        color: 'bgYellow',
    },
    T: {
        name: 'T',
        matrix: [
            [1, 1, 1],
            [0, 1, 0],
            [0, 1, 0],
        ],
        trueColor: '#FF1A1A',
        color: 'bgRedBright',
    },
    V: {
        name: 'V',
        matrix: [
            [1, 0, 0],
            [1, 0, 0],
            [1, 1, 1],
        ],
        trueColor: '#00FF00',
        color: 'bgBlueBright',
    },
    Y: {
        name: 'Y',
        matrix: [
            [1, 1, 1, 1],
            [0, 0, 1, 0],
        ],
        trueColor: '#6680E6',
        color: 'bgGreenBright',
    },
};
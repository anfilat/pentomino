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

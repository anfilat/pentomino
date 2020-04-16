import {figures, assignColors} from "../../dlx/index.js";

export function printSolution(solution, itemsUnique) {
    if (itemsUnique) {
        return printByUniqueColors(solution);
    } else {
        return printByMinColors(solution);
    }
}

function printByUniqueColors(solution) {
    const result = [];
    const yMax = solution.length;
    const xMax = solution[0].length;

    for (let y = 0; y < yMax; y++) {
        const line = [];
        for (let x = 0; x < xMax; x++) {
            const cell = solution[y][x];

            if (typeof cell === 'object') {
                line.push(figures[cell.name].trueColor);
            } else {
                line.push(null);
            }
        }
        result.push(line);
    }

    return result;
}

function printByMinColors(solution) {
    const result = [];
    const yMax = solution.length;
    const xMax = solution[0].length;
    const colors = assignColors(solution);

    for (let y = 0; y < yMax; y++) {
        const line = [];
        for (let x = 0; x < xMax; x++) {
            const cell = solution[y][x];

            if (typeof cell === 'object') {
                line.push(standardColors[colors.get(cell.id)]);
            } else {
                line.push(null);
            }
        }
        result.push(line);
    }

    return result;
}

const standardColors = {
    0: 'bgGreenBright',
    1: 'bgYellowBright',
    2: 'bgRedBright',
    3: 'bgBlue',
    4: 'bgCyanBright',
    5: 'bgWhite',
    6: 'bgMagenta',
    7: 'bgYellow',
};

import chalk from "chalk";
import {figures} from "../dlx/index.js";

const draw = chalk.level === 3 ? drawByTrueColor : drawByBasicColor;

export function printSolution(solution) {
    const yMax = solution.length;
    const xMax = solution[0].length;

    for (let y = 0; y < yMax; y++) {
        let s = '';
        for (let x = 0; x < xMax; x++) {
            const cell = solution[y][x];

            if (typeof cell === 'object') {
                s += draw(figures[cell.name]);
            } else {
                s += drawBlank();
            }
        }
        console.log(s);
    }
}

const cellFill = '  ';

function drawByTrueColor(figure) {
    return chalk.bgHex(figure.trueColor)(cellFill);
}

function drawByBasicColor(figure) {
    return chalk[figure.color](cellFill);
}

function drawBlank() {
    return chalk.bgWhiteBright(cellFill);
}

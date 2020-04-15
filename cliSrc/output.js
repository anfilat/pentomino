import chalk from "chalk";
import {figures, assignColors} from "../dlx/index.js";

const draw = chalk.level === 3 ? drawByTrueColor : drawByBasicColor;

// solution - двумерный прямоугольный массив, первый индекс - y, второй - x
// для заполненных ячеек - {id, name}
// name - имя фигуры, id - идентификатор. У ячеек, принадлежащих одной фигуре, одинаковый id
// Может быть несколько одинаковых фигур, у них одинаковый name, но разный id
// itemsUnique - нет одинаковых фигур. В этом случае рисуем фигуру назначенным ей цветом
// Если есть одинаковые фигуры, то рисуем, используя алгоритм раскраски минимальным количеством цветов
export function printSolution(solution, itemsUnique) {
    if (itemsUnique) {
        printByUniqueColors(solution);
    } else {
        printByMinColors(solution);
    }
}

function printByUniqueColors(solution) {
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

function printByMinColors(solution) {
    const yMax = solution.length;
    const xMax = solution[0].length;
    const colors = assignColors(solution);

    for (let y = 0; y < yMax; y++) {
        let s = '';
        for (let x = 0; x < xMax; x++) {
            const cell = solution[y][x];

            if (typeof cell === 'object') {
                s += drawByStandardColor(standardColors[colors.get(cell.id)]);
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

function drawByStandardColor(color) {
    return chalk[color](cellFill);
}

import chalk from "chalk";
import {figures} from "../dlx/index.js";

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
    const graph = buildGraph(solution);
    const color = greedyColor(graph);
    printByStandardColors(solution, color);
}

// преобразует решение в граф. Ребра соединяют фигуры, граничащие по горизонтали или вертикали
function buildGraph(solution) {
    const yMax = solution.length;
    const xMax = solution[0].length;
    const items = new Map();

    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            const cell = solution[y][x];
            if (typeof cell === 'object') {
                const id = cell.id;
                let item = items.get(id);
                if (!item) {
                    item = new Set();
                    items.set(id, item);
                }
                addNeighbour(item, id, y - 1, x);
                addNeighbour(item, id, y + 1, x);
                addNeighbour(item, id, y, x - 1);
                addNeighbour(item, id, y, x + 1);
            }
        }
    }

    return items;

    function addNeighbour(item, id, y, x) {
        if (y >= 0 && y < yMax && x >= 0 && x < xMax) {
            const cell = solution[y][x];
            if (typeof cell === 'object' && cell.id !== id) {
                item.add(cell.id);
            }
        }
    }
}

// алгоритм жадной раскраски минимальным количеством цветов
function greedyColor(graph) {
    const color = new Map();

    Array.from(graph)
        .sort((a, b) => b[1].size - a[1].size)
        .forEach(([id, neighbours]) => {
            const colorList = new Set();
            neighbours.forEach(neighbour => {
                if (color.has(neighbour)) {
                    colorList.add(color.get(neighbour));
                }
            });
            color.set(id, firstAvailableColor(colorList));
        });

    return color;
}

function firstAvailableColor(colorList) {
    let i = 0;
    while (true) {
        if (!colorList.has(i)) {
            return i;
        }
        i++;
    }
}

function printByStandardColors(solution, color) {
    const yMax = solution.length;
    const xMax = solution[0].length;

    for (let y = 0; y < yMax; y++) {
        let s = '';
        for (let x = 0; x < xMax; x++) {
            const cell = solution[y][x];

            if (typeof cell === 'object') {
                s += drawByStandardColor(standardColors[color.get(cell.id)]);
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

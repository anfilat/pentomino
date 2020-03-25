import {ErrorAreaNotDiv5, ErrorAreaIs0, ErrorAreaGreaterFigures} from './errors.js';
import {variateFigure, figures} from './figures.js';
import {equalMatrix, mirrorX, mirrorY, mirrorXY, rotate} from './utils.js';

const figureLength = 5;

// входные данные
// items: {имяФигуры: количествоФигур, ...}
// если имяФигуры не найдено в списке figures, итем игнорируется
// если количествоФигур <= 0, итем игнорируется
// space: [[0, 1, 1, 0, ...],...]
// двумерный прямоугольный массив, первый индекс - y, второй - x
// ячейки, которые должны быть заполнены, обозначаются truthy
//
// выходные данные
// [{columns, rows, mirrors}, ошибка]
// если для указанных входных данных нет смысла искать решение, то возвращается [null, error]
// иначе возвращается массив колонок, массив возможных рядов и массив симметрий
// формат колонки: {x, y}
// формат ряда: {figureName, subset: [columnNumber, ...]}
// если space совпадает с собой при симметричных преобразованиях (горизонтальное отражение, вертикальное, ...)
// то в mirrors содержатся эти преобразования (для определения дублирующих решений)
export function prepareData(items, space) {
    const itemsCount = calcItemsCount(items);
    const spaceArea = calcSpaceArea(space);

    if (spaceArea === 0) {
        return [null, new ErrorAreaIs0];
    }
    if (spaceArea > itemsCount * figureLength) {
        return [null, new ErrorAreaGreaterFigures];
    }
    if (spaceArea % figureLength !== 0) {
        return [null, new ErrorAreaNotDiv5];
    }

    const yMax = space.length;
    const xMax = space[0].length;
    const {columns, checkMatrix} = getColumns(space, itemsCount);
    const rows = createRows(items, checkMatrix);
    const mirrors = getMirrors(space);

    return [
        {
            xMax,
            yMax,
            columns,
            rows,
            mirrors,
        },
        null
    ];
}

function calcItemsCount(items) {
    let area = 0;

    Object.entries(items).forEach(([figureName, count]) => {
        if (!figures[figureName] || count <= 0) {
            return;
        }
        area += count;
    });

    return area;
}

function calcSpaceArea(space) {
    let area = 0;
    const yMax = space.length;
    const xMax = space[0].length;

    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            if (space[y][x]) {
                area++;
            }
        }
    }

    return area;
}

function getColumns(space, itemsCount) {
    const columns = [];
    const checkMatrix = [];

    // колонки с номерами фигур
    for (let i = 0; i < itemsCount; i++) {
        columns.push(null);
    }

    const yMax = space.length;
    const xMax = space[0].length;

    // колонки для заполнения фигурами
    for (let y = 0; y < yMax; y++) {
        const checkLine = [];
        checkMatrix.push(checkLine);
        for (let x = 0; x < xMax; x++) {
            if (space[y][x]) {
                checkLine.push(columns.length);
                columns.push({x, y});
            } else {
                checkLine.push(-1);
            }
        }
    }

    return {columns, checkMatrix};
}

function createRows(items, checkMatrix) {
    const rows = [];
    const yMax = checkMatrix.length;
    const xMax = checkMatrix[0].length;
    let figureNum = 0;

    Object.entries(items).forEach(([figureName, count]) => {
        if (!figures[figureName] || count <= 0) {
            return;
        }
        for (let c = 0; c < count; c++) {
            // все варианты расположения одной фигуры с учетом поворотов и смещений
            // повороты
            variateFigure(figures[figureName]).forEach(({name, matrix}) => {
                const figureYMax = matrix.length;
                const figureXMax = matrix[0].length;
                // смещения
                for (let y = 0; y < yMax - figureYMax + 1; y++) {
                    nextFigure: for (let x = 0; x < xMax - figureXMax + 1; x++) {
                        // первая колонка - номер фигуры
                        const subset = [figureNum];
                        // мапим фигуру на колонки
                        for (let figureY = 0; figureY < figureYMax; figureY++) {
                            for (let figureX = 0; figureX < figureXMax; figureX++) {
                                const val = matrix[figureY][figureX];
                                if (val) {
                                    const col = checkMatrix[y + figureY][x + figureX];
                                    // попали на недоступную ячейку, это положение фигуры пропускается
                                    if (col === -1) {
                                        continue nextFigure;
                                    }
                                    subset.push(col);
                                }
                            }
                        }
                        rows.push({name, subset});
                    }
                }
            });
            figureNum++;
        }
    });

    return rows;
}

function getMirrors(space) {
    const mirrors = [solutionToString];

    if (equalMatrix(space, mirrorX(space))) {
        mirrors.push(solutionMirrorXToString);
    }
    if (equalMatrix(space, mirrorY(space))) {
        mirrors.push(solutionMirrorYToString);
    }
    if (equalMatrix(space, mirrorXY(space))) {
        mirrors.push(solutionMirrorXYToString);
    }
    if (equalMatrix(space, rotate(space))) {
        mirrors.push(solutionRotateToString);
    }
    if (equalMatrix(space, mirrorX(rotate(space)))) {
        mirrors.push(solutionRotateAndMirrorXToString);
    }
    if (equalMatrix(space, mirrorY(rotate(space)))) {
        mirrors.push(solutionRotateAndMirrorYToString);
    }
    if (equalMatrix(space, mirrorXY(rotate(space)))) {
        mirrors.push(solutionRotateAndMirrorXYToString);
    }

    return mirrors;
}

function solutionToString(solution) {
    let s = '';
    const yMax = solution.length;
    const xMax = solution[0].length;

    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            s += solution[y][x];
        }
        s += '\n';
    }
    return s;
}

function solutionMirrorXToString(solution) {
    let s = '';
    const yMax = solution.length;
    const xMax = solution[0].length;

    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            s += solution[y][xMax - x - 1];
        }
        s += '\n';
    }
    return s;
}

function solutionMirrorYToString(solution) {
    let s = '';
    const yMax = solution.length;
    const xMax = solution[0].length;

    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            s += solution[yMax - y - 1][x];
        }
        s += '\n';
    }
    return s;
}

function solutionMirrorXYToString(solution) {
    let s = '';
    const yMax = solution.length;
    const xMax = solution[0].length;

    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            s += solution[yMax - y - 1][xMax - x - 1];
        }
        s += '\n';
    }
    return s;
}

function solutionRotateToString(solution) {
    let s = '';
    const yMax = solution.length;
    const xMax = solution[0].length;

    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            s += solution[x][y];
        }
        s += '\n';
    }
    return s;
}

function solutionRotateAndMirrorXToString(solution) {
    let s = '';
    const yMax = solution.length;
    const xMax = solution[0].length;

    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            s += solution[xMax - x - 1][y];
        }
        s += '\n';
    }
    return s;
}

function solutionRotateAndMirrorYToString(solution) {
    let s = '';
    const yMax = solution.length;
    const xMax = solution[0].length;

    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            s += solution[x][yMax - y - 1];
        }
        s += '\n';
    }
    return s;
}

function solutionRotateAndMirrorXYToString(solution) {
    let s = '';
    const yMax = solution.length;
    const xMax = solution[0].length;

    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            s += solution[xMax - x - 1][yMax - y - 1];
        }
        s += '\n';
    }
    return s;
}

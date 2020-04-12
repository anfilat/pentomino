import {ErrorAreaNotDiv5, ErrorAreaIs0, ErrorAreaGreaterFigures} from './errors.js';
import {variateFigure, figures} from './figures.js';

const figureLength = 5;

// входные данные
// items: [[имяФигуры, количествоФигур], ...]
// space: [[0, 1, 1, 0, ...],...]
// двумерный прямоугольный массив, первый индекс - y, второй - x
// ячейки, которые должны быть заполнены, обозначаются truthy
//
// выходные данные
// [{xMax, yMax, columns, rows, itemsArea, spaceArea}, ошибка]
// если для указанных входных данных нет смысла искать решение, то возвращается [null, error]
// иначе возвращается массив колонок, массив возможных рядов и массив симметрий
// формат колонки: null | {x, y} - какую ячейку представляет эта колонка (null - для колонок с номерами фигур)
// формат ряда: {figureName, subset: [columnNumber, ...]}
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

    return [
        {
            xMax,
            yMax,
            columns,
            rows,
            itemsArea: itemsCount * figureLength,
            spaceArea,
        },
        null
    ];
}

function calcItemsCount(items) {
    return items.reduce((area, [, count]) => area + count, 0);
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

    items.forEach(([figureName, count]) => {
        const variants = variateFigure(figures[figureName]);
        for (let c = 0; c < count; c++) {
            // все варианты расположения одной фигуры с учетом поворотов и смещений
            // повороты
            variants.forEach(({name, matrix}) => {
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

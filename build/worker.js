(function () {
    'use strict';

    const ErrorAreaNotDiv5 = 'The area is not divided by 5';
    const ErrorAreaIs0 = 'The area is equal 0';
    const ErrorAreaGreaterFigures = 'Area greater than the total area of the figures';

    function mirrorX(matrix) {
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

    function mirrorY(matrix) {
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

    function mirrorXY(matrix) {
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

    function rotate(matrix) {
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

    function equalMatrix(m1, m2) {
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

    function variateFigure(figure) {
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

    const figures = {
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

    const figureLength = 5;

    // входные данные
    // items: [[имяФигуры, количествоФигур], ...]
    // space: [[0, 1, 1, 0, ...],...]
    // двумерный прямоугольный массив, первый индекс - y, второй - x
    // ячейки, которые должны быть заполнены, обозначаются truthy
    //
    // выходные данные
    // [{xMax, yMax, columns, rows, mirrors, itemsArea, spaceArea}, ошибка]
    // если для указанных входных данных нет смысла искать решение, то возвращается [null, error]
    // иначе возвращается массив колонок, массив возможных рядов и массив симметрий
    // формат колонки: null | {x, y} - какую ячейку представляет эта колонка (null - для колонок с номерами фигур)
    // формат ряда: {figureName, subset: [columnNumber, ...]}
    // если space совпадает с собой при симметричных преобразованиях (горизонтальное отражение, вертикальное, поворот, ...)
    // то в mirrors содержатся эти преобразования (для определения дублирующих решений)
    function prepareData(items, space) {
        const itemsCount = calcItemsCount(items);
        const spaceArea = calcSpaceArea(space);

        if (spaceArea === 0) {
            return [null, ErrorAreaIs0];
        }
        if (spaceArea > itemsCount * figureLength) {
            return [null, ErrorAreaGreaterFigures];
        }
        if (spaceArea % figureLength !== 0) {
            return [null, ErrorAreaNotDiv5];
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

        const rotateSpace = rotate(space);
        if (equalMatrix(space, rotateSpace)) {
            mirrors.push(solutionRotateToString);
        }
        if (equalMatrix(space, mirrorX(rotateSpace))) {
            mirrors.push(solutionRotateAndMirrorXToString);
        }
        if (equalMatrix(space, mirrorY(rotateSpace))) {
            mirrors.push(solutionRotateAndMirrorYToString);
        }
        if (equalMatrix(space, mirrorXY(rotateSpace))) {
            mirrors.push(solutionRotateAndMirrorXYToString);
        }

        return mirrors;
    }

    function solutionToString(solution) {
        const s = [];
        const yMax = solution.length;
        const xMax = solution[0].length;

        for (let y = 0; y < yMax; y++) {
            for (let x = 0; x < xMax; x++) {
                s.push(solution[y][x]);
            }
        }
        return s.join('');
    }

    function solutionMirrorXToString(solution) {
        const s = [];
        const yMax = solution.length;
        const xMax = solution[0].length;

        for (let y = 0; y < yMax; y++) {
            for (let x = 0; x < xMax; x++) {
                s.push(solution[y][xMax - x - 1]);
            }
        }
        return s.join('');
    }

    function solutionMirrorYToString(solution) {
        const s = [];
        const yMax = solution.length;
        const xMax = solution[0].length;

        for (let y = 0; y < yMax; y++) {
            for (let x = 0; x < xMax; x++) {
                s.push(solution[yMax - y - 1][x]);
            }
        }
        return s.join('');
    }

    function solutionMirrorXYToString(solution) {
        const s = [];
        const yMax = solution.length;
        const xMax = solution[0].length;

        for (let y = 0; y < yMax; y++) {
            for (let x = 0; x < xMax; x++) {
                s.push(solution[yMax - y - 1][xMax - x - 1]);
            }
        }
        return s.join('');
    }

    function solutionRotateToString(solution) {
        const s = [];
        const yMax = solution.length;
        const xMax = solution[0].length;

        for (let y = 0; y < yMax; y++) {
            for (let x = 0; x < xMax; x++) {
                s.push(solution[x][y]);
            }
        }
        return s.join('');
    }

    function solutionRotateAndMirrorXToString(solution) {
        const s = [];
        const yMax = solution.length;
        const xMax = solution[0].length;

        for (let y = 0; y < yMax; y++) {
            for (let x = 0; x < xMax; x++) {
                s.push(solution[xMax - x - 1][y]);
            }
        }
        return s.join('');
    }

    function solutionRotateAndMirrorYToString(solution) {
        const s = [];
        const yMax = solution.length;
        const xMax = solution[0].length;

        for (let y = 0; y < yMax; y++) {
            for (let x = 0; x < xMax; x++) {
                s.push(solution[x][yMax - y - 1]);
            }
        }
        return s.join('');
    }

    function solutionRotateAndMirrorXYToString(solution) {
        const s = [];
        const yMax = solution.length;
        const xMax = solution[0].length;

        for (let y = 0; y < yMax; y++) {
            for (let x = 0; x < xMax; x++) {
                s.push(solution[xMax - x - 1][yMax - y - 1]);
            }
        }
        return s.join('');
    }

    class Scene {
        cPtr;
        colNum;
        rowNum;

        constructor(columns, rows, areasEqual) {
            const cols = this._createCols(columns, areasEqual);
            this._insertRows(cols, rows);
        }

        _createCols(columns, areasEqual) {
            const cols = [];

            let firstColNum = null;
            let lastCol = null;
            for (let i = 0; i < columns.length; i++) {
                const areaColumn = areasEqual || columns[i] !== null;
                const col = new Col(areaColumn);
                cols.push(col);

                if (areaColumn) {
                    if (firstColNum === null) {
                        firstColNum = i;
                    }
                    if (lastCol !== null) {
                        col.left = lastCol;
                        lastCol.right = col;
                    }
                    lastCol = col;
                }
            }
            cols[firstColNum].left = cols[cols.length - 1];
            cols[cols.length - 1].right = cols[firstColNum];

            this.cPtr = cols[firstColNum];
            this.colNum = cols.length - firstColNum;
            return cols;
        }

        _insertRows(cols, rows) {
            rows.forEach(rowData => {
                const row = new Row(rowData);
                let prevNode = null;
                rowData.subset.forEach(colIndex => {
                    prevNode = new Node(row, cols[colIndex], prevNode);
                });
            });
            this.rowNum = rows.length;
        }

        noCols() {
            return this.colNum === 0;
        }

        noRows() {
            return this.rowNum === 0;
        }

        // select column with minimal number of elements
        selectCol() {
            let mc = this.cPtr;
            let min = this.cPtr.length;
            let col = this.cPtr.right;
            while (col !== this.cPtr) {
                if (col.length < min) {
                    mc = col;
                    min = col.length;
                }
                col = col.right;
            }
            return mc;
        }

        removeCol(col) {
            if (col.length > 0) {
                let node = col.head;
                do {
                    node.removeFromRow();
                    node = node.down;
                } while (node !== col.head);
            }
            if (col.areaColumn) {
                col.left.right = col.right;
                col.right.left = col.left;
                if (this.cPtr === col) {
                    this.cPtr = col.right;
                    col.restoreCPtr = true;
                } else {
                    col.restoreCPtr = false;
                }
                this.colNum--;
            }
        }

        restoreCol(col) {
            if (col.length > 0) {
                let node = col.head;
                do {
                    node.restoreInRow();
                    node = node.down;
                } while (node !== col.head);
            }
            if (col.areaColumn) {
                col.left.right = col;
                col.right.left = col;
                if (col.restoreCPtr) {
                    this.cPtr = col;
                }
                this.colNum++;
            }
        }

        removeRow(node) {
            if (node.right !== node) {
                let delNode = node;
                do {
                    delNode.removeFromCol();
                    delNode = delNode.right;
                } while (delNode !== node);
            }
            this.rowNum--;
            return node;
        }

        restoreRow(node) {
            if (node.right !== node) {
                let restNode = node;
                do {
                    restNode.restoreInCol();
                    restNode = restNode.right;
                } while (restNode !== node);
            }
            this.rowNum++;
        }
    }

    class Node {
        left;
        right;
        up;
        down;
        row;
        col;
        restoreColHead;

        constructor(row, col, prevNode) {
            this.row = row;
            this.col = col;
            this.insertInRow(prevNode);
            this.insertInCol();
        }

        insertInRow(prevNode) {
            if (prevNode === null) {
                this.left = this;
                this.right = this;
            } else {
                this.left = prevNode;
                this.right = prevNode.right;
                this.left.right = this;
                this.right.left = this;
            }
        }

        insertInCol() {
            if (this.col.length === 0) {
                this.col.head = this;
                this.up = this;
                this.down = this;
            } else {
                this.down = this.col.head;
                this.up = this.col.head.up;
                this.up.down = this;
                this.down.up = this;
            }
            this.col.length++;
        }

        removeFromCol() {
            this.up.down = this.down;
            this.down.up = this.up;
            if (this.col.head === this) {
                this.col.head = this.down;
                this.restoreColHead = true;
            } else {
                this.restoreColHead = false;
            }
            this.col.length--;
        }

        restoreInCol() {
            this.up.down = this;
            this.down.up = this;
            if (this.restoreColHead) {
                this.col.head = this;
            }
            this.col.length++;
        }

        removeFromRow() {
            this.left.right = this.right;
            this.right.left = this.left;
        }

        restoreInRow() {
            this.left.right = this;
            this.right.left = this;
        }
    }

    function Row(rowData) {
        return rowData;
    }

    function Col(areaColumn) {
        return {
            length: 0,
            areaColumn,
            head: null,
            left: null,
            right: null,
            restoreCPtr: false,
        };
    }

    class Solver {
        xMax;
        yMax;
        areasEqual;
        columns;
        rows;
        mirrors;
        scene;
        sol;
        solution;
        solsSet;
        printSolution;
        stop;

        constructor({xMax, yMax, columns, rows, mirrors, itemsArea, spaceArea}) {
            this.xMax = xMax;
            this.yMax = yMax;
            this.areasEqual = itemsArea === spaceArea;
            this.columns = columns;
            this.rows = rows;
            this.mirrors = mirrors;
        }

        findSolutions(printSolution, stop) {
            this.printSolution = printSolution;
            this.stop = stop;
            this.scene = new Scene(this.columns, this.rows, this.areasEqual);
            this.sol = [];
            this.solution = this.newSolutionMatrix();
            this.solsSet = new Set();

            this.routineX();
        }

        routineX() {
            if (this.scene.noCols()) {
                this.saveSolution();
                return;
            }
            if (this.scene.noRows()) {
                return;
            }
            const mc = this.scene.selectCol();
            if (mc.length === 0) {
                return;
            }

            const rowStack = [];
            const colStack = [];
            let fall = mc.head;
            do {
                this.sol.push(fall.row);
                this.remove(rowStack, colStack, fall);
                this.routineX();
                if (this.stop()) {
                    return;
                }
                this.restore(rowStack, colStack);
                this.sol.pop();

                fall = fall.down;
            } while (fall !== mc.head);
        }

        remove(rowStack, colStack, fall) {
            let slide = fall;
            do {
                let deleter = slide.down;
                while (deleter !== slide) {
                    rowStack.push(this.scene.removeRow(deleter));
                    deleter = deleter.down;
                }
                colStack.push(slide.col);
                slide = slide.right;
            } while (slide !== fall);
            rowStack.push(this.scene.removeRow(fall));
            colStack.forEach(col => this.scene.removeCol(col));
        }

        restore(rowStack, colStack) {
            while (colStack.length > 0) {
                this.scene.restoreCol(colStack.pop());
            }
            while (rowStack.length > 0) {
                this.scene.restoreRow(rowStack.pop());
            }
        }

        saveSolution() {
            this.fillSolution(this.solution);
            const solution = this.solution;

            const s = this.mirrors[0](solution);
            if (this.solsSet.has(s)) {
                return;
            }

            this.solsSet.add(s);
            for (let i = 1; i < this.mirrors.length; i++) {
                this.solsSet.add(this.mirrors[i](solution));
            }

            this.returnSolution();
        }

        newSolutionMatrix() {
            const solution = [];
            for (let y = 0; y < this.yMax; y++) {
                const line = [];
                for (let x = 0; x < this.xMax; x++) {
                    line.push(' ');
                }
                solution.push(line);
            }

            return solution;
        }

        fillSolution(solution) {
            this.sol.forEach(({name, subset}) => {
                for (let i = 1; i < subset.length; i++) {
                    const {x, y} = this.columns[subset[i]];
                    solution[y][x] = name;
                }
            });
        }

        returnSolution() {
            const solution = this.newSolutionMatrix();

            this.sol.forEach(({name, subset}) => {
                const id = subset[0];
                for (let i = 1; i < subset.length; i++) {
                    const {x, y} = this.columns[subset[i]];
                    solution[y][x] = {
                        id,
                        name,
                    };
                }
            });

            this.printSolution(solution);
        }
    }

    onmessage = message => {
        const {items, space} = message.data;

        const [data, error] = prepareData(items, space);
        if (error) {
            postMessage([null, error]);
            return;
        }

        let solution = null;
        const solver = new Solver(data);
        solver.findSolutions(
            sol => solution = sol,
            () => !!solution
        );
        postMessage([solution, null]);
    };

})();

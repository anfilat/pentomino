import {Scene} from "./scene.js";

export class Solver {
    xMax;
    yMax;
    areasEqual;
    columns;
    rows;
    scene;
    sol;
    isSolution;
    printSolution;

    constructor({xMax, yMax, columns, rows, itemsArea, spaceArea}) {
        this.xMax = xMax;
        this.yMax = yMax;
        this.areasEqual = itemsArea === spaceArea;
        this.columns = columns;
        this.rows = rows;
    }

    findSolutions(printSolution) {
        this.printSolution = printSolution;
        this.scene = new Scene(this.columns, this.rows, this.areasEqual);
        this.sol = [];
        this.isSolution = false;

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
            if (this.isSolution) {
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
        this.isSolution = true;
    }

    newSolutionMatrix() {
        const solution = [];
        for (let y = 0; y < this.yMax; y++) {
            const line = [];
            for (let x = 0; x < this.xMax; x++) {
                line.push(null);
            }
            solution.push(line);
        }

        return solution;
    }
}

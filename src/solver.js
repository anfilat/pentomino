import {Scene} from "./scene.js";
import {passedTime} from "./utils.js";

export class Solver {
    xMax;
    yMax;
    columns;
    rows;
    mirrors;
    startTime;
    scene;
    sol;
    sols;
    solsSet;

    constructor({xMax, yMax, columns, rows, mirrors}) {
        this.xMax = xMax;
        this.yMax = yMax;
        this.columns = columns;
        this.rows = rows;
        this.mirrors = mirrors;
    }

    findSolutions() {
        this.startTime = new Date();

        this.scene = new Scene(this.columns, this.rows);
        this.sol = [];
        this.sols = [];
        this.solsSet = new Set();

        console.log(`\nSparse array filled in ${new Date() - this.startTime} ms.\n`);
        this.routineX();
        console.log(`\nThat's all folks. Ended in ${passedTime(this.startTime)} s.\n`);
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
            /*if (this.sols.length > 0) {
                return;
            }*/
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
        const solution = this.buildSolution();

        const s = this.mirrors[0](solution);
        if (this.solsSet.has(s)) {
            return;
        }

        this.sols.push(solution);

        this.solsSet.add(s);
        for (let i = 1; i < this.mirrors.length; i++) {
            this.solsSet.add(this.mirrors[i](solution));
        }

        console.log(`\nSolution ${this.sols.length} found in ${passedTime(this.startTime)} s:\n`);
        this.printSolution(solution);
    }

    buildSolution() {
        const solution = [];
        for (let y = 0; y < this.yMax; y++) {
            const line = [];
            for (let x = 0; x < this.xMax; x++) {
                line.push(' ');
            }
            solution.push(line);
        }

        this.sol.forEach(({name, subset}) => {
            for (let i = 1; i < subset.length; i++) {
                const {x, y} = this.columns[subset[i]];
                solution[y][x] = name;
            }
        });

        return solution;
    }

    printSolution(solution) {
        for (let y = 0; y < this.yMax; y++) {
            let s = '';
            for (let x = 0; x < this.xMax; x++) {
                s += solution[y][x];
            }
            console.log(s);
        }
    }
}

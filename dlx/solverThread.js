import { parentPort, workerData } from 'worker_threads';
import {Scene} from "./scene.js";

workerThread(workerData);

function workerThread(data) {
    parentPort.on('message', message => {
        const name = message.name;

        if (name === 'work') {
            const solver = new Solver(data);
            const solution = solver.findSolution(message.data);
            if (solution) {
                parentPort.postMessage({
                    name: 'result',
                    data: solution,
                });
            } else {
                parentPort.postMessage({name: 'ready'});
            }
        } else if (name === 'exit') {
            process.exit();
        }
    });
    parentPort.postMessage({name: 'ready'});
}

export class Solver {
    xMax;
    yMax;
    areasEqual;
    columns;
    rows;
    scene;
    sol;
    isSolution;

    constructor({xMax, yMax, columns, rows, areasEqual}) {
        this.xMax = xMax;
        this.yMax = yMax;
        this.areasEqual = areasEqual;
        this.columns = columns;
        this.rows = rows;
    }

    findSolution(rowNum) {
        this.scene = new Scene(this.columns, this.rows, this.areasEqual);
        this.sol = [];
        this.isSolution = false;

        const mc = this.scene.selectCol();
        const rowStack = [];
        const colStack = [];
        let fall = mc.head;
        for (let i = 0; i < rowNum; i++) {
            fall = fall.down;
        }
        this.sol.push(fall.row);
        this.remove(rowStack, colStack, fall);
        this.routineX();

        return this.isSolution ? this.sol : null;
    }

    routineX() {
        if (this.scene.noCols()) {
            this.isSolution = true;
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
}

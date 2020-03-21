import {Scene} from "./scene.js";
import {init2DimArray, passedTime} from "./utils.js";

export class Solver {
    colNum;
    createSubsets;
    startTime;
    subsets;
    scene;
    sol;
    sols;

    constructor(colNum, createSubsets) {
        this.colNum = colNum;
        this.createSubsets = createSubsets;
    }

    findSolutions() {
        this.startTime = new Date();

        this.subsets = this.createSubsets();
        this.scene = new Scene(this.colNum, this.subsets);
        this.sol = [];
        this.sols = [];

        console.log(`\nSparse array filled in ${new Date() - this.startTime} ms.\n`);
        this.routineX();
        console.log(`\nThat's all folks. Ended in ${passedTime(this.startTime)} s.\n`);
    }

    routineX() {
        if (this.scene.colNum === 0) {
            this.saveSolution();
            return;
        }
        if (this.scene.rowNum === 0) {
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
            this.restore(rowStack, colStack);
            this.sol.pop();

            fall = fall.down;
        } while (fall !== mc.head);
    }

    remove(rowStack, colStack, fall) {
        let slide = fall;
        do {
            let deletor = slide.down;
            while (deletor !== slide) {
                rowStack.push(this.scene.removeRow(deletor.row));
                deletor = deletor.down;
            }
            colStack.push(slide.col);
            slide = slide.right;
        } while (slide !== fall);
        rowStack.push(this.scene.removeRow(fall.row));
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

    /* save and print out solution found if it's unique */
    saveSolution() {
        const cube = [];
        for (let i = 0; i < 125; i++) {
            cube[i] = '*';
        }

        this.sol.forEach(({name}, index) => {
            const subset = this.subsets[name - 1];
            for (let i = 0; i < 5; i++) {
                cube[subset[i]] = 65 + index;
            }
        });

        if (!this.isUnique(cube)) {
            return;
        }

        this.sols.push(cube);

        console.log(`\nSolution ${this.sols.length} found in ${passedTime(this.startTime)} s:\n`);
        this.printSolution(cube);
    }

    printSolution(cube) {
        for (let y = 0; y < 5; y++) {
            let s = '\t';
            for (let z = 0; z < 5; z++) {
                for (let x = 0; x < 5; x++) {
                    s += String.fromCharCode(cube[25 * z + 5 * y + x]);
                }
                s += ' ';
            }
            console.log(s);
        }
    }

    /* rotate and reflect the solution
       and compare to already found ones
    */
    isUnique(s) {
        if (this.sols.length === 0) {
            return true;
        }

        const tr = init2DimArray(48);
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                for (let z = 0; z < 5; z++) {
                    const c = s[25 * z + 5 * y + x];
                    for (let px = 0; px < 2; px++) {
                        const X = px ? 4 - x : x;
                        for (let py = 0; py < 2; py++) {
                            const Y = py ? 4 - y : y;
                            for (let pz = 0; pz < 2; pz++) {
                                const Z = pz ? 4 - z : z;
                                tr[6 * (4 * pz + 2 * py + px)    ][25 * Z + 5 * Y + X] = c;
                                tr[6 * (4 * pz + 2 * py + px) + 1][25 * Y + 5 * X + Z] = c;
                                tr[6 * (4 * pz + 2 * py + px) + 2][25 * X + 5 * Z + Y] = c;
                                tr[6 * (4 * pz + 2 * py + px) + 3][25 * X + 5 * Y + Z] = c;
                                tr[6 * (4 * pz + 2 * py + px) + 4][25 * Y + 5 * Z + X] = c;
                                tr[6 * (4 * pz + 2 * py + px) + 5][25 * Z + 5 * X + Y] = c;
                            }
                        }
                    }
                }
            }
        }
        for (let i = 0; i < 48; i++) {
            for (let j = 0; j < this.sols.length; j++) {
                if (this.compareSolutions(this.sols[j], tr[i])) {
                    return false;
                }
            }
        }
        return true;
    }

    /* compare to solution string
       whether they represent the same solution
       for example, ABBAA and ACCAA
    */
    compareSolutions(s1, s2) {
        const arr = [];
        for (let i = 0; i < 125; i++) {
            arr[i] = 100 * (s1[i] - 65) + (s2[i] - 65);
        }

        arr.sort((a, b) => a - b);

        let num = 1;
        for (let i = 1; i < 125; i++) {
            if (arr[i] !== arr[i - 1]) {
                num++;
            }
        }

        return num === 25;
    }
}

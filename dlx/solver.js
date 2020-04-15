import {Worker} from 'worker_threads';
import os from 'os';
import {Scene} from "./scene.js";

export class Solver {
    xMax;
    yMax;
    areasEqual;
    columns;
    rows;

    constructor({xMax, yMax, columns, rows, itemsArea, spaceArea}) {
        this.xMax = xMax;
        this.yMax = yMax;
        this.areasEqual = itemsArea === spaceArea;
        this.columns = columns;
        this.rows = rows;
    }

    async findSolution() {
        const tasks = this.getTasks();
        const sol = await this.getSolution(tasks);
        return sol ? this.fillSolution(sol) : null;
    }

    getTasks() {
        const scene = new Scene(this.columns, this.rows, this.areasEqual);
        const mc = scene.selectCol();
        if (mc.length === 0) {
            return;
        }

        const tasks = [];
        let rowNum = 0;
        let fall = mc.head;
        do {
            // с какого ряда стартовать поиск решения
            tasks.push(rowNum);
            rowNum++;
            fall = fall.down;
        } while (fall !== mc.head);

        return tasks;
    }

    async getSolution(tasks) {
        return new Promise(resolve => {
            const workerData = {
                xMax: this.xMax,
                yMax: this.yMax,
                columns: this.columns,
                rows: this.rows,
                areasEqual: this.areasEqual
            };
            const size = os.cpus().length - 1;
            const workers = new Set();
            let ind = 0;

            for (let i = 0; i < size; i++) {
                const worker = new Worker('./dlx/solverThread.js', {workerData});

                worker.on('message', message => {
                    const name = message.name;

                    if (name === 'ready') {
                        if (ind < tasks.length) {
                            const data = tasks[ind];
                            ind++;
                            worker.postMessage({name: 'work', data});
                        } else {
                            worker.postMessage({name: 'exit'});
                        }
                    }
                    if (name === 'result') {
                        workers.forEach(worker => worker.terminate());
                        resolve(message.data);
                    }
                });
                worker.on('exit', () => {
                    workers.delete(worker);
                    if (workers.size === 0) {
                        resolve();
                    }
                });

                workers.add(worker);
            }
        });
    }

    fillSolution(sol) {
        const solution = this.makeSolutionMatrix();

        sol.forEach(({name, subset}) => {
            const id = subset[0];
            for (let i = 1; i < subset.length; i++) {
                const {x, y} = this.columns[subset[i]];
                solution[y][x] = {
                    id,
                    name,
                };
            }
        });

        return solution;
    }

    makeSolutionMatrix() {
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

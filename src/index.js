import {Solver} from './solver.js';
import {prepareData} from './pentamino.js';

//const items = {I: 2, N: 2, L: 2, U: 2, X: 2, W: 2, P: 2, F: 2, Z: 2, T: 2, V: 2, Y: 2};
const items = {I: 1, N: 1, L: 1, U: 1, X: 1, W: 1, P: 1, F: 1, Z: 1, T: 1, V: 1, Y: 1};
const space = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
];

const [data, error] = prepareData(items, space);
if (error) {
    console.log(error.message);
    process.exit();
}

const solver = new Solver(data);
solver.findSolutions(printSolution);

function printSolution(solution) {
    for (let y = 0; y < this.yMax; y++) {
        let s = '';
        for (let x = 0; x < this.xMax; x++) {
            s += solution[y][x];
        }
        console.log(s);
    }
}

import {Solver} from './solver.js';
import {prepareData} from './pentamino.js';

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
solver.findSolutions();

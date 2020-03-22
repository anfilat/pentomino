import {Solver} from './solver.js';
import {createSubsets25} from './subsets25.js';

const solver = new Solver(125, createSubsets25);
solver.findSolutions();

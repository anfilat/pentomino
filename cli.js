import {getParams, printHelp, printSolution, passedTime} from "./cliSrc/index.js";
import {prepareData, Solver} from "./dlx/index.js";

const {err, findAll, items, space} = getParams();

if (err) {
    printHelp();
    process.exit(1);
}

const startTime = new Date();
let solsCount = 0;

const [data, error] = prepareData(items, space);
if (error) {
    console.log(error.message);
    process.exit(1);
}
const solver = new Solver(data);
solver.findSolutions(
    (solution) => {
        solsCount++;
        if (findAll) {
            console.log(`\nSolution ${solsCount} found in ${passedTime(startTime)} s:\n`);
        }
        printSolution(solution);
    },
    findAll ? stopAll : stopOne
);
console.log(`\nEnded in ${passedTime(startTime)} s.\n`);

function stopOne() {
    return solsCount > 0;
}

function stopAll() {
    return false;
}

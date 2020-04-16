import {getParams, printHelp, printSolution, passedTime} from "./cliSrc/index.js";
import {prepareData, Solver, isItemsUnique} from "./dlx/index.js";

const startTime = new Date();

const {err, findAll, items, space} = getParams(process.argv.slice(2));
if (err) {
    printHelp();
    process.exit(1);
}

const [data, error] = prepareData(items, space);
if (error) {
    console.log('Error:', error.message);
    process.exit(1);
}

const itemsUnique = isItemsUnique(items);
const solver = new Solver(data);
let solsCount = 0;
solver.findSolutions(
    (solution) => {
        solsCount++;
        if (findAll) {
            console.log(`\nSolution ${solsCount} found in ${passedTime(startTime)} s:\n`);
        }
        printSolution(solution, itemsUnique);
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

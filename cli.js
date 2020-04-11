import {getParams, isItemsUnique, printHelp, printSolution, passedTime} from "./cliSrc/index.js";
import {prepareData, Solver} from "./dlx/index.js";

const startTime = new Date();

const {err, findAll, items, space} = getParams();
if (err) {
    printHelp();
    process.exit(1);
}

const [data, error] = prepareData(items, space);
if (error) {
    console.log(error.message);
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

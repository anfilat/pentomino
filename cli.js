import {getParams, isItemsUnique, printHelp, printSolution, passedTime} from "./cliSrc/index.js";
import {prepareData, Solver} from "./dlx/index.js";

const startTime = new Date();

const {err, items, space} = getParams(process.argv.slice(2));
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
solver.findSolutions(
    (solution) => {
        printSolution(solution, itemsUnique);
    }
);
console.log(`\nEnded in ${passedTime(startTime)} s.\n`);

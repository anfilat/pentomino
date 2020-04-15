import {getParams, isItemsUnique, printHelp, printSolution, passedTime} from "./cliSrc/index.js";
import {prepareData, Solver} from "./dlx/index.js";

(async () => {
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

    const solver = new Solver(data);
    const solution = await solver.findSolution();
    if (solution) {
        const itemsUnique = isItemsUnique(items);
        printSolution(solution, itemsUnique);
    }
    console.log(`\nEnded in ${passedTime(startTime)} s.\n`);
})();

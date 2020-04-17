import {prepareData, Solver} from "../../dlx";

onmessage = function(e) {
    const {items, space} = e.data;

    const [data, error] = prepareData(items, space);
    if (error) {
        postMessage([null, error]);
        return;
    }

    const solver = new Solver(data);
    let isSolution = false;
    solver.findSolutions(
        (sol) => {
            isSolution = true;
            postMessage([sol, null]);
        },
        () => isSolution
    );
}

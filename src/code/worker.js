import {prepareData, Solver} from "../../dlx";

onmessage = message => {
    const {items, space} = message.data;

    const [data, error] = prepareData(items, space);
    if (error) {
        postMessage([null, error]);
        return;
    }

    let solution = null;
    const solver = new Solver(data);
    solver.findSolutions(
        sol => solution = sol,
        () => !!solution
    );
    postMessage([solution, null]);
}

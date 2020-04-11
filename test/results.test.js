import {getParams} from "../cliSrc/index.js";
import {prepareData, Solver} from "../dlx/index.js";

describe('нахождение решений', () => {
    it('находит решение для области 2x5', () => {
        const {items, space} = getParams(['./examples/small.json']);
        const [data] = prepareData(items, space);
        let sol;
        let solsCount = 0;
        new Solver(data)
            .findSolutions(
                (solution) => {
                    solsCount++;
                    sol = solution;
                },
                () => solsCount > 0
            );

        expect(sol).toEqual([[
            {"id": 0, "name": "I"},
            {"id": 0, "name": "I"},
            {"id": 0, "name": "I"},
            {"id": 0, "name": "I"},
            {"id": 0, "name": "I"}
        ], [
            {"id": 1, "name": "I"},
            {"id": 1, "name": "I"},
            {"id": 1, "name": "I"},
            {"id": 1, "name": "I"},
            {"id": 1, "name": "I"}
        ]
        ]);
    });

    it('находит решение для шахматной доски', () => {
        const {items, space} = getParams(['./examples/chess.json']);
        const [data] = prepareData(items, space);
        let sol;
        let solsCount = 0;
        new Solver(data)
            .findSolutions(
                (solution) => {
                    solsCount++;
                    sol = solution;
                },
                () => solsCount > 0
            );

        const yMax = space.length;
        const xMax = space[0].length;

        // размеры решения и доски совпадают
        expect(yMax).toEqual(sol.length);
        expect(xMax).toEqual(sol[0].length);

        // решение покрывает все доступные ячейки и не залезает в недоступные
        for (let y = 0; y < yMax; y++) {
            for (let x = 0; x < xMax; x++) {
                const cell = sol[y][x];

                if (typeof cell === 'object') {
                    expect(space[y][x]).toBeTruthy();
                } else {
                    expect(space[y][x]).toBeFalsy();
                }
            }
        }

        // в решении участвуют все фигуры и каждая фигура покрывает 5 ячеек
        const figures = {};
        for (let y = 0; y < yMax; y++) {
            for (let x = 0; x < xMax; x++) {
                const cell = sol[y][x];

                if (typeof cell === 'object') {
                    const name = cell.name;
                    const count = figures[name] || 0;
                    figures[name] = count + 1;
                }
            }
        }
        expect(figures).toEqual({"I": 5, "N": 5, "L": 5, "U": 5, "X": 5, "W": 5, "P": 5, "F": 5, "Z": 5, "T": 5, "V": 5, "Y": 5});
    });

    it('находит все решения', () => {
        const {items, space} = getParams(['-a', './examples/small.json']);
        const [data] = prepareData(items, space);
        let solsCount = 0;
        new Solver(data)
            .findSolutions(
                () => {
                    solsCount++;
                },
                () => false
            );

        expect(solsCount).toEqual(2);
    });
});

import fs from 'fs';
import chalk from 'chalk';
import {Solver, prepareData, passedTime, figures} from "./src/index.js";

const argv = process.argv.slice(2);

let findAll = false;
let items;
let space;
let fileName;

if (argv[0] === '-a') {
    findAll = true;
    fileName = argv[1];
} else {
    fileName = argv[0];
}

if (!fileName) {
    printHelp();
}
try {
    const options = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    items = options.items;
    space = options.space;
} catch {
    printHelp();
}

if (typeof items === 'number') {
    const count = items;
    items = {};
    'INLUXWPFZTVY'.split('').forEach(c => items[c] = count);
}

if (space.length === 2 && typeof space[0] === 'number') {
    const [yMax, xMax] = space;

    space = [];
    for (let y = 0; y < yMax; y++) {
        const line = [];
        for (let x = 0; x < xMax; x++) {
            line.push(1);
        }
        space.push(line);
    }
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

function printSolution(solution) {
    const yMax = solution.length;
    const xMax = solution[0].length;

    const color = chalk.level === 3 ? bgTrueColor : bgBasicColor;

    for (let y = 0; y < yMax; y++) {
        let s = '';
        for (let x = 0; x < xMax; x++) {
            const cell = solution[y][x];

            if (typeof cell === 'object') {
                s += color(cell.name);
            } else {
                s += chalk.bgWhiteBright('  ');
            }
        }
        console.log(s);
    }
}

function bgTrueColor(name) {
    return chalk.bgHex(figures[name].trueColor)('  ');
}

function bgBasicColor(name) {
    return chalk[figures[name].color]('  ');
}

function printHelp() {
    console.log('Pentamino solver. Usage:');
    console.log('node cli [-a] fileName.json');
    console.log('  fileName.json values');
    console.log('    items: number | {I: 1, Y: 2, ...} for any of INLUXWPFZTVY');
    console.log('    space: [height, width] | [[0, 1,...]...]');
    console.log();
    console.log('Examples:');
    console.log();
    console.log('Cover 2x5 square with the specified figures');
    console.log('{');
    console.log('  "items": {"I": 2, "N": 1, "L": 1, "P": 2},');
    console.log('  "space": [');
    console.log('    [1, 1, 1, 1, 1],');
    console.log('    [1, 1, 1, 1, 1]');
    console.log('  ]');
    console.log('}');
    console.log('Cover 12x10 square with two full pentamino sets');
    console.log('{');
    console.log('  "items": 2,');
    console.log('  "space": [12, 10]');
    console.log('}');
    console.log('Cover chess board with full pentamino sets');
    console.log('{');
    console.log('  "items": {"I": 1, "N": 1, "L": 1, "U": 1, "X": 1, "W": 1, "P": 1, "F": 1, "Z": 1, "T": 1, "V": 1, "Y": 1},');
    console.log('  "space": [');
    console.log('    [1, 1, 1, 1, 1, 1, 1, 1],');
    console.log('    [1, 1, 1, 1, 1, 1, 1, 1],');
    console.log('    [1, 1, 1, 1, 1, 1, 1, 1],');
    console.log('    [1, 1, 1, 0, 0, 1, 1, 1],');
    console.log('    [1, 1, 1, 0, 0, 1, 1, 1],');
    console.log('    [1, 1, 1, 1, 1, 1, 1, 1],');
    console.log('    [1, 1, 1, 1, 1, 1, 1, 1],');
    console.log('    [1, 1, 1, 1, 1, 1, 1, 1]');
    console.log('  ]');
    console.log('}');

    process.exit(1);
}

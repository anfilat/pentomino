import fs from "fs";
import {figures} from "../dlx/index.js";

export function getParams(argv) {
    let findAll = false;
    let fileName = argv[0];
    if (argv[0] === '-a') {
        findAll = true;
        fileName = argv[1];
    }
    if (!fileName) {
        return {err: true};
    }

    let items;
    let space;

    try {
        ({items, space} = JSON.parse(fs.readFileSync(fileName, 'utf8')));
    } catch {
        return {err: true};
    }

    // в поле items может быть указано сколько каких фигур или количество полных комплектов
    if (typeof items === 'number') {
        items = fillItems(items);
    }
    // с массивом пар [figureName, count] удобнее работать
    items = Object.entries(items);
    // если имяФигуры не найдено в списке figures, итем игнорируется
    // если количествоФигур <= 0, итем игнорируется
    items = items.filter(([figureName, count]) => figures[figureName] && count > 0);

    // в поле space может быть прямоугольная матрица с 0 и 1 для отметки фигуры, которую надо покрыть
    // или размеры этой матрицы (тогда ее надо полностью покрыть)
    if (space.length === 2 && typeof space[0] === 'number') {
        space = fillSpace(space[0], space[1]);
    }

    return {err: false, findAll, items, space};
}

function fillItems(count) {
    const items = {};
    'INLUXWPFZTVY'.split('').forEach(c => items[c] = count);
    return items;
}

function fillSpace(yMax, xMax) {
    const space = [];
    for (let y = 0; y < yMax; y++) {
        const line = [];
        for (let x = 0; x < xMax; x++) {
            line.push(1);
        }
        space.push(line);
    }
    return space;
}

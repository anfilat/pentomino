import {figures} from "./index.js";

// каждая фигурка пентамино присутствует не более чем в одном экземпляре
export function isItemsUnique(items) {
    return items.every(([, count]) => count === 0 || count === 1);
}

export function prepareItems(items) {
    // в поле items может быть указано сколько каких фигур или количество полных комплектов
    if (typeof items === 'number') {
        items = fillItems(items);
    }
    // с массивом пар [figureName, count] удобнее работать
    items = Object.entries(items);
    // если имяФигуры не найдено в списке figures, итем игнорируется
    // если количествоФигур <= 0, итем игнорируется
    return items.filter(([figureName, count]) => figures[figureName] && count > 0);
}

export function fillItems(count) {
    const items = {};
    'INLUXWPFZTVY'.split('').forEach(c => items[c] = count);
    return items;
}

export function prepareSpace(space) {
    // в поле space может быть прямоугольная матрица с 0 и 1 для отметки фигуры, которую надо покрыть
    // или размеры этой матрицы (тогда ее надо полностью покрыть)
    if (space.length === 2 && typeof space[0] === 'number') {
        space = fillSpace(space[0], space[1]);
    }
    return space;
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

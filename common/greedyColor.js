export function assignColors(solution) {
    const graph = buildGraph(solution);
    return greedyColor(graph);
}

// преобразует решение в граф. Ребра соединяют фигуры, граничащие по горизонтали или вертикали
function buildGraph(solution) {
    const yMax = solution.length;
    const xMax = solution[0].length;
    const items = new Map();

    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            const cell = solution[y][x];
            if (typeof cell === 'object') {
                const id = cell.id;
                let item = items.get(id);
                if (!item) {
                    item = new Set();
                    items.set(id, item);
                }
                addNeighbour(item, id, y - 1, x);
                addNeighbour(item, id, y + 1, x);
                addNeighbour(item, id, y, x - 1);
                addNeighbour(item, id, y, x + 1);
            }
        }
    }

    return items;

    function addNeighbour(item, id, y, x) {
        if (y >= 0 && y < yMax && x >= 0 && x < xMax) {
            const cell = solution[y][x];
            if (typeof cell === 'object' && cell.id !== id) {
                item.add(cell.id);
            }
        }
    }
}

// алгоритм жадной раскраски минимальным количеством цветов
function greedyColor(graph) {
    const color = new Map();

    Array.from(graph)
        .sort((a, b) => b[1].size - a[1].size)
        .forEach(([id, neighbours]) => {
            const colorList = new Set();
            neighbours.forEach(neighbour => {
                if (color.has(neighbour)) {
                    colorList.add(color.get(neighbour));
                }
            });
            color.set(id, firstAvailableColor(colorList));
        });

    return color;
}

function firstAvailableColor(colorList) {
    let i = 0;
    while (true) {
        if (!colorList.has(i)) {
            return i;
        }
        i++;
    }
}

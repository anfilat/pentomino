export class Scene {
    #rPtr;
    #rowNum;
    #cPtr;
    #colNum;

    constructor(colNum, subsets) {
        this.#rPtr = null;
        this.#rowNum = 0;
        const cols = this._createCols(colNum);
        this._insertRows(cols, subsets);
    }

    _createCols(num) {
        const cols = [];
        for (let i = 0; i < num; i++) {
            cols[i] = new Col();
            cols[i].name = i + 1;
            if (i > 0) {
                cols[i].left = cols[i - 1];
                cols[i - 1].right = cols[i];
            }
        }
        cols[0].left = cols[num - 1];
        cols[num - 1].right = cols[0];
        this.#cPtr = cols[0];
        this.#colNum = num;
        return cols;
    }

    _insertRows(cols, subsets) {
        subsets.forEach((subset, index) => {
            this.#rPtr = this._addRow(this.#rPtr, index + 1);
            for (let i = 0; i < 5; i++) {
                new Node(this.#rPtr, cols[subset[i]]);
            }
        });
        this.#rPtr = this.#rPtr.down;
    }

    _addRow(tail, name) {
        const row = new Row();
        row.name = name;
        if (tail == null) {
            row.up = row;
            row.down = row;
        } else {
            row.up = tail;
            row.down = tail.down;
            row.up.down = row;
            row.down.up = row;
        }
        this.#rowNum++;
        return row;
    }

    get colNum() {
        return this.#colNum;
    }

    get rowNum() {
        return this.#rowNum;
    }

    // select column with minimal number of elements
    selectCol() {
        let mc = this.#cPtr;
        let min = this.#cPtr.length;
        let col = this.#cPtr.right;
        while (col !== this.#cPtr) {
            if (col.length < min) {
                mc = col;
                min = col.length;
            }
            col = col.right;
        }
        return mc;
    }

    removeCol(col) {
        if (col.length > 0) {
            let node = col.head;
            do {
                node.removeFromRow();
                node = node.down;
            } while (node !== col.head);
        }
        col.left.right = col.right;
        col.right.left = col.left;
        if (this.#cPtr === col) {
            this.#cPtr = col.right;
        }
        this.#colNum--;
        return col;
    }

    restoreCol(col) {
        if (col.length > 0) {
            let node = col.head;
            do {
                node.restoreInRow();
                node = node.down;
            } while (node !== col.head);
        }
        col.left.right = col;
        col.right.left = col;
        if (col.right === this.#cPtr && col.name < col.right.name) {
            this.#cPtr = col;
        }
        this.#colNum++;
    }

    removeRow(row) {
        if (row.length > 0) {
            let node = row.head;
            do {
                node.removeFromCol();
                node = node.right;
            } while (node !== row.head);
        }
        row.up.down = row.down;
        row.down.up = row.up;
        if (this.#rPtr === row) {
            this.#rPtr = row.down;
        }
        this.#rowNum--;
        return row;
    }

    restoreRow(row) {
        if (row.length > 0) {
            let node = row.head;
            do {
                node.restoreInCol();
                node = node.right;
            } while (node !== row.head);
        }
        row.up.down = row;
        row.down.up = row;
        if (row.down === this.#rPtr && row.name < row.down.name) {
            this.#rPtr = row;
        }
        this.#rowNum++;
    }
}

class Node {
    left;
    right;
    up;
    down;
    row;
    col;

    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.insertInRow();
        this.insertInCol();
    }

    insertInRow() {
        if (this.row.length === 0) {
            this.row.head = this;
            this.left = this;
            this.right = this;
        } else {
            this.right = this.row.head;
            this.left = this.row.head.left;
            this.left.right = this;
            this.right.left = this;
        }
        this.row.length++;
    }

    insertInCol() {
        if (this.col.length === 0) {
            this.col.head = this;
            this.up = this;
            this.down = this;
        } else {
            this.down = this.col.head;
            this.up = this.col.head.up;
            this.up.down = this;
            this.down.up = this;
        }
        this.col.length++;
    }

    removeFromCol() {
        this.up.down = this.down;
        this.down.up = this.up;
        if (this.col.head === this) {
            this.col.head = this.down;
        }
        this.col.length--;
    }

    restoreInCol() {
        this.up.down = this;
        this.down.up = this;
        if (this.col.head === this.down && this.row.name < this.down.row.name) {
            this.col.head = this;
        }
        this.col.length++;
    }

    removeFromRow() {
        this.left.right = this.right;
        this.right.left = this.left;
        if (this.row.head === this) {
            this.row.head = this.right;
        }
        this.row.length--;
    }

    restoreInRow() {
        this.left.right = this;
        this.right.left = this;
        if (this.row.head === this.right && this.col.name < this.right.col.name) {
            this.row.head = this;
        }
        this.row.length++;
    }
}

function Row() {
    return {
        up: null,
        down: null,
        head: null,
        length: 0,
        name: 0,
    };
}

function Col() {
    return {
        left: null,
        right: null,
        head: null,
        length: 0,
        name: 0,
    };
}

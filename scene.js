export class Scene {
    #cPtr;
    #colNum;
    #rowNum;

    constructor(colNum, subsets) {
        this.#rowNum = 0;
        const cols = this._createCols(colNum);
        this._insertRows(cols, subsets);
    }

    _createCols(num) {
        const cols = [];

        let lastCol = null;
        for (let i = 0; i < num; i++) {
            const col = new Col();
            cols.push(col);

            if (lastCol !== null) {
                col.left = lastCol;
                lastCol.right = col;
            }
            lastCol = col;
        }
        cols[0].left = cols[cols.length - 1];
        cols[cols.length - 1].right = cols[0];

        this.#cPtr = cols[0];
        this.#colNum = num;
        return cols;
    }

    _insertRows(cols, subsets) {
        subsets.forEach(subset => {
            const row = new Row(subset);
            let prevNode = null;
            subset.forEach(colIndex => {
                prevNode = new Node(row, cols[colIndex], prevNode);
            });
            this.#rowNum++;
        });
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
            col.restoreCPtr = true;
        } else {
            col.restoreCPtr = false;
        }
        this.#colNum--;
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
        if (col.restoreCPtr) {
            this.#cPtr = col;
        }
        this.#colNum++;
    }

    removeRow(node) {
        if (node.right !== node) {
            let delNode = node;
            do {
                delNode.removeFromCol();
                delNode = delNode.right;
            } while (delNode !== node);
        }
        this.#rowNum--;
        return node;
    }

    restoreRow(node) {
        if (node.right !== node) {
            let restNode = node;
            do {
                restNode.restoreInCol();
                restNode = restNode.right;
            } while (restNode !== node);
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
    restoreColHead;

    constructor(row, col, prevNode) {
        this.row = row;
        this.col = col;
        this.insertInRow(prevNode);
        this.insertInCol();
    }

    insertInRow(prevNode) {
        if (prevNode === null) {
            this.left = this;
            this.right = this;
        } else {
            this.left = prevNode;
            this.right = prevNode.right;
            this.left.right = this;
            this.right.left = this;
        }
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
            this.restoreColHead = true;
        } else {
            this.restoreColHead = false;
        }
        this.col.length--;
    }

    restoreInCol() {
        this.up.down = this;
        this.down.up = this;
        if (this.restoreColHead) {
            this.col.head = this;
        }
        this.col.length++;
    }

    removeFromRow() {
        this.left.right = this.right;
        this.right.left = this.left;
    }

    restoreInRow() {
        this.left.right = this;
        this.right.left = this;
    }
}

function Row(subset) {
    return {
        subset,
    };
}

function Col() {
    return {
        length: 0,
        head: null,
        left: null,
        right: null,
        restoreCPtr: false,
    };
}

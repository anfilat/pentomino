export class ErrorAreaNotDiv5 extends Error {
    constructor() {
        super();
        this.message = 'The area is not divided by 5';
    }
}

export class ErrorAreaIs0 extends Error {
    constructor() {
        super();
        this.message = 'The area is 0';
    }
}

export class ErrorAreaGreaterFigures extends Error {
    constructor() {
        super();
        this.message = 'Area greater than the total area of the figures';
    }
}

export interface IVec {
    x: number;
    y: number;
    set(x: number, y: number): void;
}

export class Vec<IVec> {
    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.set(x, y);
    }

    set = (x, y) => {
        this.x = x;
        this.y = y;
    }
}

declare global {
    interface Math {
        valBetween(min: number, val: number, max: number): number;
    }
}

Math.valBetween = function(min, val, max) {
    return (Math.min(max, Math.max(min, val)));
}

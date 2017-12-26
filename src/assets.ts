import {Vec, IVec} from './utils';

export class Rect {
    pos: IVec;
    vel: IVec;
    width: number;
    height: number;

    constructor(width, height) {
        this.pos = new Vec;
        this.vel = new Vec;
        this.width = width;
        this.height = height;
    }

    get boundingRect() {
        return {
            top: this.pos.y - this.height / 2,
            left: this.pos.x - this.width / 2,
            bottom: this.pos.y + this.height / 2,
            right: this.pos.x + this.width / 2,
        };
    }
}

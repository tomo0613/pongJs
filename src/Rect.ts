import { Vector2 } from './Vector2.js';

export class Rect {
    position: Vector2;
    velocity: Vector2;
    width: number;
    height: number;
    private _boundaries = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };

    constructor(width: number, height: number) {
        this.position = new Vector2();
        this.velocity = new Vector2();
        this.width = width;
        this.height = height;

        this.calculateBoundaries();
    }

    private calculateBoundaries() {
        this._boundaries.top = this.position.y - this.height / 2;
        this._boundaries.right = this.position.x + this.width / 2;
        this._boundaries.bottom = this.position.y + this.height / 2;
        this._boundaries.left = this.position.x - this.width / 2;
    }

    get boundaries() {
        this.calculateBoundaries();

        return this._boundaries;
    }
}

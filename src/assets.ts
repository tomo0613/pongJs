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

export class CollisionHandler {
    sides = {
        x: ['right', 'left'],
        y: ['bottom', 'top'],
    };
    sideOffset: number;
    collidingSide: ''|'right'|'left'|'bottom'|'top' = '';
    oppositeSide: string;
    currentObstacle: any;
    directionSign: 1|-1;

    rectIsOverlap = (rectA, rectB) => {
        return (
            rectA.boundingRect.left < rectB.boundingRect.right &&
            rectA.boundingRect.top < rectB.boundingRect.bottom &&
            rectA.boundingRect.bottom > rectB.boundingRect.top &&
            rectA.boundingRect.right > rectB.boundingRect.left
        );
    }

    correctPosition(axis, entity, obstacle) {
        this.currentObstacle = obstacle;
        this.collidingSide = this.sides[axis][(entity.vel[axis] > 0) ? 0 : 1];
        this.oppositeSide = this.sides[axis][(entity.vel[axis] > 0) ? 1 : 0];
        this.sideOffset = entity[(axis == 'x') ? 'width' : 'height'] / 2;
        this.directionSign = this.sides[axis].indexOf(this.collidingSide) == 0 ? -1 : 1;

        entity.pos[axis] = obstacle.boundingRect[this.oppositeSide] + this.sideOffset * this.directionSign;
    }
}

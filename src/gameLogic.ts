/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import { Rect } from './Rect.js';
import { Vector2 } from './Vector2.js';
import { inputChangeObserver } from './inputHandler.js';
import { EventObserver } from './EventObserver.js';
import { AudioService } from './audioService.js';

type Axis = 'x'|'y';

const initialBallSpeed = 500;
const playerPaddleInitialSpeed = 100;
const playerPaddleSpeedEasing = 1.1;
const maxPlayerPaddleSpeed = 600;
const maxOpponentPaddleSpeed = 500;
const paddleOffset = 20;
const gameField = {
    width: 640,
    height: 480,
    get horizontalCenter() {
        return this.width / 2;
    },
    get verticalCenter() {
        return this.height / 2;
    },
};

export const scoreObserver = new EventObserver();
const ball = new Rect(10, 10);
const player = new Rect(10, 100);
const opponent = new Rect(10, 100);

export const entities = {
    ball,
    player,
    opponent,
};

const defaultPositions = {
    ball: new Vector2(gameField.horizontalCenter, gameField.verticalCenter),
    player: new Vector2(paddleOffset, gameField.verticalCenter),
    opponent: new Vector2(gameField.width - paddleOffset, gameField.verticalCenter),
};

inputChangeObserver.subscribe((commands: Set<string>) => {
    entities.player.velocity.set(
        0,
        commands.has('moveUp') ? -1 : commands.has('moveDown') ? 1 : 0,
    ).normalize().scale(playerPaddleInitialSpeed);
});

export function setDefaultState() {
    Object.entries(entities).forEach(([name, entity]) => {
        entity.velocity.set(0, 0);
        entity.position.copy(defaultPositions[name]);
    });
}

export function launchBall() {
    ball.velocity.set(
        (Math.random() > 0.5 ? 1 : -1) * initialBallSpeed,
        (Math.random() > 0.5 ? 1 : -1) * 10,
    );
}

export function updateWorld(dt: number) {
    updatePlayer(dt);
    updateBall(dt);
    updateOpponent(dt);
}

function updatePlayer(dt: number) {
    if (player.velocity.y && player.velocity.y < maxPlayerPaddleSpeed) {
        player.velocity.y *= playerPaddleSpeedEasing;
    }
    movePaddle(player, dt);
}

function updateBall(dt: number) {
    moveBallOnAxis('x', dt);
    moveBallOnAxis('y', dt);

    if (ball.position.x < 0) {
        scoreObserver.broadcast('opponent');
    }

    if (ball.position.x > gameField.width) {
        scoreObserver.broadcast('player');
    }
}

function updateOpponent(dt: number) {
    opponent.velocity.y = valueBetween(ball.velocity.y + 0.2, -maxOpponentPaddleSpeed, maxOpponentPaddleSpeed);
    movePaddle(opponent, dt);
}

function movePaddle(paddle: Rect, dt: number) {
    paddle.position.y += paddle.velocity.y * dt;

    const paddleBoundingRect = paddle.boundaries;

    if (paddleBoundingRect.top < 0) {
        paddle.position.y = 0 + paddle.height / 2;
    }
    if (paddleBoundingRect.bottom > gameField.height) {
        paddle.position.y = gameField.height - paddle.height / 2;
    }
}

function moveBallOnAxis(axis: Axis, dt: number) {
    const origin = ball.position[axis];

    ball.position[axis] += ball.velocity[axis] * dt;

    const ballBoundingRect = ball.boundaries;
    let bounce = false;

    if (boundingRectOverlaps(ballBoundingRect, player.boundaries)) {
        bounce = true;
        ball.velocity.add(player.velocity);
        AudioService.playEffect(500);
    }
    if (boundingRectOverlaps(ballBoundingRect, opponent.boundaries)) {
        bounce = true;
        AudioService.playEffect(1500);
    }
    if (ballBoundingRect.top < 0 || ballBoundingRect.bottom > gameField.height) {
        bounce = true;
    }
    if (bounce) {
        ball.position[axis] = origin;
        ball.velocity[axis] *= -1;
    }
}

function boundingRectOverlaps(boundingRectA: Rect['boundaries'], boundingRectB: Rect['boundaries']) {
    return boundingRectA.top < boundingRectB.bottom
        && boundingRectA.left < boundingRectB.right
        && boundingRectA.bottom > boundingRectB.top
        && boundingRectA.right > boundingRectB.left;
}

function valueBetween(value: number, min: number, max: number) {
    return (Math.min(max, Math.max(min, value)));
}

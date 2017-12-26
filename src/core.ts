import {Rect} from './assets';

type Entities = {
    ball: any,
    player: any,
    computer: any,
};

export class Core {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    stopped: boolean = true;
    simulationDepth: number = 0; // accumulator
    simulationStep: number = 1/240;
    prevTimeStamp: number;
    entities: Entities = {ball: null, player: null, computer: null};
    mouseY: number;
    paddleMaxSpeed: number = 700;
    paddleEasing: number = 10;
    paddleOffset: number = 50;
    listeners: any;

    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.entities.ball = new Rect(10, 10);
        this.entities.player = new Rect(10, 100);
        this.entities.computer = new Rect(10, 100);

        this.entities.player.pos.set(this.paddleOffset, this.canvas.height / 2);
        this.entities.computer.pos.set(this.canvas.width - this.paddleOffset, this.canvas.height / 2);

        canvas.addEventListener('mousemove', (e) => this.mouseY = e.offsetY);
    }

    drawRect = (rect) => {
        this.context.fillStyle = '#FFF';        
        this.context.fillRect(rect.boundingRect.left, rect.boundingRect.top, rect.width, rect.height)
    }

    drawScene = () => {
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.context.moveTo(this.canvas.width / 2, 0);
        this.context.lineTo(this.canvas.width / 2, this.canvas.height);
        this.context.strokeStyle = '#555';
        this.context.stroke();

        Object.keys(this.entities).forEach((entity) => this.drawRect(this.entities[entity]));
    }

    moveBall = (dt) => {
        this.entities.ball.pos.x += this.entities.ball.vel.x * dt;
        this.entities.ball.pos.y += this.entities.ball.vel.y * dt;
    }

    movePaddle = (paddle, dt) => {
        if (paddle.vel.y < 0 && paddle.boundingRect.top > 0 ||
            paddle.vel.y > 0 && paddle.boundingRect.bottom < this.canvas.height) {
            paddle.pos.y += paddle.vel.y * dt;
        }
    }

    applyPlayerControls = (paddle, dt) => { // TODO refactor
        paddle.vel.y = Math.valBetween(
            -this.paddleMaxSpeed, (this.mouseY - paddle.pos.y) * this.paddleEasing, this.paddleMaxSpeed
        );
    }

    applyAiControls = (paddle, dt) => {
        paddle.vel.y = Math.valBetween(
            -500, this.entities.ball.vel.y + 0.2, 500
        );
    }

    rectIsOverlap = (rectA, rectB) => {
        return (
            rectA.boundingRect.left < rectB.boundingRect.right &&
            rectA.boundingRect.top < rectB.boundingRect.bottom &&
            rectA.boundingRect.bottom > rectB.boundingRect.top &&
            rectA.boundingRect.right > rectB.boundingRect.left
        );
    }

    handleCollision = () => {
        [this.entities.player, this.entities.computer].forEach((paddle) => {
            if (this.rectIsOverlap(this.entities.ball, paddle)) {
                if (this.entities.ball.pos.x < paddle.boundingRect.left ||
                    this.entities.ball.pos.x > paddle.boundingRect.right) {
                    this.entities.ball.vel.x *= -1;
                }

                if (this.entities.ball.pos.y < paddle.boundingRect.top ||
                    this.entities.ball.pos.y > paddle.boundingRect.bottom) {
                    this.entities.ball.vel.y *= -1;
                }

                this.entities.ball.vel.y += paddle.vel.y / 2; // spin
            }
        });
        
        if (this.entities.ball.boundingRect.top < 0 || this.entities.ball.boundingRect.bottom > this.canvas.height) {
            this.entities.ball.vel.y *= -1;
        }

        if (this.entities.ball.boundingRect.left < 0 || this.entities.ball.boundingRect.right > this.canvas.width) {
            this.listeners.onScore(this.entities.ball.boundingRect.left < 0 ? 'player2' : 'player1');
            this.entities.ball.vel.x *= -1;
        }
    }

    updatePhysics = (dt) => {
        this.applyPlayerControls(this.entities.player, dt);
        this.applyAiControls(this.entities.computer, dt);
        this.moveBall(dt);
        this.movePaddle(this.entities.player, dt);
        this.movePaddle(this.entities.computer, dt);
        this.handleCollision()
    }

    simulate = (elapsedTime) => {
        this.simulationDepth += elapsedTime;

        while (this.simulationDepth > this.simulationStep) {
            this.updatePhysics(this.simulationStep);
            this.simulationDepth -= this.simulationStep;
        }
    }

    animate = (timeStamp = performance.now()) => {
        this.simulate((timeStamp - (this.prevTimeStamp || performance.now())) / 1000);
        this.drawScene();

        this.prevTimeStamp = timeStamp;

        if (!this.stopped) {
            requestAnimationFrame(this.animate);
        }
    }

    reset = () => {
        this.entities.ball.vel.set(0, 0);
        this.entities.ball.pos.set(this.canvas.width / 2, this.canvas.height / 2);
        this.entities.player.vel.set(0, 0);
        this.entities.player.pos.set(this.paddleOffset, this.canvas.height / 2);
        this.entities.computer.vel.set(0, 0);
        this.entities.computer.pos.set(this.canvas.width - this.paddleOffset, this.canvas.height / 2);
    }

    start = (velX = 200, velY = 0) => {
        this.entities.ball.vel.set(velX, velY);
        
        this.stopped = false;
        this.animate();
    };

    stop = () => {
        this.stopped = true;
    }

    setListeners = (listeners) => this.listeners = listeners;
}

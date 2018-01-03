import {Rect, CollisionHandler} from './assets';

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
    simulationCount: number = 0;
    simulationStep: number = 1/120;
    simulationLimit: number = 240;
    elapsedTime: number;
    prevTimeStamp: number;
    entities: Entities = {ball: null, player: null, computer: null};
    mouseY: number;
    paddleMaxSpeed: number = 700;
    paddleEasing: number = 10;
    paddleOffset: number = 50;
    obstacle: any;
    collisionHandler: any;
    listeners: any;
    audioContext: AudioContext;
    oscillator: any;

    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.context.fillStyle = '#FFF';

        this.entities.ball = new Rect(10, 10);
        this.entities.player = new Rect(10, 100);
        this.entities.computer = new Rect(10, 100);

        this.entities.player.pos.set(this.paddleOffset, this.canvas.height / 2);
        this.entities.computer.pos.set(this.canvas.width - this.paddleOffset, this.canvas.height / 2);

        canvas.addEventListener('mousemove', (e) => this.mouseY = e.offsetY);

        this.collisionHandler = new CollisionHandler();
        this.audioContext = new AudioContext();
    }

    drawRect = (rect) => {
        this.context.fillRect(
            Math.round(rect.boundingRect.left),
            Math.round(rect.boundingRect.top),
            rect.width,
            rect.height
        );
    }

    drawScene = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // print FPS
        // this.context.font = '16px arial';
        // this.context.fillText('FPS: ' + Math.floor(1 / this.elapsedTime), this.canvas.width - 75, 15);
        Object.keys(this.entities).forEach((entity) => this.drawRect(this.entities[entity]));
    }

    moveBall = (dt) => {
        ['x', 'y'].forEach((axis) => {
            this.entities.ball.pos[axis] += this.entities.ball.vel[axis] * dt; // move entity

            if (this.entities.ball.vel[axis]) { // if entity moved then check if collision occurred
                this.obstacle = [this.entities.player, this.entities.computer].find((entity) => {
                    return this.collisionHandler.rectIsOverlap(this.entities.ball, entity); // get colliding entity
                });
                if (this.obstacle) { // if entity is overlap then correct its position
                    this.collisionHandler.correctPosition(axis, this.entities.ball, this.obstacle);
                }
            }
        });
    }

    movePaddle = (paddle, dt) => {
        if (paddle.vel.y < 0 && paddle.boundingRect.top > 0 ||
            paddle.vel.y > 0 && paddle.boundingRect.bottom < this.canvas.height) {
            paddle.pos.y += paddle.vel.y * dt;
        }
    }

    applyPlayerControls = (paddle, dt) => { // TODO refactor
        if (!this.mouseY) return;

        paddle.vel.y = Math.valBetween(
            -this.paddleMaxSpeed, (this.mouseY - paddle.pos.y) * this.paddleEasing, this.paddleMaxSpeed
        );
    }

    applyAiControls = (paddle, dt) => {
        paddle.vel.y = Math.valBetween(-500, this.entities.ball.vel.y + 0.2, 500);
    }

    handleCollision = () => {
        if (this.collisionHandler.currentObstacle) {
            if (['left', 'right'].includes(this.collisionHandler.collidingSide)) {
                this.entities.ball.vel.x *= -1;
            }

            if (['top', 'bottom'].includes(this.collisionHandler.collidingSide)) {
                this.entities.ball.vel.y *= -1;
            }

            this.entities.ball.vel.y += this.collisionHandler.currentObstacle.vel.y / 2; // + velocity of the paddle
            this.collisionHandler.currentObstacle = null;

            this.playSound(this.entities.ball.pos.x < 100 ? 500 : 1500);
        }
        
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
        this.movePaddle(this.entities.player, dt);
        this.movePaddle(this.entities.computer, dt);
        this.moveBall(dt);
        this.handleCollision();
    }

    simulate = (elapsedTime) => {
        this.simulationCount = 0;
        this.simulationDepth += elapsedTime;

        while (this.simulationDepth > this.simulationStep) {
            this.updatePhysics(this.simulationStep);
            this.simulationDepth -= this.simulationStep;

            if (++this.simulationCount >= this.simulationLimit) {
                this.simulationDepth = 0;
                break;
            }
        }
    }

    animate = (timeStamp = performance.now()) => {
        this.elapsedTime = (timeStamp - (this.prevTimeStamp || performance.now())) / 1000;
        this.simulate(this.elapsedTime);
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

    playSound = (frequency) => {
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.connect(this.audioContext.destination);
        this.oscillator.type = 'square';
        this.oscillator.frequency.value = frequency;

        this.oscillator.start();
        this.oscillator.stop(this.audioContext.currentTime + 0.02);
    }
}

import { gameLoop } from './gameLoop.js';
import { entities, setDefaultState, updateWorld, scoreObserver, launchBall } from './gameLogic.js';
import { inputChangeObserver } from './inputHandler.js';
const canvas = document.querySelector('canvas');
const renderingContext = canvas.getContext('2d');
const instruction = document.querySelector('#instruction');
const entityList = Object.values(entities);
const score = {
    player: 0,
    opponent: 0,
};
renderingContext.fillStyle = '#FFFFFF';
scoreObserver.subscribe((playerId) => {
    gameLoop.pause();
    setDefaultState();
    score[playerId]++;
    updateScoreDisplay(playerId);
    instruction.classList.remove('hidden');
});
inputChangeObserver.subscribe((commands) => {
    if (commands.has('pause')) {
        if (gameLoop.isPaused) {
            gameLoop.start();
        }
        else {
            gameLoop.pause();
        }
    }
});
window.addEventListener('click', () => {
    if (!instruction.classList.contains('hidden') && gameLoop.isPaused) {
        instruction.classList.add('hidden');
        gameLoop.start();
        launchBall();
    }
});
gameLoop.init(drawScene, updateWorld);
setDefaultState();
drawScene();
function drawScene() {
    renderingContext.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 3; i++) {
        const { position: { x, y }, width, height } = entityList[i];
        renderingContext.fillRect(x - width / 2, y - height / 2, width, height);
    }
}
function updateScoreDisplay(playerId) {
    const scoreDisplay = document.querySelector(`#${playerId} > .score`);
    scoreDisplay.textContent = String(score[playerId]);
}
//# sourceMappingURL=main.js.map
import {Core as Game} from './core';

document.addEventListener('DOMContentLoaded', init);
const player1 = {};
const player2 = {};

function init() {
    const canvas = document.querySelector('canvas');
    const instruction = document.querySelector('#instruction');
    const game = new Game(canvas);

    game.reset();
    game.drawScene();

    game.setListeners({
        onScore: (player: 'player1'|'player2') => {
            game.stop();
            game.reset();

            updateScore(player);
            instruction.classList.remove('hidden');
        }
    });

    canvas.addEventListener('click', () => {
        if (game.stopped) {
            game.start(500);
            instruction.classList.add('hidden');
        }
    });
}

function updateScore(player) {
    const node = document.querySelector('#' + player + ' > .score');
    node.textContent = Number(node.textContent) + 1 + '';
}

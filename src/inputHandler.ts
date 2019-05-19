import { EventObserver } from './EventObserver.js';

export const inputChangeObserver = new EventObserver();
const activeCommands: Set<string> = new Set();
const browserNavigationKeys = new Set([
    ' ',
    'Home', 'End',
    'PageUp', 'PageDown',
    'ArrowUp', 'ArrowRight', 'ArrowLeft', 'ArrowDown',
]);
const controls = {
    W: 'moveUp',
    S: 'moveDown',
    // A: 'moveRight',
    // D: 'moveLeft',
    P: 'pause',
};

// eslint-disable-next-line no-multi-assign
window.onkeydown = window.onkeyup = ({key, type, repeat, preventDefault}) => {
    // prevent page scrolling
    if (browserNavigationKeys.has(key)) {
        preventDefault();
    }

    const command = controls[key.toUpperCase()];

    if (!command || repeat) {
        return;
    }

    if (type === 'keydown') {
        activeCommands.add(command);
    } else {
        activeCommands.delete(command);
    }

    inputChangeObserver.broadcast(activeCommands);
};

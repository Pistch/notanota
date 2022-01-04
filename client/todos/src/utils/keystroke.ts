import { isMac } from './env';

export const keyMap = {
    arrowUp: 'up',
    arrowDown: 'down',
    arrowRight: 'right',
    arrowLeft: 'left',
    escape: 'escape',
    enter: 'enter',
    delete: isMac() ? 'backspace' : 'delete',
};

export const modifierKeysMap = {
    alt: 'alt',
    shift: 'shift',
    meta: isMac() ? 'cmd' : 'ctrl',
};

type TKey = (typeof keyMap)[keyof typeof keyMap] |
    (typeof modifierKeysMap)[keyof typeof modifierKeysMap];

export function keystroke(...keys: TKey[]) {
    return keys.join('+');
}

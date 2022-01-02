export enum Key {
    ArrowUp = 'ArrowUp',
    ArrowDown = 'ArrowDown',
    Escape = 'Escape',
    Enter = 'Enter',
}

export interface IKeystrokeData {
    key: Key
}

export function parseKeystroke(keystroke: string): IKeystrokeData {
    return {
        key: keystroke as Key
    };
}

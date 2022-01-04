import { useEffect } from 'react';
import hotkeys from 'hotkeys-js';

hotkeys.filter = () => true;

export function useGlobalKeystroke(keystroke: string, callback: () => void) {
    useEffect(() => {
        hotkeys(keystroke, callback);

        return () => hotkeys.unbind(keystroke, callback);
    }, [callback]);
}

export *  from '../utils/keystroke';

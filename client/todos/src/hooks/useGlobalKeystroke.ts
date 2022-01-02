import { useCallback, useEffect, useMemo } from 'react';

import { parseKeystroke, Key } from '../utils/keystroke';

export function useGlobalKeystroke(keystroke: string, callback: () => void) {
    const keystrokeData = useMemo(() => parseKeystroke(keystroke), [keystroke]);
    const handler = useCallback((evt: KeyboardEvent) => {
        if (evt.key !== keystrokeData.key) {
            return;
        }

        callback();
    }, [callback, keystrokeData]);

    useEffect(() => {
        window.addEventListener('keyup', handler);

        return () => window.removeEventListener('keyup', handler);
    }, [handler]);
}

export { Key };

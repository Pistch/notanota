import { useEffect, useState, useCallback, useMemo } from 'react';

import { get, persist } from '../utils/localStorage';

export function useCommonStorage<TValue>(
    keyName: string,
    getErrorFallbackData: () => TValue,
    getEmptyFallbackData: () => TValue,
): [TValue, (newValue: TValue) => void] {
    const _storedValue = useMemo<TValue>(
        () => get(keyName, getErrorFallbackData, getEmptyFallbackData),
        [keyName, getErrorFallbackData, getEmptyFallbackData],
    );
    const [value, saveNewValueToState] = useState(_storedValue);
    const setNewState = useCallback((newValue: TValue) => {
        saveNewValueToState(newValue);
        persist(keyName, newValue);
    }, [keyName, saveNewValueToState]);
    const storageUpdatedHandler = useCallback((storageEvent: StorageEvent) => {
        if (storageEvent.key !== keyName) {
            return;
        }

        saveNewValueToState(get(keyName, getErrorFallbackData, getEmptyFallbackData));
    }, [keyName]);

    useEffect(() => {
        window.addEventListener('storage', storageUpdatedHandler);

        return () => {
            window.removeEventListener('storage', storageUpdatedHandler);
        }
    }, [storageUpdatedHandler]);

    return [value, setNewState];
}

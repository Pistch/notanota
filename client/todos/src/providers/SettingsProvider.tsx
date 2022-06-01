import React, {
    useCallback,
    useMemo,
    useState,
    PropsWithChildren,
} from 'react';

import { ISettings } from '../types';
import { DEFAULT_SETTINGS, SettingsContext } from '../hooks/useSettings';

export function SettingsProvider(props: PropsWithChildren<Record<never, never>>) {
    const [settings, _setSettings] = useState<ISettings>(DEFAULT_SETTINGS);
    const setSettings = useCallback((newValue: Partial<ISettings>) => {
        _setSettings({
            ...settings,
            ...newValue,
        });
    }, [settings, _setSettings])
    const settingsContextValue = useMemo(() => ({
        settings,
        setSettings,
    }), [settings, setSettings]);

    return (
        <SettingsContext.Provider value={settingsContextValue}>
            {props.children}
        </SettingsContext.Provider>
    );
}

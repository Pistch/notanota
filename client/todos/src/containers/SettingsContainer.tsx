import React, { useCallback } from 'react';

import { SettingsLayout } from '../components/SettingsLayout';
import { useSettings } from '../hooks/useSettings';
import {
    useGlobalKeystroke,
    keyMap,
    modifierKeysMap,
    keystroke,
} from '../hooks/useGlobalKeystroke';

export function SettingsContainer() {
    const [settings, setSettings] = useSettings('shouldShowPrivate');
    const setShouldShowPrivate = useCallback((newValue: boolean) => {
        setSettings({ shouldShowPrivate: newValue });
    }, [setSettings]);
    const toggleShouldShowPrivate = useCallback(() => {
        setShouldShowPrivate(!settings.shouldShowPrivate);
    }, [setShouldShowPrivate, settings]);

    useGlobalKeystroke(keystroke(
        modifierKeysMap.alt,
        keyMap.escape,
    ), toggleShouldShowPrivate);

    return (
        <SettingsLayout
            setShouldShowPrivate={setShouldShowPrivate}
            shouldShowPrivate={settings.shouldShowPrivate}
        />
    );
}

import React, { useCallback } from 'react';

import { SettingsLayout } from '../components/SettingsLayout';
import { useSettings } from '../hooks/useSettings';

export function SettingsContainer() {
    const [settings, setSettings] = useSettings('shouldShowPrivate');
    const setShouldShowPrivate = useCallback((newValue: boolean) => {
        setSettings({ shouldShowPrivate: newValue });
    }, [setSettings]);

    return (
        <SettingsLayout
            setShouldShowPrivate={setShouldShowPrivate}
            shouldShowPrivate={settings.shouldShowPrivate}
        />
    );
}

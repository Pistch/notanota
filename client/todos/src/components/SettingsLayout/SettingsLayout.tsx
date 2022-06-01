import React, { useCallback } from 'react';

import { PrivateIndicator } from '../PrivateIndicator';

interface ISettingsLayoutProps {
    shouldShowPrivate: boolean;
    setShouldShowPrivate: (newValue: boolean) => void;
}

export function SettingsLayout(props: ISettingsLayoutProps) {
    const { shouldShowPrivate, setShouldShowPrivate } = props;

    return (
        <PrivateIndicator
            isOn={shouldShowPrivate}
            setIsOn={setShouldShowPrivate}
        />
    );
}

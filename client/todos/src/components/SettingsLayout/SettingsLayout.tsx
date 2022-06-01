import React, { useCallback } from 'react';
import classNames from 'classnames';

import classes from './SettingsLayout.module.css';

interface ISettingsLayoutProps {
    shouldShowPrivate: boolean;
    setShouldShowPrivate: (newValue: boolean) => void;
}

export function SettingsLayout(props: ISettingsLayoutProps) {
    const { shouldShowPrivate, setShouldShowPrivate } = props;
    const handleClick = useCallback(() => {
        setShouldShowPrivate(!shouldShowPrivate);
    }, [shouldShowPrivate, setShouldShowPrivate]);

    return (
        <div
            className={classNames(classes.wrapper, {
                [classes.isActive]: props.shouldShowPrivate
            })}
            onClick={handleClick}
        >
            &nbsp;
        </div>
    )
}

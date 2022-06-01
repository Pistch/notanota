import React, { useCallback } from 'react';
import classNames from 'classnames';

import classes from './PrivateIndicator.module.css';

interface ISettingsLayoutProps {
    isOn: boolean;
    setIsOn: (newValue: boolean) => void;
    className?: string;
}

export function PrivateIndicator(props: ISettingsLayoutProps) {
    const { isOn, setIsOn, className } = props;
    const handleClick = useCallback(() => {
        setIsOn(!isOn);
    }, [isOn, setIsOn]);

    return (
        <div
            className={classNames(className, classes.wrapper, {
                [classes.isOn]: props.isOn
            })}
            onClick={handleClick}
        >
            &nbsp;
        </div>
    )
}

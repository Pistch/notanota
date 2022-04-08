import React, { PropsWithChildren } from 'react';

import classes from './AppLayout.module.css';

export function AppLayout(props: PropsWithChildren<Record<never, never>>) {
    return (
        <div className={classes.wrapper}>
            {props.children}
        </div>
    );
}

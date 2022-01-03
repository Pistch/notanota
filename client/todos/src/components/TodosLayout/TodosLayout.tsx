import React, { PropsWithChildren } from 'react';

import classes from './TodosLayout.module.css';

export function TodosLayout(props: PropsWithChildren<Record<never, never>>) {
    return (
        <div className={classes.wrapper}>
            {props.children}
        </div>
    );
}

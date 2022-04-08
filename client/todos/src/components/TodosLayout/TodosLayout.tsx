import React, { PropsWithChildren } from 'react';

import classes from './TodosLayout.module.css';

export function TodosLayout(props: PropsWithChildren<Record<never, never>>) {
    return (
        <div className={classes.wrapper}>
            {props.children}
        </div>
    );
}

function Header(props: PropsWithChildren<Record<never, never>>) {
    return (
        <header className={classes.header}>
            {props.children}
        </header>
    );
}

function Input(props: PropsWithChildren<Record<never, never>>) {
    return (
        <div className={classes.mainInput}>
            {props.children}
        </div>
    );
}

function Main(props: PropsWithChildren<Record<never, never>>) {
    return (
        <main className={classes.main}>
            {props.children}
        </main>
    );
}

TodosLayout.Header = Header;
TodosLayout.Main = Main;
TodosLayout.Input = Input;

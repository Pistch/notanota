import React, { useCallback } from 'react';
import classNames from 'classnames';

import { ITodo } from '../../types';
import classes from './TodosPathItem.module.css';

export interface ITodoPathItemProps {
    todo?: ITodo;
    setCurrentRootId: (newRootId: string | null) => void;
}

export function TodosPathItem(props: ITodoPathItemProps) {
    const { todo, setCurrentRootId } = props;
    const handleClick = useCallback(() => {
        if (!todo) {
            setCurrentRootId(null);
        } else {
            setCurrentRootId(todo.id);
        }
    }, [todo, setCurrentRootId]);

    return (
        <span
            className={classNames(classes.wrapper, {
                [classes.root]: !todo
            })}
            onClick={handleClick}
        >
            {!todo ? 'Root' : todo.text}
        </span>
    );
}

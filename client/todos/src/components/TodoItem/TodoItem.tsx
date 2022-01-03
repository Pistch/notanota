import React, { useCallback } from 'react';
import classNames from 'classnames';

import { ITodo } from '../../types';
import { useGlobalKeystroke, Key } from '../../hooks/useGlobalKeystroke';
import classes from './TodoItem.module.css';

interface ITodoItemProps {
    isSelected: boolean;
    item: ITodo;
    onSelect: (id: ITodo['id']) => void;
    onDelete: (idToDelete: ITodo['id']) => void;
}

function TodoItemControls(props: ITodoItemProps) {
    const { onDelete, item } = props;
    const handleDelete = useCallback(() => {
        onDelete(item.id);
    }, [onDelete, item]);

    useGlobalKeystroke(Key.Escape, handleDelete);

    return (
        <div style={{ display: 'inline-block', marginRight: 10 }}>
            <button onClick={handleDelete}>x</button>
        </div>
    );
}

export function TodoItem(props: ITodoItemProps) {
    const { onSelect, isSelected, item } = props;
    const handleMouseEnter = useCallback(() => {
        props.onSelect(props.item.id);
    }, [item, onSelect]);

    return (
        <li
            className={classNames({
                [classes.selected]: isSelected,
            })}
            onMouseEnter={handleMouseEnter}
        >
            <span>{item.text}</span>
            {isSelected && (
                <TodoItemControls {...props} />
            )}
        </li>
    );
}

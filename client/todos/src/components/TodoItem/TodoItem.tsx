import React, { useCallback } from 'react';
import classNames from 'classnames';

import { ITodo } from '../../types';
import { useGlobalKeystroke, Key } from '../../hooks/useGlobalKeystroke';
import { TodoList } from '../TodoList';
import classes from './TodoItem.module.css';

interface ITodoItemProps {
    item: ITodo;
    selectedItemId: string | null;
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
    const { onSelect, selectedItemId, item } = props;
    const isSelected = selectedItemId === item.id;
    const handleMouseEnter = useCallback(() => {
        onSelect(item.id);
    }, [item, onSelect]);

    return (
        <li
            className={classNames(classes.wrapper, {
                [classes.selected]: isSelected,
            })}
        >
            <div
                className={classes.item}
                onMouseEnter={handleMouseEnter}
            >
                <span className={classes.itemText}>{item.text}</span>
                {isSelected && (
                    <TodoItemControls {...props} />
                )}
            </div>
            {item.children.length > 0 && (
                <TodoList
                    onSelect={onSelect}
                    onDelete={props.onDelete}
                    selectedItemId={selectedItemId}
                    todos={item.children}
                />
            )}
        </li>
    );
}

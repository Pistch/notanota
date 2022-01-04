import React, { useCallback } from 'react';
import classNames from 'classnames';

import { ITodo } from '../../types';
import { useGlobalKeystroke, keyMap, modifierKeysMap, keystroke } from '../../hooks/useGlobalKeystroke';
import { TodoList } from '../TodoList';
import classes from './TodoItem.module.css';

interface ITodoItemProps {
    item: ITodo;
    level: number;
    selectedItemId: string | null;
    setCurrentRootId: (newRootId: ITodo['id']) => void;
    moveTodoUp: (todo: ITodo) => void;
    moveTodoDown: (todo: ITodo) => void;
    onSelect: (id: ITodo['id']) => void;
    onDelete: (idToDelete: ITodo['id']) => void;
}

interface ITodoItemKeystrokesProps {
    item: ITodo;
    onDelete: () => void;
    onRootChange: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
}

function TodoItemKeystrokes(props: ITodoItemKeystrokesProps) {
    useGlobalKeystroke(keystroke(modifierKeysMap.meta, keyMap.delete), props.onDelete);
    useGlobalKeystroke(keystroke(modifierKeysMap.meta, keyMap.arrowUp), props.onMoveUp);
    useGlobalKeystroke(keystroke(modifierKeysMap.meta, keyMap.arrowDown), props.onMoveDown);
    useGlobalKeystroke(keystroke(modifierKeysMap.meta, keyMap.delete), props.onDelete);
    useGlobalKeystroke(keyMap.enter, props.onRootChange);

    return null;
}

function TodoItemControls(props: ITodoItemProps) {
    const {
        onDelete,
        setCurrentRootId,
        item,
        selectedItemId,
        moveTodoDown,
        moveTodoUp,
    } = props;
    const handleDelete = useCallback(() => {
        onDelete(item.id);
    }, [onDelete, item]);
    const handleCurrentRootChange = useCallback(() => {
        setCurrentRootId(item.id);
    }, [setCurrentRootId, item]);
    const handleMoveTodoDown = useCallback(() => {
        moveTodoDown(item);
    }, [moveTodoDown, item]);
    const handleMoveTodoUp = useCallback(() => {
        moveTodoUp(item);
    }, [moveTodoUp, item]);

    return (
        <div className={classes.controls}>
            {item.id === selectedItemId && (
                <TodoItemKeystrokes
                    item={item}
                    onDelete={handleDelete}
                    onRootChange={handleCurrentRootChange}
                    onMoveDown={handleMoveTodoDown}
                    onMoveUp={handleMoveTodoUp}
                />
            )}
            <button onClick={handleCurrentRootChange}>select</button>
            <button onClick={handleDelete}>x</button>
        </div>
    );
}

export function TodoItem(props: ITodoItemProps) {
    const { onSelect, selectedItemId, item, setCurrentRootId, level } = props;
    const isSelected = selectedItemId === item.id;
    const handleMouseEnter = useCallback(() => {
        onSelect(item.id);
    }, [item, onSelect]);
    const handleCurrentRootChange = useCallback(() => {
        setCurrentRootId(item.id);
    }, [setCurrentRootId, item]);

    return (
        <li className={classes.wrapper}>
            <div
                className={classNames(classes.item, {
                    [classes.selected]: isSelected,
                })}
                onMouseEnter={handleMouseEnter}
            >
                <span className={classes.itemText}>
                    {item.text}
                </span>
                <TodoItemControls {...props} />
            </div>
            {item.children.length > 0 && (
                level > 2 ? (
                    <button onClick={handleCurrentRootChange}>...</button>
                ) : (
                    <TodoList
                        level={level + 1}
                        onSelect={onSelect}
                        onDelete={props.onDelete}
                        moveTodoUp={props.moveTodoUp}
                        moveTodoDown={props.moveTodoDown}
                        setCurrentRootId={setCurrentRootId}
                        selectedItemId={selectedItemId}
                        todos={item.children}
                    />
                )
            )}
        </li>
    );
}

import React from 'react';

import { ITodo } from '../../types';
import { TodoItem } from '../TodoItem';

interface ITodoListProps {
    level: number;
    todos: ITodo[];
    selectedItemId: string | null;
    onSelect: (id: ITodo['id']) => void;
    onDelete: (idToDelete: ITodo['id']) => void;
    setCurrentRootId: (newRootId: ITodo['id']) => void;
}

export function TodoList(props: ITodoListProps) {
    return (
        <ul>
            {props.todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    item={todo}
                    level={props.level}
                    setCurrentRootId={props.setCurrentRootId}
                    selectedItemId={props.selectedItemId}
                    onSelect={props.onSelect}
                    onDelete={props.onDelete}
                />
            ))}
        </ul>
    )
}

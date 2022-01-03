import React, { useCallback, useState } from 'react';

import { TodosLayout } from '../components/TodosLayout';
import { TodoList } from '../components/TodoList';
import { MainInput } from '../components/MainInput';
import { extractId } from '../utils/todo';
import { useOrderedList } from '../hooks/useOrderedList';
import { useTodosState } from '../hooks/useTodosState';
import { useGlobalKeystroke, Key } from '../hooks/useGlobalKeystroke';

export function TodosContainer() {
    const { todosList, deleteTodo, addTodo } = useTodosState();
    const {
        selectedId,
        selectPrevious,
        selectNext,
        selectItemById,
    } = useOrderedList(todosList, extractId);

    useGlobalKeystroke(Key.ArrowDown, selectNext);
    useGlobalKeystroke(Key.ArrowUp, selectPrevious);

    return (
        <TodosLayout>
            <MainInput
                placeholder="e.g. 'wash dishes'"
                onSubmit={addTodo}
            />

            <TodoList
                onSelect={selectItemById}
                onDelete={deleteTodo}
                selectedItemId={selectedId}
                todos={todosList}
            />
        </TodosLayout>
    );
}

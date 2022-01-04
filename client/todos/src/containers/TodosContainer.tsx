import React, { useState, useCallback } from 'react';

import { TodosLayout } from '../components/TodosLayout';
import { TodosPath } from '../components/TodosPath';
import { TodoList } from '../components/TodoList';
import { MainInput } from '../components/MainInput';
import { extractId } from '../utils/todo';
import { useOrderedList } from '../hooks/useOrderedList';
import { useTodosState } from '../hooks/useTodosState';
import { useGlobalKeystroke, keyMap } from '../hooks/useGlobalKeystroke';

export function TodosContainer() {
    const [currentRootId, setCurrentRootId] = useState<string | null>(null);
    const { todosTree, pathToRoot, deleteTodo, addTodo } = useTodosState(currentRootId);
    const {
        selectedId,
        selectPrevious,
        selectNext,
        selectItemById,
    } = useOrderedList(todosTree, extractId);

    const goUpLevel = useCallback(() => {
        if (pathToRoot.length === 1) {
            setCurrentRootId(null);
        } else if (pathToRoot.length > 1) {
            setCurrentRootId(pathToRoot[1].id);
        }
    }, [pathToRoot, setCurrentRootId]);

    useGlobalKeystroke(keyMap.arrowDown, selectNext);
    useGlobalKeystroke(keyMap.arrowUp, selectPrevious);
    useGlobalKeystroke(keyMap.escape, goUpLevel);

    return (
        <TodosLayout>
            <TodosPath pathToRoot={pathToRoot} setCurrentRootId={setCurrentRootId} />

            <MainInput
                placeholder="e.g. 'wash dishes'"
                onSubmit={addTodo}
            />

            <TodoList
                level={0}
                onSelect={selectItemById}
                onDelete={deleteTodo}
                selectedItemId={selectedId}
                setCurrentRootId={setCurrentRootId}
                todos={todosTree}
            />
        </TodosLayout>
    );
}

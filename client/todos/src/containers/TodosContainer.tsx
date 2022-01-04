import React, { useState, useCallback } from 'react';

import { TodosLayout } from '../components/TodosLayout';
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
            setCurrentRootId(pathToRoot[0].id);
        }
    }, [pathToRoot, setCurrentRootId]);

    useGlobalKeystroke(keyMap.arrowDown, selectNext);
    useGlobalKeystroke(keyMap.arrowUp, selectPrevious);
    useGlobalKeystroke(keyMap.escape, goUpLevel);

    return (
        <TodosLayout>
            {pathToRoot.length > 0 && (
                <div>
                    <i onClick={() => setCurrentRootId(null)}>
                        Root
                    </i>
                    {pathToRoot.reverse().map(todo => (
                        <span
                            key={todo.id}
                            onClick={() => setCurrentRootId(todo.id)}
                        >
                           / {todo.text}
                        </span>
                    ))}
                </div>
            )}

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

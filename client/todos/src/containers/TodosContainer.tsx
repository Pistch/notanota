import React, { useState } from 'react';

import { TodosLayout } from '../components/TodosLayout';
import { TodoList } from '../components/TodoList';
import { MainInput } from '../components/MainInput';
import { extractId } from '../utils/todo';
import { useOrderedList } from '../hooks/useOrderedList';
import { useTodosState } from '../hooks/useTodosState';
import { useGlobalKeystroke, Key } from '../hooks/useGlobalKeystroke';

export function TodosContainer() {
    const [currentRootId, setCurrentRootId] = useState<string | null>(null);
    const { todosTree, pathToRoot, deleteTodo, addTodo } = useTodosState(currentRootId);
    const {
        selectedId,
        selectPrevious,
        selectNext,
        selectItemById,
    } = useOrderedList(todosTree, extractId);

    useGlobalKeystroke(Key.ArrowDown, selectNext);
    useGlobalKeystroke(Key.ArrowUp, selectPrevious);

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

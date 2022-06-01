import React, { useState, useCallback } from 'react';

import { TodosLayout } from '../components/TodosLayout';
import { TodosPath } from '../components/TodosPath';
import { TodoList } from '../components/TodoList';
import { MainInput } from '../components/MainInput';
import { extractId } from '../utils/todo';
import { useOrderedList } from '../hooks/useOrderedList';
import { useTodosState } from '../hooks/useTodosState';
import { useSettings } from '../hooks/useSettings';
import { useGlobalKeystroke, keyMap } from '../hooks/useGlobalKeystroke';

export function TodosContainer() {
    const [currentRootId, setCurrentRootId] = useState<string | null>(null);
    const [{ shouldShowPrivate }] = useSettings('shouldShowPrivate');
    const {
        todosTree,
        pathToRoot,
        deleteTodo,
        addTodo,
        modifyTodo,
        moveTodoDown,
        moveTodoUp,
    } = useTodosState(currentRootId, shouldShowPrivate);
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
            <TodosLayout.Header>
                <TodosPath pathToRoot={pathToRoot} setCurrentRootId={setCurrentRootId} />
                <TodosLayout.Input>
                    <MainInput
                        placeholder="e.g. 'wash dishes'"
                        onSubmit={addTodo}
                    />
                </TodosLayout.Input>
            </TodosLayout.Header>

            <TodosLayout.Main>
                <TodoList
                    level={0}
                    onSelect={selectItemById}
                    onDelete={deleteTodo}
                    onModify={modifyTodo}
                    selectedItemId={selectedId}
                    setCurrentRootId={setCurrentRootId}
                    moveTodoUp={moveTodoUp}
                    moveTodoDown={moveTodoDown}
                    todos={todosTree}
                />
            </TodosLayout.Main>
        </TodosLayout>
    );
}

import React, { useCallback, useState } from 'react';

import { TodoList } from '../components/TodoList';
import { extractId } from '../utils/todo';
import { useOrderedList } from '../hooks/useOrderedList';
import { useTodosState } from '../hooks/useTodosState';
import { useGlobalKeystroke, Key } from '../hooks/useGlobalKeystroke';

export function TodosContainer() {
    const { todosList, deleteTodo, addTodo } = useTodosState();
    const [inputValue, setInputValue] = useState('');
    const {
        selectedId,
        selectPrevious,
        selectNext,
        selectItemById,
    } = useOrderedList(todosList, extractId);

    const handleInputBlur = useCallback((evt) => {
        evt.target.focus();
    }, []);
    const handleInputChange = useCallback((evt) => {
        setInputValue(evt.target.value);
    }, [setInputValue]);
    const handleSubmit = useCallback(() => {
        if (!inputValue.trim()) {
            return;
        }

        addTodo(inputValue);
        setInputValue('');
    }, [addTodo, inputValue, setInputValue]);

    useGlobalKeystroke(Key.Enter, handleSubmit);
    useGlobalKeystroke(Key.ArrowDown, selectNext);
    useGlobalKeystroke(Key.ArrowUp, selectPrevious);

    return (
        <div>
            <input
                autoFocus
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
            />

            <TodoList
                onSelect={selectItemById}
                onDelete={deleteTodo}
                selectedItemId={selectedId}
                todos={todosList}
            />
        </div>
    );
}

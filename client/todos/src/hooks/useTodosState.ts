import { useState, useEffect, useCallback } from 'react';

import { ITodo } from '../types';
import { createTodo, persistTodos, getStoredTodos } from '../utils/todo';

export function useTodosState() {
    const [todosList, setList] = useState<ITodo[]>(getStoredTodos());
    const addTodo = useCallback((text: string) => {
        setList(todosList.concat(createTodo(text)));
    }, [todosList]);
    const deleteTodo = useCallback((idToDelete: ITodo['id']) => {
        setList(todosList.filter(item => item.id !== idToDelete));
    }, [todosList, setList]);

    useEffect(() => {
        persistTodos(todosList);
    }, [todosList]);

    return {
        todosList,
        addTodo,
        deleteTodo,
    }
}

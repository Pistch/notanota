import { useState, useEffect, useCallback, useMemo } from 'react';

import { IStoredTodo, ITodo } from '../types';
import {
    createTodo,
    persistTodos,
    getStoredTodos,
    buildTree,
    normalizeTree,
    prepareDefaultData,
    extractTodoFromStored,
} from '../utils/todo';

export function useTodosState(currentRootId: string | null) {
    const _storedTodos = useMemo<IStoredTodo[]>(() => getStoredTodos() || normalizeTree(prepareDefaultData(), null), []);
    const [todos, setTodos] = useState(_storedTodos);
    const todosMap = useMemo(() => {
        return todos.reduce((map, todo) => {
            map[todo.id] = todo;

            return map;
        }, {} as Record<string, IStoredTodo>);
    }, [todos]);
    const todosTree = useMemo(() => buildTree(todos, todosMap, currentRootId), [currentRootId, todos, todosMap]);
    const pathToRoot = useMemo(() => {
        if (!currentRootId) {
            return [];
        }

        const result = [];
        let item: IStoredTodo | null = todosMap[currentRootId];

        while (item) {
            result.push(item);

            if (!item.parentId) {
                item = null;
            } else {
                item = todosMap[item.parentId];
            }
        }

        return result.map(todo => extractTodoFromStored(todo));
    }, [todosMap, currentRootId]);
    const modifyCurrentList = useCallback((newValue: ITodo[]) => {
        const newCurrentList = normalizeTree(newValue, currentRootId);

        setTodos(todos
            .filter(todo => todo.parentId !== currentRootId)
            .concat(newCurrentList));
    }, [todos, setTodos, currentRootId]);
    const addTodo = useCallback((text: string) => {
        modifyCurrentList(todosTree.concat(createTodo(text)));
    }, [todosTree, modifyCurrentList]);
    const deleteTodo = useCallback((idToDelete: ITodo['id']) => {
        modifyCurrentList(todosTree.filter(item => item.id !== idToDelete));
    }, [todosTree, modifyCurrentList]);

    useEffect(() => {
        persistTodos(todos);
    }, [todos]);

    return {
        todosTree,
        pathToRoot,
        addTodo,
        deleteTodo,
    };
}

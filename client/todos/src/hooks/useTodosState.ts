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
    const modifyList = useCallback((rootId: string | null, newValue: ITodo[]) => {
        const newCurrentList = normalizeTree(newValue, rootId);

        setTodos(todos
            .filter(todo => todo.parentId !== rootId)
            .concat(newCurrentList));
    }, [todos, setTodos]);
    const addTodo = useCallback((text: string) => {
        modifyList(currentRootId, todosTree.concat(createTodo(text)));
    }, [todosTree, currentRootId]);
    const deleteTodo = useCallback((idToDelete: ITodo['id']) => {
        const parentId = todosMap[idToDelete].parentId;
        const treePartToModify = parentId === currentRootId
            ? todosTree
            : buildTree(todos, todosMap, parentId);

        modifyList(parentId, treePartToModify.filter(item => item.id !== idToDelete))
    }, [todosTree, modifyList]);

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

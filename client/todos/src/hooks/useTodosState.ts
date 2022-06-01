import { useEffect, useCallback, useMemo } from 'react';

import { IStoredTodo, ITodo } from '../types';
import {
    createTodo,
    buildTree,
    normalizeTree,
    prepareDefaultData,
    extractTodoFromStored,
    lsTodosKey,
} from '../utils/todo';
import { useCommonStorage } from './useCommonStorage';

function getTodosFromLS() {
    return normalizeTree(prepareDefaultData(), null);
}

export function useTodosState(
    currentRootId: string | null,
    shouldShowPrivate: boolean,
) {
    const [todos, setTodos] = useCommonStorage<IStoredTodo[]>(
        lsTodosKey,
        getTodosFromLS,
        getTodosFromLS,
    );
    const todosMap = useMemo(() => {
        return todos.reduce((map, todo) => {
            map[todo.id] = todo;

            return map;
        }, {} as Record<string, IStoredTodo>);
    }, [todos]);
    const todosTree = useMemo(() => buildTree(
        todos,
        todosMap,
        currentRootId,
        shouldShowPrivate,
    ), [currentRootId, todos, todosMap, shouldShowPrivate]);
    const cachedBuildTree = useCallback((rootId: string | null) => {
        return rootId === currentRootId ? todosTree : buildTree(todos, todosMap, rootId);
    }, [todos, todosMap, todosTree, currentRootId]);
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
        const newItemsMap = newCurrentList.reduce((map, todo) => {
            map[todo.id] = true;

            return map;
        }, {} as Record<string, boolean>);
        const mapOfItemsToRemove = normalizeTree(cachedBuildTree(rootId), rootId)
            .filter(todo => !newItemsMap[todo.id])
            .reduce((map, todo) => {
                map[todo.id] = true;

                return map;
            }, {} as Record<string, boolean>);

        setTodos(
            todos
                .filter(todo => todo.parentId !== rootId && !mapOfItemsToRemove[todo.id])
                .concat(newCurrentList),
        );
    }, [todos, setTodos, cachedBuildTree]);
    const addTodo = useCallback((text: string) => {
        modifyList(currentRootId, todosTree.concat(createTodo(text)));
    }, [todosTree, currentRootId, modifyList]);
    const deleteTodo = useCallback((idToDelete: ITodo['id']) => {
        const parentId = todosMap[idToDelete].parentId;
        const targetTreePart = cachedBuildTree(parentId);

        modifyList(parentId, targetTreePart.filter(item => item.id !== idToDelete));
    }, [todosMap, modifyList, cachedBuildTree]);
    const relocateTodo = useCallback((todo: ITodo, changesRequested: Partial<Pick<IStoredTodo, 'parentId' | 'previousId' | 'nextId'>>) => {
        if (Object.keys(changesRequested).length < 1) {
            return;
        }

        const storedTodo = todosMap[todo.id];
        const targetParentId = 'parentId' in changesRequested ? changesRequested.parentId as string | null : storedTodo.parentId;
        const shouldChangeParent = targetParentId !== storedTodo.parentId;
        const shouldRemoveInPlace = !shouldChangeParent;
        const shouldPlaceToTheEnd = !changesRequested.nextId && !changesRequested.previousId;
        const targetTreePart = [...cachedBuildTree(targetParentId)];

        if (shouldChangeParent) {
            modifyList(storedTodo.parentId, cachedBuildTree(storedTodo.parentId).filter(listItem => listItem.id !== todo.id));
        }

        if (shouldRemoveInPlace) {
            const currentIndex = targetTreePart.findIndex(todo => todo.id === storedTodo.id);

            targetTreePart.splice(currentIndex, 1);
        }

        if (shouldPlaceToTheEnd) {
            modifyList(targetParentId, targetTreePart.concat(todo));
        } else {
            const isLookingForPrevious = 'previousId' in changesRequested;
            const amountToShiftTargetPosition = Number(isLookingForPrevious);
            const targetIndex = targetTreePart.findIndex(todo => todo.id === (isLookingForPrevious ? changesRequested.previousId as string | null : changesRequested.nextId as string | null));

            targetTreePart.splice(targetIndex + amountToShiftTargetPosition, 0, todo);
            modifyList(targetParentId, targetTreePart);
        }
    }, [todosMap, modifyList, cachedBuildTree]);
    const moveTodoUp = useCallback((todo: ITodo) => {
        const storedTodo = todosMap[todo.id];
        const targetTreePart = cachedBuildTree(storedTodo.parentId);
        const currentTodoIndex = targetTreePart.findIndex(todo => todo.id === storedTodo.id);

        if (currentTodoIndex > 0) {
            relocateTodo(todo, { nextId: targetTreePart[currentTodoIndex - 1].id });
        }
    }, [cachedBuildTree, todosMap, relocateTodo]);
    const moveTodoDown = useCallback((todo: ITodo) => {
        const storedTodo = todosMap[todo.id];
        const targetTreePart = cachedBuildTree(storedTodo.parentId);
        const currentTodoIndex = targetTreePart.findIndex(todo => todo.id === storedTodo.id);

        if (currentTodoIndex < targetTreePart.length - 1) {
            relocateTodo(todo, { previousId: targetTreePart[currentTodoIndex + 1].id });
        }
    }, [cachedBuildTree, todosMap, relocateTodo]);
    const modifyTodo = useCallback((todoId: ITodo['id'], changes: Partial<Pick<ITodo, 'text' | 'isPrivate'>>) => {
        const parentId = todosMap[todoId].parentId;
        const targetTreePart = cachedBuildTree(parentId);

        modifyList(parentId, targetTreePart.map(todo => {
            if (todo.id !== todoId) {
                return todo;
            }

            return {
                ...todo,
                ...changes
            };
        }));
    }, [modifyList, todosMap, cachedBuildTree]);

    return {
        todosTree,
        pathToRoot,
        addTodo,
        deleteTodo,
        modifyTodo,
        relocateTodo,
        moveTodoUp,
        moveTodoDown,
    };
}

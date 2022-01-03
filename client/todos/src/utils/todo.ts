import { ITodo, IStoredTodo } from '../types';
import { uniqid } from './uniqid';
import { get, persist } from './localStorage';

const lsTodosKey = 'todos';

export function extractId(todo: ITodo) {
    return todo.id;
}

export function createTodo(text: string): ITodo {
    return {
        id: uniqid('todo'),
        text,
        children: []
    };
}

export function prepareDefaultData() {
    return [
        'Todo 1',
        'Todo 2',
        'Todo 3',
        'Todo 4',
    ].map(createTodo);
}

function extractTodoFromStored(todo: IStoredTodo, children?: ITodo[]): ITodo {
    const { nextId, previousId, parentId, ...rawTodo } = todo;

    return {
        ...rawTodo,
        children: children || [],
    };
}

function getSubtree(
    todos: IStoredTodo[],
    todosMap: Record<string, IStoredTodo>,
    parentId: string | null,
): ITodo[] {
    const listStarter = todos
        .find(todo => !todo.previousId && todo.parentId === parentId);

    if (!listStarter) {
        return [];
    }

    function getNextItem(currentItem: IStoredTodo) {
        return currentItem.nextId ? todosMap[currentItem.nextId] : null;
    }

    const result = [listStarter];
    let nextItem: IStoredTodo | null = listStarter;

    while (nextItem = getNextItem(nextItem)) {
        result.push(nextItem);
    }

    return result
        .map(todo => {
            return extractTodoFromStored(todo, getSubtree(todos, todosMap, todo.id));
        });
}

function buildTree(todos: IStoredTodo[]): ITodo[] {
    const todosMap = todos.reduce((todosMap, todo) => {
        todosMap[todo.id] = todo;

        return todosMap;
    }, {} as Record<string, IStoredTodo>);

    return getSubtree(todos, todosMap, null);
}

export function getStoredTodos() {
    const fromStorage = get<IStoredTodo[] | null>(
        lsTodosKey,
        () => [],
        () => null,
    );

    return fromStorage ? buildTree(fromStorage) : prepareDefaultData();
}

function normalizeTree(todos: ITodo[]): IStoredTodo[] {
    type TProcessingItem = { todos: ITodo[], parentId: string | null };

    const processingQueue: TProcessingItem[] = [
        { todos, parentId: null }
    ];
    const result: IStoredTodo[] = [];

    while (processingQueue.length) {
        const { todos, parentId } = processingQueue.pop() as TProcessingItem;

        todos.forEach((todo, index) => {
            const { children, id, ...rawTodo } = todo;

            if (Array.isArray(children) && children.length > 0) {
                processingQueue.push({
                    parentId: id,
                    todos: children,
                });
            }

            result.push({
                ...rawTodo,
                id,
                parentId,
                previousId: index > 0 ? todos[index - 1].id : null,
                nextId: index < todos.length - 1 ? todos[index + 1].id : null,
            });
        });
    }

    return result;
}

export function persistTodos(todos: ITodo[]) {
    persist(lsTodosKey, normalizeTree(todos));
}

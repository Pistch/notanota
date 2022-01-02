import { ITodo } from '../types';
import { uniqid } from './uniqid';
import { get, persist } from './localStorage';

const lsTodosKey = 'todos';

export function extractId(todo: ITodo) {
    return todo.id;
}

export function createTodo(text: string) {
    return {
        id: uniqid('todo'),
        text,
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

export function getStoredTodos() {
    return get<ITodo[]>(
        lsTodosKey,
        () => [],
        prepareDefaultData,
    );
}
export function persistTodos(todos: ITodo[]) {
    persist(lsTodosKey, todos);
}

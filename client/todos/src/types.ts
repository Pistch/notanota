export interface ITodoBase {
    id: string;
    text: string;
}

export interface ITodo extends ITodoBase {
    children: ITodo[];
}

export interface IStoredTodo extends ITodoBase {
    previousId: string | null;
    nextId: string | null;
    parentId: string | null;
}

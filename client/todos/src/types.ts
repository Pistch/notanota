export interface ITodoBase {
    id: string;
    text: string;
    isPrivate: boolean;
}

export interface ITodo extends ITodoBase {
    children: ITodo[];
}

export interface IStoredTodo extends ITodoBase {
    previousId: string | null;
    nextId: string | null;
    parentId: string | null;
}

export interface ISettings {
    shouldShowPrivate: boolean;
}

export type TSettingsSetter = (newSettings: Partial<ISettings>) => void;

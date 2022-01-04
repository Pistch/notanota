import React, { useMemo } from 'react';

import { ITodo } from '../../types';
import { TodosPathItem } from '../TodosPathItem';
import classes from './TodosPath.module.css';

export interface ITodoPathProps {
    pathToRoot: ITodo[];
    setCurrentRootId: (newRootId: string | null) => void;
}

export function TodosPath(props: ITodoPathProps) {
    const { pathToRoot, setCurrentRootId } = props;
    const pathFromRoot = useMemo(() => {
        const itemsQuantity = pathToRoot.length;
        const result = new Array(itemsQuantity);

        pathToRoot.forEach((item, index) => {
            result[itemsQuantity - 1 - index] = item;
        });

        return result;
    }, [pathToRoot]);

    return(
        <div className={classes.wrapper}>
            <TodosPathItem setCurrentRootId={setCurrentRootId} />
            {pathFromRoot.map(todo => (
                <TodosPathItem
                    key={todo.id}
                    todo={todo}
                    setCurrentRootId={setCurrentRootId}
                />
            ))}
        </div>
    )
}

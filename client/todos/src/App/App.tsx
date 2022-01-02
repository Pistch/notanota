import React, { useCallback, useState, useEffect } from 'react';

import { uniqid } from '../utils/uniqid';
import { useOrderedList } from '../hooks/useOrderedList';
import { useGlobalKeystroke, Key } from '../hooks/useGlobalKeystroke';
import classes from './App.module.css';

interface ITodo {
    id: string;
    text: string;
}

interface IListItemProps {
    isSelected: boolean;
    item: ITodo;
    onSelect: (id: ITodo['id']) => void;
    onDelete: (idToDelete: ITodo['id']) => void;
}

function ListItemControls(props: IListItemProps) {
    const { onDelete, item } = props;
    const handleDelete = useCallback(() => {
        onDelete(item.id);
    }, [onDelete, item]);

    useGlobalKeystroke(Key.Escape, handleDelete);

    return (
        <div style={{ display: 'inline-block', marginRight: 10 }}>
            <button onClick={handleDelete}>x</button>
        </div>
    );
}

function ListItem(props: IListItemProps) {
    const { onSelect, isSelected, item } = props;
    const handleMouseEnter = useCallback(() => {
        props.onSelect(props.item.id);
    }, [item, onSelect]);

    return (
            <li
                className={isSelected ? classes.selected : ''}
                onMouseEnter={handleMouseEnter}
            >
                <span>{item.text}</span>
                {isSelected && (
                    <ListItemControls {...props} />
                )}
            </li>
    );
}

const extractId = (todo: ITodo) => todo.id;

function createTodo(text: string) {
    return {
        id: uniqid('todo'),
        text,
    };
}

const lsKey = 'todos';

function persist(todos: ITodo[]) {
    localStorage.setItem(lsKey, JSON.stringify(todos));
}

function fillInitialList() {
    return [
        'Todo 1',
        'Todo 2',
        'Todo 3',
        'Todo 4',
    ].map(createTodo);
}

function getStoredTodos() {
    try {
        const stored = localStorage.getItem(lsKey);

        if (!stored) {
            return fillInitialList();
        }

        return JSON.parse(stored);
    } catch (_e) {
        return [];
    }
}

export function App() {
  const [list, setList] = useState<ITodo[]>(getStoredTodos());
  const [inputValue, setInputValue] = useState('');
  const {
    selectedIndex,
    selectPrevious,
    selectNext,
    selectItemById,
  } = useOrderedList(list, extractId);

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

      setList(list.concat(createTodo(inputValue)));
      setInputValue('');
  }, [list, setList, inputValue, setInputValue]);

  const handleDelete = useCallback((idToDelete: ITodo['id']) => {
      setList(list.filter(item => item.id !== idToDelete));
  }, [list, selectedIndex, setList]);

  useGlobalKeystroke(Key.Enter, handleSubmit);
  useGlobalKeystroke(Key.ArrowDown, selectNext);
  useGlobalKeystroke(Key.ArrowUp, selectPrevious);

  useEffect(() => {
      persist(list);
  }, [list]);

  return (
    <div className="App">
      <input
          autoFocus
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
      />

      <ul>
        {list.map((item, i) => (
            <ListItem
                key={item.id}
                item={item}
                isSelected={i === selectedIndex}
                onSelect={selectItemById}
                onDelete={handleDelete}
            />
        ))}
      </ul>
    </div>
  );
}

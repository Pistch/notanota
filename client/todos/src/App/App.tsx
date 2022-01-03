import React, { useCallback, useState } from 'react';

import { ITodo } from '../types';
import { extractId } from '../utils/todo';
import { useOrderedList } from '../hooks/useOrderedList';
import { useTodosState } from '../hooks/useTodosState';
import { useGlobalKeystroke, Key } from '../hooks/useGlobalKeystroke';
import classes from './App.module.css';

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

export function App() {
  const { todosList, deleteTodo, addTodo } = useTodosState();
  const [inputValue, setInputValue] = useState('');
  const {
    selectedIndex,
    selectPrevious,
    selectNext,
    selectItemById,
  } = useOrderedList(todosList, extractId);

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

      addTodo(inputValue);
      setInputValue('');
  }, [addTodo, inputValue, setInputValue]);

  useGlobalKeystroke(Key.Enter, handleSubmit);
  useGlobalKeystroke(Key.ArrowDown, selectNext);
  useGlobalKeystroke(Key.ArrowUp, selectPrevious);

  return (
    <div className="App">
      <input
          autoFocus
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
      />

      <ul>
        {todosList.map((item, i) => (
            <ListItem
                key={item.id}
                item={item}
                isSelected={i === selectedIndex}
                onSelect={selectItemById}
                onDelete={deleteTodo}
            />
        ))}
      </ul>
    </div>
  );
}

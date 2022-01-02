import React, { useCallback, useState } from 'react';

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
    onDelete: (idToDelete: ITodo['id']) => void;
}

function ListItemControls(props: IListItemProps) {
    const { onDelete, item } = props;
    const handleDelete = useCallback(() => {
        onDelete(item.id);
    }, [onDelete, item]);

    useGlobalKeystroke(Key.Escape, handleDelete);

    return null;
}

function ListItem(props: IListItemProps) {
    return (
        <React.Fragment>
            <li className={props.isSelected ? classes.selected : ''}>
                {props.item.text}
            </li>
            {props.isSelected && (
                <ListItemControls {...props} />
            )}
        </React.Fragment>
    );
}

const extractId = (todo: ITodo) => todo.id;

function createTodo(text: string) {
    return {
        id: uniqid('todo'),
        text,
    };
}

export function App() {
  const [list, setList] = useState<ITodo[]>([
      createTodo('aaaaaaa'),
      createTodo('bbbbbbb'),
      createTodo('ccccccc'),
      createTodo('ddddddd'),
      createTodo('eeeeeee'),
  ]);
  const [inputValue, setInputValue] = useState('');
  const {
    selectedIndex,
    selectPrevious,
    selectNext,
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
                onDelete={handleDelete}
            />
        ))}
      </ul>
    </div>
  );
}

import React, { useCallback, useState, useEffect, useMemo } from 'react';

import { useOrderedList } from '../hooks/useOrderedList';
import { useGlobalKeystroke, Key } from '../hooks/useGlobalKeystroke';
import classes from './App.module.css';

interface IListItemProps {
    isSelected: boolean;
    item: string;
    onDelete: (item: string) => void;
}

function ListItemControls(props: IListItemProps) {
    const { onDelete, item } = props;
    const handleDelete = useCallback(() => {
        onDelete(item);
    }, [onDelete, item]);

    useGlobalKeystroke(Key.Escape, handleDelete);

    return null;
}

function ListItem(props: IListItemProps) {
    return (
        <React.Fragment>
            <li className={props.isSelected ? classes.selected : ''}>
                {props.item}
            </li>
            {props.isSelected && (
                <ListItemControls {...props} />
            )}
        </React.Fragment>
    );
}

const extractId = (s: string) => s;

export function App() {
  const [list, setList] = useState([
      'aaaaaaa',
      'bbbbbbb',
      'ccccccc',
      'ddddddd',
      'eeeeeee',
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

      setList(list.concat(inputValue));
      setInputValue('');
  }, [list, setList, inputValue, setInputValue]);

  const handleDelete = useCallback((itemToDelete: string) => {
      setList(list.filter(item => item !== itemToDelete));
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
                key={item}
                item={item}
                isSelected={i === selectedIndex}
                onDelete={handleDelete}
            />
        ))}
      </ul>
    </div>
  );
}

import React, { useCallback, useState, useEffect, useMemo } from 'react';

import classes from './App.module.css';

function useOrderedList<TItem>(list: TItem[], getId: (item: TItem) => string) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectItemByIndex = useCallback((index: number) => {
      let realIndex = index;

      if (realIndex < 0 || realIndex > list.length - 1) {
          realIndex = -1;
      }

      setSelectedIndex(realIndex);

      if (realIndex === -1) {
          setSelectedId(null);
      } else {
          setSelectedId(getId(list[realIndex]));
      }
  }, [list, setSelectedIndex, setSelectedId, getId]);
  const selectItemById = useCallback((id: string | null) => {
      let item = null;

      if (id !== null) {
          item = list.find(item => getId(item) === id);
      }

      if (item) {
          setSelectedId(id);
          setSelectedIndex(list.indexOf(item));
      } else {
          setSelectedId(null);
          setSelectedIndex(-1);
      }
  }, [list, setSelectedIndex, setSelectedId, getId]);
  const selectNext = useCallback(() => {
      if (selectedIndex === list.length - 1) {
          selectItemByIndex(-1);
      } else {
          selectItemByIndex(selectedIndex + 1);
      }
  }, [list, selectedIndex, selectItemByIndex]);
  const selectPrevious = useCallback(() => {
      if (selectedIndex === - 1) {
          selectItemByIndex( list.length - 1);
      } else if (selectedIndex === 0) {
          selectItemByIndex(-1);
      } else {
          selectItemByIndex(selectedIndex - 1);
      }
  }, [list, selectedIndex, selectItemByIndex]);

  useEffect(() => {
      if (!selectedIndex) {
          return;
      }

      if (selectedIndex > list.length - 1) {
          const newItemIndex = list.findIndex(item => getId(item) === selectedId);

          selectItemByIndex(newItemIndex);

          return;
      }

      const isItemStillInPlace = getId(list[selectedIndex]) === selectedId;

      if (isItemStillInPlace) {
          return;
      }

      const newItemIndex = list.findIndex(item => getId(item) === selectedId);

      if (newItemIndex < 0 && selectedIndex < list.length - 1) {
          selectItemByIndex(selectedIndex);
      } else {
          selectItemByIndex(newItemIndex);
      }
  }, [list]);

  return {
    selectedId,
    selectedIndex,
    selectItemByIndex,
    selectItemById,
    selectNext,
    selectPrevious
  };
}

function parseKeystroke(keystroke: string) {
    return {
        key: keystroke
    };
}

function useGlobalKeystroke(keystroke: string, callback: () => void) {
    const keystrokeData = useMemo(() => parseKeystroke(keystroke), [keystroke]);
    const handler = useCallback((evt: KeyboardEvent) => {
        if (evt.key !== keystrokeData.key) {
            return;
        }

        callback();
    }, [callback, keystrokeData]);

    useEffect(() => {
        window.addEventListener('keyup', handler);

        return () => window.removeEventListener('keyup', handler);
    }, [handler]);
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
      setList(list.concat(inputValue));
      setInputValue('');
  }, [list, setList, inputValue, setInputValue]);

  const handleDelete = useCallback(() => {
      if (selectedIndex > -1) {
          setList(list.filter(item => item !== list[selectedIndex]));
      }
  }, [list, selectedIndex, setList]);

  useGlobalKeystroke('Enter', handleSubmit);
  useGlobalKeystroke('Escape', handleDelete);
  useGlobalKeystroke('ArrowDown', selectNext);
  useGlobalKeystroke('ArrowUp', selectPrevious);

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
            <li key={item} className={i === selectedIndex ? classes.selected : ''}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

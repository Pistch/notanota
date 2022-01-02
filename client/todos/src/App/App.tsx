import React, { useCallback, useState, useEffect, useMemo } from 'react';

import classes from './App.module.css';

function useOrderedList<TItem>(list: TItem[], getKey: (item: TItem) => string) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const selectNext = useCallback(() => {
      if (selectedIndex === list.length - 1) {
          setSelectedIndex(-1);
      } else {
          setSelectedIndex(selectedIndex + 1);
      }
  }, [list, selectedIndex, setSelectedIndex]);
  const selectPrevious = useCallback(() => {
      if (selectedIndex === - 1) {
          setSelectedIndex( list.length - 1);
      } else if (selectedIndex === 0) {
          setSelectedIndex(-1);
      } else {
          setSelectedIndex(selectedIndex - 1);
      }
  }, [list, selectedIndex, setSelectedIndex]);

  return {
    selectedIndex,
    setSelectedIndex,
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

const list = [
    'aaaaaaa',
    'bbbbbbb',
    'ccccccc',
    'ddddddd',
    'eeeeeee',
];

export function App() {
  const [inputValue, setInputValue] = useState('');
  const handleInputBlur = useCallback((evt) => {
    evt.target.focus();
  }, []);
  const handleInputChange = useCallback((evt) => {
    setInputValue(evt.target.value);
  }, []);

  const {
    selectedIndex,
    // setSelectedIndex,
    selectPrevious,
    selectNext,
  } = useOrderedList(list, s => s);

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

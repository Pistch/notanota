import React, { useCallback, useState } from 'react';

import { TodoItem } from '../components/TodoItem';
import { extractId } from '../utils/todo';
import { useOrderedList } from '../hooks/useOrderedList';
import { useTodosState } from '../hooks/useTodosState';
import { useGlobalKeystroke, Key } from '../hooks/useGlobalKeystroke';

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
            <TodoItem
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

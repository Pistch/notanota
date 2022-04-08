import React, { useCallback, useState } from 'react';

import { keyMap, useGlobalKeystroke } from '../../hooks/useGlobalKeystroke';
import classes from './MainInput.module.css';

export interface IMainInputProps {
    onSubmit: (text: string) => void;
    initialValue?: string;
    placeholder?: string;
}

export function MainInput(props: IMainInputProps) {
    const { onSubmit, placeholder } = props;
    const [inputValue, setInputValue] = useState(props.initialValue || '');
    const handleInputBlur = useCallback((evt) => {
        evt.target.focus();
    }, []);
    const handleKeyDown = useCallback((evt) => {
        if (evt.key === 'ArrowUp' || evt.key === 'ArrowDown') {
            evt.preventDefault();
        }
    }, [setInputValue]);
    const handleInputChange = useCallback((evt) => {
        setInputValue(evt.target.value);
    }, [setInputValue]);
    const handleSubmit = useCallback(() => {
        if (!inputValue.trim()) {
            return;
        }

        onSubmit(inputValue);
        setInputValue('');
    }, [inputValue, setInputValue, onSubmit]);

    useGlobalKeystroke(keyMap.enter, handleSubmit);

    return (
        <input
            autoFocus
            value={inputValue}
            placeholder={placeholder}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            className={classes.wrapper}
        />
    );
}

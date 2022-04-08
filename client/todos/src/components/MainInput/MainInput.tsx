import React, { useCallback, useState } from 'react';

import { keyMap, modifierKeysMap, keystroke, useGlobalKeystroke } from '../../hooks/useGlobalKeystroke';

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

    useGlobalKeystroke(keystroke(modifierKeysMap.meta, keyMap.enter), handleSubmit);

    return (
        <input
            autoFocus
            value={inputValue}
            placeholder={placeholder}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
        />
    );
}

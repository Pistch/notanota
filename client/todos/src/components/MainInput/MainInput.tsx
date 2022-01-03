import React, { useCallback, useState } from 'react';

import { Key, useGlobalKeystroke } from '../../hooks/useGlobalKeystroke';

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
    const handleInputChange = useCallback((evt) => {
        setInputValue(evt.target.value);
    }, [setInputValue]);
    const handleSubmit = useCallback(() => {
        if (!inputValue.trim()) {
            return;
        }

        onSubmit(inputValue);
        setInputValue('');
    }, [onSubmit]);

    useGlobalKeystroke(Key.Enter, handleSubmit);

    return (
        <input
            autoFocus
            value={inputValue}
            placeholder={placeholder}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
        />
    );
}

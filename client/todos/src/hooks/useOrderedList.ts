import { useCallback, useState, useEffect } from 'react';

export function useOrderedList<TItem>(list: TItem[], getId: (item: TItem) => string) {
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

        if (newItemIndex < 0 && selectedIndex <= list.length - 1) {
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

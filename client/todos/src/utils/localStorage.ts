export function persist(lsKey: string, data: unknown) {
    localStorage.setItem(lsKey, JSON.stringify(data));
}

export function get<TData>(
    lsKey: string,
    getErrorFallbackData: () => TData,
    getEmptyFallbackData: () => TData,
) {
    try {
        const stored = localStorage.getItem(lsKey);

        if (!stored) {
            return getEmptyFallbackData();
        }

        return JSON.parse(stored);
    } catch (_e) {
        return getErrorFallbackData();
    }
}



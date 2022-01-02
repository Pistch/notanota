export function uniqid(prefix?: string) {
    return (
        [prefix || '', Math.ceil(Math.random() * 10e10).toString(16)]
    ).join('');
}

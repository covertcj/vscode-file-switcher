export async function filter<T>(arr: T[], predicate: (value: T) => Promise<boolean>): Promise<T[]> {
    const promises = arr.map(val => {
        const res: [T, Promise<boolean>] = [val, predicate(val)];
        return res;
    });

    const results: T[] = [];
    for (const [value, promise] of promises) {
        if (await promise) {
            results.push(value);
        }
    }
    
    return results;
}

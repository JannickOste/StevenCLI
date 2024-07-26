export const deepMerge = <T extends object>(target: T, source: Partial<T>): T => {
    if (typeof target !== 'object' || target === null) {
        return source as T;
    }

    const result = { ...target } as T;

    for (const key of Object.keys(source) as (keyof T)[]) {
        const sourceValue = source[key];
        const targetValue = target[key];

        if (Array.isArray(sourceValue)) {
            if (!Array.isArray(targetValue)) {
                result[key] = [...sourceValue] as T[keyof T];
            } else {
                result[key] = [...targetValue, ...sourceValue] as T[keyof T];
            }
        } else if (typeof sourceValue === 'object' && sourceValue !== null) {
            if (typeof targetValue !== 'object' || targetValue === null) {
                result[key] = deepMerge({}, sourceValue) as T[keyof T];
            } else {
                result[key] = deepMerge(targetValue, sourceValue) as T[keyof T];
            }
        } else {
            result[key] = sourceValue as T[keyof T];
        }
    }

    return result;
};

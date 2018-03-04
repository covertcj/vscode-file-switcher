export const stripSuffixes = (path: string, strippableSuffixes: string[]) => {
    for (const suffix of strippableSuffixes) {
        const suffixRegex = new RegExp(`${suffix}$`);
        if (suffixRegex.test(path)) {
            path = path.replace(suffixRegex, '');
            break;
        }
    }

    return path;
};

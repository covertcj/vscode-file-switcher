import { access } from "fs";
import { F_OK } from "constants";

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

const extensionRegex = /(.+)\.([^.]*)/;
export const stripExtension = (path: string) => {
    return path.replace(extensionRegex, '$1');
};

export const exists = async (path: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        access(path, F_OK, (err) => {
            resolve(!err);
        });
    });
};

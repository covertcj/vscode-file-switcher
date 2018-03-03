import { fileNameCandidates, fileNameSplits } from "./pathMutations";

import { Observable } from 'rxjs/Observable';
import { concat, skip, skipWhile, takeWhile, shareReplay } from 'rxjs/operators';
import { readdir, stat } from "fs";
import { dirname } from "path";
import { filter } from "./promiseUtil";

export const getCycleCandidates = (
    path: string,
    separators: string[],
    extensions: string[]
): Observable<string> => {
    const splits$ = fileNameSplits(path, separators);
    const candidates$ = fileNameCandidates(splits$, extensions).pipe(shareReplay());

    const canditatesBeforeCurrent$ = candidates$.pipe(takeWhile(p => p !== path));
    const canditatesStartingAtCurrent$ = candidates$.pipe(skipWhile(p => p !== path));

    return canditatesStartingAtCurrent$.pipe(
        skip(1),
        concat(canditatesBeforeCurrent$)
    );
};

export const cycleExtensions = async () => {
    
};

const getSiblingFiles = async (path: string): Promise<string[]> => {
    return new Promise<string[]>((resolve, reject) => {
        readdir(dirname(path), async (err, files) => {
            if (err) { 
                reject(err);
                return;
            }

            files = await filter(files, async (file) => !await isDirectory(file));
            resolve(files);
        });
    });
};

const isDirectory = async (path: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        stat(path, (err, stats) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(stats.isDirectory());
        });
    });
};

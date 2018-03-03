import { fileNameCandidates, fileNameSplits } from "./pathMutations";

import { Observable } from 'rxjs/Observable';
import { concat, skip, skipWhile, takeWhile, shareReplay } from 'rxjs/operators';

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

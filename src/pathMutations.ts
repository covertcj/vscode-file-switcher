import { Observable } from 'rxjs';
import 'rxjs/add/operator/mergeMap';

import { fromIterable } from './observables';

function* fileNameSplitsGenerator(path: string, separators: string[]) {
    yield path;
    if (!separators || !separators.length) { return; }

    const seps = separators.reduce((acc, sep) => acc + sep);
    const lastSepRegex = new RegExp(`^(.+)[${seps}][^${seps}\/\\\\]+$`);

    while (lastSepRegex.test(path)) {
        path = path.replace(lastSepRegex, '$1');
        yield path;
    }
}

export const fileNameSplits = (path: string, separators: string[]): Observable<string> =>
    fromIterable(fileNameSplitsGenerator(path, separators));

function* candidatesForSplit(
    split: string,
    extensions: string[]
) {
    for (const ext of extensions) {
        yield `${split}${ext}`;
    }
}

export const fileNameCandidates = (
    splits: Observable<string>,
    extensions: string[]
): Observable<string> => 
    splits.mergeMap(split => fromIterable(candidatesForSplit(split, extensions)));

import * as vscode from 'vscode';
import { fileNameCandidates, fileNameSplits } from "./pathMutations";

import { Observable } from 'rxjs/Observable';
import { concat, skip, skipWhile, takeWhile, shareReplay } from 'rxjs/operators';
import { readdir, stat } from "fs";
import { dirname, join } from "path";
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
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('You must have an active editor to cycle files');
        return;
    }

    const currentFile = editor.document.fileName;
    const candidates$ = getCycleCandidates(currentFile, ['.'], ['.html', '.js', '.css']);
    const siblings = await getSiblingFiles(currentFile);

    const firstValid$ = candidates$.first(path => siblings.findIndex(file => file === path) >= 0);

    firstValid$.subscribe(next => {
        openDocument(next);
    });
};

const openDocument = async (path: string) => {
    const newDocument = await vscode.workspace.openTextDocument(path);
    await vscode.window.showTextDocument(newDocument);
};

const getSiblingFiles = async (path: string): Promise<string[]> => {
    const dir = dirname(path);
    return new Promise<string[]>((resolve, reject) => {
        readdir(dir, async (err, files) => {
            if (err) { 
                reject(err);
                return;
            }

            files = files.map(f => join(dir, f));
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

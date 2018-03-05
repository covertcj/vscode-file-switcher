import * as vscode from 'vscode';
import { stripExtension } from './pathUtil';
import { openFile } from './openFile';
import { readdir, stat } from 'fs';
import { dirname, join } from 'path';
import { filter } from './promiseUtil';

export const cycleExtensions = async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('You must have an active editor to switch files.');
        return;
    }
    
    const config = vscode.workspace.getConfiguration('fileSwitcher');
    const closeCurrent = config.get('closeCurrent') as boolean;

    const currentFile = editor.document.fileName;
    const noExt = stripExtension(currentFile);

    const nextFile = await getNextFile(noExt);
    await openFile(nextFile, closeCurrent);
};

const getNextFile = async (path: string): Promise<string> => {
    const candidates = await getAllCandidates(path);
};

const getAllCandidates = async (path: string): Promise<string[]> => {
    const siblings = await getFileSiblings(path);
};

const getMappedPaths = async (path: string): Promise<string[]> => {
    const config = vscode.workspace.getConfiguration('fileSwitcher');
    const mappings = config.get('pathMappings') as [string, string][];
    if (!mappings) { return []; }

    const mappedPaths = [];
    for (const [test, replacement] of mappings) {
        const testRegex = new RegExp(test);
        if (testRegex.test(path)) {
            mappedPaths.push(path.replace(testRegex, replacement));
        }
    }

    return mappedPaths;
};

const getFileSiblings = async (path: string): Promise<string[]> => {
    const dir = dirname(path);

    return new Promise<string[]>((resolve, reject) => {
        readdir(dir, async (err, files) => {
            if (err) {
                reject(err);
                return;
            }

            files = files.map(f => join(dir, f));
            files = await filter(files, isDirectory);
            resolve(files);
        });
    });
};

const isDirectory = async (file: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        stat(file, (err, stats) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(stats.isDirectory());
        });
    });
};

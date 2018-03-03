'use strict';
import * as vscode from 'vscode';
// import * as path from 'path';

export type RegExpPair = [string, string];

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.file-switcher.regex-switch', async (patterns?: RegExpPair[]) => {
        if (!patterns || !patterns.length) {
            vscode.window.showErrorMessage('Expected a list of regex pairs');
            return;
        }

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('You must have an active editor to switch files');
            return;
        }
        
        const openFile = editor.document.fileName;

        for (const pair of patterns) {
            const captureRegex = new RegExp(pair[0]);
            const matches = openFile.match(captureRegex);
            if (!matches) {
                continue;
            }

            const newFile = openFile.replace(captureRegex, pair[1]);
            const newDocument = await vscode.workspace.openTextDocument(newFile);
            await vscode.window.showTextDocument(newDocument);

            break;
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}
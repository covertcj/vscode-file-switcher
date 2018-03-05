import * as vscode from 'vscode';
import { stripExtension, stripSuffixes, exists } from './pathUtil';
import { openFile } from './openFile';

export const switchToExtension = async (extension: string) => {
    if (!extension) {
        vscode.window.showErrorMessage('Expected an extension to switch to.');
        return;
    }

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('You must have an active editor to switch files.');
        return;
    }
    
    const config = vscode.workspace.getConfiguration('fileSwitcher');
    const closeCurrent = config.get('closeCurrent') as boolean;

    const currentFile = editor.document.fileName;
    const noExt = stripExtension(currentFile);
    
    const withNewExt = `${noExt}${extension}`;
    if (await exists(withNewExt)) {
        await openFile(withNewExt, closeCurrent);
        return;
    }

    // TODO: Use the configuration to find the suffix list
    const strippedSuffixes = stripSuffixes(noExt, config.get('strippableSuffixes') as string[]);
    if (await exists(strippedSuffixes)) {
        await openFile(strippedSuffixes, closeCurrent);
        return;
    }
};

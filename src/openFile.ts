import * as vscode from 'vscode';

export const openFile = async (newFile: string, closeCurrent: boolean) => {
    if (closeCurrent) {
        vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    }

    const newDocument = await vscode.workspace.openTextDocument(newFile);
    await vscode.window.showTextDocument(newDocument);
};

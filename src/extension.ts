'use strict';
import * as vscode from 'vscode';
import { regexSwitch } from './regexSwitch';
// import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.file-switcher.regex-switch', regexSwitch);

    context.subscriptions.push(disposable);
}

export function deactivate() {
}
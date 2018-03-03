'use strict';
import * as vscode from 'vscode';
import { regexSwitch } from './regexSwitch';
// import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposables = [
        vscode.commands.registerCommand('extension.file-switcher.regex-switch', regexSwitch)
    ];

    context.subscriptions = [ ...context.subscriptions, ...disposables ];
}

export function deactivate() {
}
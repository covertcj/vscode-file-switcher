'use strict';
import * as vscode from 'vscode';
import { regexSwitch } from './regexSwitch';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.file-switcher.regex-switch', regexSwitch));
    // context.subscriptions.push(vscode.commands.registerCommand('extension.file-switcher.cycle-extensions', cycleExtensions));
}

export function deactivate() {
}
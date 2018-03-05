'use strict';
import * as vscode from 'vscode';
import { regexSwitch } from './regexSwitch';
import { switchToExtension } from './switchToExtension';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.file-switcher.regex-switch', regexSwitch));
    // context.subscriptions.push(vscode.commands.registerCommand('extension.file-switcher.cycle-extensions', cycleExtensions));
    context.subscriptions.push(vscode.commands.registerCommand('extension.file-switcher.switch-to-extension', switchToExtension));
}

export function deactivate() {
}
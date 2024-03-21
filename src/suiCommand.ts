import * as vscode from 'vscode';

export const build = () => {
    const terminal = vscode.window.createTerminal("Sui Simulator");
    terminal.sendText("sui move build");
    terminal.show();
}

export const publish = () => {
    const terminal = vscode.window.createTerminal("Sui Simulator");
    terminal.sendText("sui client publish --gas-budget 10000000");
    terminal.show();
}

export const test = (command: string) => {
    const terminal = vscode.window.createTerminal("Sui Simulator");
    terminal.sendText(command);
    terminal.show();
}
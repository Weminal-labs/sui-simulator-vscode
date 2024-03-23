import * as vscode from 'vscode';

export const build = (path: string) => {
    const terminal = vscode.window.createTerminal("Sui Simulator");
    terminal.sendText(`sui move build -p ${path}`);
    terminal.show();
};

export const publish = (path: string) => {
    const terminal = vscode.window.createTerminal("Sui Simulator");
    terminal.sendText(`sui client publish --gas-budget 100000000 ${path}`);
    terminal.show();
};

export const executeCommand = (command: string) => {
    const terminal = vscode.window.createTerminal("Sui Simulator");
    terminal.sendText(command);
    terminal.show();
};
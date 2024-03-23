import * as vscode from 'vscode';

const handleSuiPathEmpty = (suiPath: string) => {
    if (!suiPath) {
        return "sui";
    }
    return suiPath;
}

export const build = (path: string, suiPath: string) => {
    suiPath = handleSuiPathEmpty(suiPath);
    const terminal = vscode.window.createTerminal("Sui Simulator");
    terminal.sendText(`${suiPath} move build -p ${path}`);
    terminal.show();
};

export const publish = (path: string, suiPath: string) => {
    suiPath = handleSuiPathEmpty(suiPath);
    const terminal = vscode.window.createTerminal("Sui Simulator");
    terminal.sendText(`${suiPath} client publish --gas-budget 100000000 ${path}`);
    terminal.show();
};

export const executeCommand = (command: string, suiPath: string) => {
    suiPath = handleSuiPathEmpty(suiPath);
    const terminal = vscode.window.createTerminal("Sui Simulator");
    terminal.sendText(`${suiPath} ${command}`);
    terminal.show();
};
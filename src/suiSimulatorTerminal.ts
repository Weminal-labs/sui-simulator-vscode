import * as vscode from 'vscode';

export class SuiSimulatorTerminal {
    private terminal: vscode.Terminal;

    constructor() {
        this.terminal = vscode.window.createTerminal("Sui Simulator");
    }

    build(packagePath: string | undefined, suiPath: string) {
        console.log(this.terminal.exitStatus);
        if (this.isCloseTerminal()) {
            this.createTerminal();
        }
        this.terminal.sendText(`${suiPath} move build -p ${packagePath}`);
        this.terminal.show();
    }

    test(packagePath: string | undefined, suiPath: string) {
        console.log(this.terminal.exitStatus);
        if (this.isCloseTerminal()) {
            this.createTerminal();
        }
        this.terminal.sendText(`${suiPath} move test -p ${packagePath}`);
        this.terminal.show();
    }

    sui_Ptb(cli_command: string | undefined){
        if (this.isCloseTerminal()) {
            this.createTerminal();
        }
        this.terminal.sendText(`${cli_command}`);
        this.terminal.show();
    }

    private createTerminal() {
        this.terminal = vscode.window.createTerminal("Sui Simulator");
    }

    private isCloseTerminal(): boolean {
        return this.terminal.exitStatus instanceof Object;
    }
}
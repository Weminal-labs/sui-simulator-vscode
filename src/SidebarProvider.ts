import * as vscode from "vscode";
import { build, executeCommand, publish } from "./suiCommand";
import { join } from "path";

export class SidebarProvider implements vscode.WebviewViewProvider {
    constructor(private readonly _extensionContext: vscode.ExtensionContext) { }

    public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken) {

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [this._extensionContext.extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage((message) => {
            const { command, requestId, payload } = message;

            switch (command) {
                case "SUI_TERMINAL":
                    executeCommand(payload.command, payload.suiPath);
                    break;

                case "BUILD":
                    build(payload.packagePath, payload.suiPath);
                    break;

                case "PUBLISH":
                    publish(payload.packagePath, payload.suiPath);
                    break;

                case "SAVE_ALIASES":
                    this._extensionContext.workspaceState.update(payload.address, {
                        aliases: payload.aliases
                    }).then(() => {
                        vscode.window.showInformationMessage("Aliases saved successfully!");
                    });

                // use value as undefined to remove the key
                // context.workspaceState.update("", undefined);

                default:
                    vscode.window.showInformationMessage(`Unknown command: ${command}`);
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const jsFile = "webview.js";
        const localServerUrl = "http://localhost:9999";

        let scriptUrl = null;
        let cssUrl = null;

        const isProduction = this._extensionContext.extensionMode === vscode.ExtensionMode.Production;
        if (isProduction) {
            scriptUrl = webview.asWebviewUri(vscode.Uri.file(join(this._extensionContext.extensionPath, 'dist', jsFile))).toString();
        } else {
            scriptUrl = `${localServerUrl}/${jsFile}`;
        }

        return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${isProduction ? `<link href="${cssUrl}" rel="stylesheet">` : ''}
	</head>
	<body>
		<div id="root"></div>

		<script src="${scriptUrl}"></script>
	</body>
	</html>`;
    }
}
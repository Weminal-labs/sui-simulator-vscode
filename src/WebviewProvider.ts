import * as vscode from "vscode";
import { join } from "path";
import { handleReceivedMessage } from "./extension";

export class WebviewProvider implements vscode.WebviewViewProvider {
	constructor(private readonly _extensionContext: vscode.ExtensionContext) { }

	public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken) {

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [this._extensionContext.extensionUri],
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage((message) => handleReceivedMessage(message, webviewView, this._extensionContext));
	}

	public _getHtmlForWebview(webview: vscode.Webview) {
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
        <script src="https://cdn.tailwindcss.com"></script>
        ${isProduction ? `<link href="${cssUrl}" rel="stylesheet">` : ''}
	</head>
	<body>
		<div id="root"></div>

		<script src="${scriptUrl}"></script>
	</body>
	</html>`;
	}
}
import * as vscode from "vscode";
import { join } from "path";
import { handleReceivedMessage } from "./extension";
import { getUri } from "./utils/getUri";
import { getNonce } from "./utils/getNonce";

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
		// The CSS file from the React build output
		const stylesUri = getUri(webview, this._extensionContext.extensionUri, ["webview-ui", "build", "assets", "index.css"]);
		// The JS file from the React build output
		const scriptUri = getUri(webview, this._extensionContext.extensionUri, ["webview-ui", "build", "assets", "index.js"]);

		const nonce = getNonce();

		return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
		<script>
    tailwind.config = {
		theme: {
			extend: {},
			screens: {
			  'sidebar': { 'max': '480px' }, // responsive design for sidebar (not working)
			},
		}
    }
  </script>
        <link rel="stylesheet" type="text/css" href="${stylesUri}">
	</head>
	<body>
		<div id="root"></div>

		<script type="module" nonce="${nonce}" src="${scriptUri}"></script>
	</body>
	</html>`;
	}
}
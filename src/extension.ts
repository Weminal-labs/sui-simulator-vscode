// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { join } from 'path';
import { MessageHandlerData } from '@estruyf/vscode';
import { build, publish, executeCommand } from './suiCommand';
import { SidebarProvider } from './SidebarProvider';
import { exec } from "child_process";
import { promisify } from "util";
import { MyCustomTerminalResponse } from './types';
import { SuiCommand } from './enums';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const execNew = promisify(exec);

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "sui-simulator-vscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('sui-simulator-vscode.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from sui-simulator-vscode!');
	});

	const sidebarProvider = new SidebarProvider(context);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			"sui-simulator-sidebar",
			sidebarProvider
		)
	);

	context.subscriptions.push(disposable);

	context.subscriptions.push(vscode.commands.registerCommand("sui-simulator-vscode.webView", () => {
		const panel = vscode.window.createWebviewPanel(
			'sui-simulator',
			'Sui Simulator',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				retainContextWhenHidden: true
			}
		);

		panel.webview.onDidReceiveMessage(async message => {
			const { command, requestId, payload } = message;
			switch (command) {
				case "SUI_TERMINAL":
					let resp = {
						stderr: "",
						stdout: ""
					};
					
					let finalResp = {
						stderr: {
							message: "",
							isError: false,
						},
						stdout: ""
					};
					// console.log(payload);
					switch (payload.cmd) {
						case SuiCommand.GET_ADDRESSES:
							
							resp = await execNew("sui client addresses --json");

							finalResp = {
								stderr: {
									message: resp.stderr,
									isError: false
								},
								stdout: resp.stdout
							};
							break;
						case SuiCommand.GET_GAS_OBJECTS:
							try {
								resp = await execNew("sui client gas --json");

								finalResp = {
									stderr: {
										message: resp.stderr,
										isError: false
									},
									stdout: resp.stdout
								};
							} catch(err: any) {
								console.log(err.message);
							}
							
							break;
						case SuiCommand.SWITCH_ADDRESS:
							resp = await execNew(`sui client switch --address ${payload.address}`);

							finalResp = {
								stderr: {
									message: resp.stderr,
									isError: false
								},
								stdout: resp.stdout
							};
							break;
						case SuiCommand.GET_NETWORKS:
							resp = await execNew("sui client envs --json");

							finalResp = {
								stderr: {
									message: resp.stderr,
									isError: false
								},
								stdout: resp.stdout
							};
							break;
						case SuiCommand.SWITCH_NETWORK:
							resp = await execNew(`sui client switch --env ${payload.network}`);

							finalResp = {
								stderr: {
									message: resp.stderr,
									isError: false
								},
								stdout: resp.stdout
							};
							break;
						case SuiCommand.PUBLISH_PACKAGE:
							try {
								resp = await execNew(`sui client publish --gas ${payload.gasObjectId} --gas-budget ${payload.gasBudget} ${vscode.workspace.workspaceFolders?.[0].uri.path} --json`);

								finalResp = {
									stderr: {
										message: resp.stderr,
										isError: false
									},
									stdout: resp.stdout
								};

								console.log(finalResp);
							} catch (err: any) {
								console.log(err.message);
								finalResp = {
									stderr: {
										message: err.message,
										isError: true
									},
									stdout: ""
								};
								
							}
							
							break;
					}

					// Do something with the payload

					// Send a response back to the webview
					panel.webview.postMessage({
						command,
						requestId, // The requestId is used to identify the response
						payload: finalResp
					} as MessageHandlerData<MyCustomTerminalResponse>);
					break;

				case "GET_DATA_ERROR":
					panel.webview.postMessage({
						command,
						requestId, // The requestId is used to identify the response
						error: `Oops, something went wrong!`
					} as MessageHandlerData<string>);
					break;

				case "POST_DATA":
					vscode.window.showInformationMessage(`Received data from the webview: ${payload.data}`);
					test(payload.data);
					break;

				// case "SUI_TERMINAL":
				// 	executeCommand(payload.command, payload.suiPath);
				// 	break;

				case "BUILD":
					build(payload.packagePath, payload.suiPath);
					break;

				case "PUBLISH":
					publish(payload.packagePath, payload.suiPath);
					break;

				case "SAVE_ALIASES":
					context.workspaceState.update(payload.address, {
						aliases: payload.aliases
					}).then(() => {
						vscode.window.showInformationMessage("Aliases saved successfully!");
					});

				// use value as undefined to remove the key
				// context.workspaceState.update("", undefined);

				default:
					vscode.window.showInformationMessage(`Unknown command: ${command}`);
			}
		}, undefined, context.subscriptions);

		panel.webview.html = getWebviewContent(context, panel.webview);
	}));

	context.subscriptions.push(vscode.commands.registerCommand("sui-simulator-vscode.terminal", () => {
		const terminal = vscode.window.createTerminal("Sui Simulator");
		terminal.sendText("sui client objects");
		terminal.show();

		// get active editor
		// console.log(vscode.window.activeTextEditor?.document.uri);

		// get folders path in workspace
		// vscode.workspace.workspaceFolders[0].uri.path
		// vscode.workspace.workspaceFolders[0].uri.fsPath
		
	}));
}

// This method is called when your extension is deactivated
export function deactivate() { }

const getWebviewContent = (context: vscode.ExtensionContext, webview: vscode.Webview) => {
	const jsFile = "webview.js";
	const localServerUrl = "http://localhost:9999";

	let scriptUrl = null;
	let cssUrl = null;

	const isProduction = context.extensionMode === vscode.ExtensionMode.Production;
	if (isProduction) {
		scriptUrl = webview.asWebviewUri(vscode.Uri.file(join(context.extensionPath, 'dist', jsFile))).toString();
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
};
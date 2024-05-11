// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { MessageHandlerData } from "@estruyf/vscode";
import { SuiSimulatorTerminal } from "./suiSimulatorTerminal";
import { WebviewProvider } from "./WebviewProvider";
import { exec } from "child_process";
import { promisify } from "util";
import { SuiCommand } from "./enums";
import { isJsonString } from "./utils";

interface MyCustomTerminalResponse {
  stdout: string;
  stderr: {
    message: string;
    isError: boolean;
  };
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "sui-simulator-vscode" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("sui-simulator-vscode.helloWorld", () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage("Hello World from sui-simulator-vscode!!!!");
  });
  context.subscriptions.push(disposable);

  const webviewProvider = new WebviewProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("sui-simulator-sidebar", webviewProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("sui-simulator-vscode.webView", () => {
      const panel = vscode.window.createWebviewPanel(
        "sui-simulator",
        "Sui Simulator",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      );

      panel.webview.onDidReceiveMessage((message) =>
        handleReceivedMessage(message, panel, context)
      );

      panel.webview.html = webviewProvider._getHtmlForWebview(panel.webview);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("sui-simulator-vscode.terminal", () => {
      const terminal = vscode.window.createTerminal("Sui Simulator");
      terminal.sendText("sui client objects");
      terminal.show();

      // get active editor
      // console.log(vscode.window.activeTextEditor?.document.uri);

      // get folders path in workspace
      // vscode.workspace.workspaceFolders[0].uri.path
      // vscode.workspace.workspaceFolders[0].uri.fsPath
    })
  );
}

let suiSimulatorTerminal = new SuiSimulatorTerminal();
let suiPath = "sui";
let projectPath = "";

export const handleReceivedMessage = async (message: any, webView: any, context: any) => {
  const { command, requestId, payload } = message;
  console.log(suiPath+"test");

  switch (command) {
    case "CHANGE_PROJECT_PATH":
      projectPath = payload.projectPath;
      console.log(projectPath);
      break;
    case "CHANGE_SUI_PATH":
      suiPath = payload.suiPath;
      console.log(suiPath);
      break;
    case "SUI_TERMINAL":
      let resp = {
        stderr: "",
        stdout: "",
      };

      let finalResp = {
        stderr: {
          message: "",
          isError: false,
        },
        stdout: "",
      };
      // console.log(payload);
      switch (payload.cmd) {
        case SuiCommand.GET_OBJECTS:
          resp = await execNew(`${suiPath} client objects --json`);
          
          finalResp = {
            stderr: {
              message: resp.stderr,
              isError: false,
            },
            stdout: resp.stdout,
          };
          console.log("testing function"+resp.stdout);
          break;
        case SuiCommand.GET_OBJECT:
          resp = await execNew(`${suiPath} client object ${payload.objectId} --json`);
          
          finalResp = {
            stderr: {
              message: resp.stderr,
              isError: false,
            },
            stdout: resp.stdout,
          };
          console.log("testing function"+resp.stdout);
          break;
        case SuiCommand.MERGE_COIN:
          try {
            resp = await execNew(`${suiPath}  client merge-coin --primary-coin ${payload.primaryCoin} --coin-to-merge ${payload.mergedCoin} --gas-budget ${payload.budget} --gas ${payload.payObject} --json`);

            finalResp = {
              stderr: {
                message: resp.stderr,
                isError: false,
              },
              stdout: resp.stdout,
            };
            console.log("testing function"+resp.stdout);

          } catch (err:any) {
            console.log(err.message);
            finalResp = {
              stderr: {
                message: err.message,
                isError: true,
              },
              stdout: "",
            };
          }
          break;
        case SuiCommand.SPLIT_COIN:
          try {
            resp = await execNew(`${suiPath}  client split-coin --coin-id ${payload.objectId} --gas-budget ${payload.budget} --${payload.type} ${payload.amount} --gas ${payload.payObject} --json`);

            finalResp = {
              stderr: {
                message: resp.stderr,
                isError: false,
              },
              stdout: resp.stdout,
            };
            console.log("testing function"+resp.stdout);

          } catch (err: any) {
            console.log(err.message);
            finalResp = {
              stderr: {
                message: err.message,
                isError: true,
              },
              stdout: "",
            };
          }


          break;
          
        case SuiCommand.GET_ADDRESSES:
          resp = await execNew(`${suiPath} client addresses --json`);

          finalResp = {
            stderr: {
              message: resp.stderr,
              isError: false,
            },
            stdout: resp.stdout,
          };
          break;
        case SuiCommand.GET_GAS_OBJECTS:
          try {
            resp = await execNew(`${suiPath} client gas --json`);

            finalResp = {
              stderr: {
                message: resp.stderr,
                isError: false,
              },
              stdout: resp.stdout,
            };
          } catch (err: any) {
            console.log(err.message);
            finalResp = {
              stderr: {
                message: err.message,
                isError: true,
              },
              stdout: "",
            };   
          
          }

          break;
        case SuiCommand.SWITCH_ADDRESS:
          resp = await execNew(`${suiPath} client switch --address ${payload.address}`);

          finalResp = {
            stderr: {
              message: resp.stderr,
              isError: false,
            },
            stdout: resp.stdout,
          };
          break;
        case SuiCommand.CREATE_NETWORK:
          try {
            resp = await execNew(`${suiPath} client new-env --alias=${payload.alias} --rpc ${payload.rpc}`);

            finalResp = {
              stderr: {
                message: resp.stderr,
                isError: false,
              },
              stdout: resp.stdout,
            };
          } catch (err: any) {
            console.log(err.message);
            finalResp = {
              stderr: {
                message: err.message,
                isError: true,
              },
              stdout: "",
            };   
          
          }

          break;
        case SuiCommand.GET_NETWORKS:
          resp = await execNew(`${suiPath} client envs --json`);

          finalResp = {
            stderr: {
              message: resp.stderr,
              isError: false,
            },
            stdout: resp.stdout,
          };
          break;
        case SuiCommand.SWITCH_NETWORK:
          resp = await execNew(`${suiPath} client switch --env ${payload.network}`);

          finalResp = {
            stderr: {
              message: resp.stderr,
              isError: false,
            },
            stdout: resp.stdout,
          };
          break;
        case SuiCommand.PUBLISH_PACKAGE:
          try {
            resp = await execNew(
              `${suiPath} client publish --gas ${payload.gasObjectId} --gas-budget ${payload.gasBudget} ${projectPath} --json --skip-fetch-latest-git-deps --skip-dependency-verification`
            );

            finalResp = {
              stderr: {
                message: resp.stderr,
                isError: false,
              },
              stdout: resp.stdout,
            };

            console.log("stderr:", finalResp.stderr);
            console.log("stdout:", finalResp.stdout);
          } catch (err: any) {
            console.log(err.message);
            finalResp = {
              stderr: {
                message: err.message,
                isError: true,
              },
              stdout: "",
            };
          }

          break;

        case SuiCommand.CALL_FUNCTION:
          try {
            console.log(process.cwd());
            resp = await execNew(`${suiPath} client call --package ${payload.packageId} --module ${payload.moduleName
              } --function ${payload.functionName}   --json --gas-budget ${payload.gasBudget} ${payload.args.length > 0 ? "--args" : ""
              } ${payload.args?.join(" ")} 2>&1 | tee /tmp/output.txt
						`);

            // has curly braces means it's a json => no need to check if it's a json
            let openCurlyBraceIndex = resp.stdout.indexOf("{");
            if (openCurlyBraceIndex !== -1) {
              let resultAfterRemoveWarn = resp.stdout.slice(openCurlyBraceIndex);
              console.log(resultAfterRemoveWarn);
              finalResp = {
                stderr: {
                  message: resp.stderr,
                  isError: false,
                },
                stdout: resultAfterRemoveWarn,
              };
              // if (isJsonString(resultAfterRemoveWarn)) {
              // } else {
              // finalResp = {
              //   stderr: {
              //     message: resultAfterRemoveWarn,
              //     isError: true,
              //   },
              //   stdout: "",
              // };
              // }
            } else {
              finalResp = {
                stderr: {
                  message: resp.stdout,
                  isError: true,
                },
                stdout: "",
              };
            }

            // finalResp = {
            //   stderr: {
            //     message: resp.stderr,
            //     isError: false,
            //   },
            //   stdout: resp.stdout,
            // };

            console.log("stderr:", finalResp.stderr);
            console.log("stdout:", finalResp.stdout);
          } catch (err: any) {
            console.log(err.message);
            finalResp = {
              stderr: {
                message: err.message,
                isError: true,
              },
              stdout: "",
            };
          }

          break;

        case SuiCommand.REQUEST_FAUCET:
          try {
            resp = await execNew(`${suiPath} client faucet
						`);

            finalResp = {
              stderr: {
                message: resp.stderr,
                isError: false,
              },
              stdout: resp.stdout,
            };

            console.log("stderr:", finalResp.stderr);
            console.log("stdout:", finalResp.stdout);
          } catch (err: any) {
            console.log(err.message);
            finalResp = {
              stderr: {
                message: err.message,
                isError: true,
              },
              stdout: "",
            };
          }
          break;

        case SuiCommand.BUILD_PACKAGE:
          suiSimulatorTerminal.build(projectPath, suiPath);
          break;

        case SuiCommand.TEST_PACKAGE:
          suiSimulatorTerminal.test(projectPath, suiPath);
          break;
      }

      // Do something with the payload

      // Send a response back to the webview
      webView.webview.postMessage({
        command,
        requestId, // The requestId is used to identify the response
        payload: finalResp,
      } as MessageHandlerData<MyCustomTerminalResponse>);
      break;

    case "GET_DATA_ERROR":
      webView.webview.postMessage({
        command,
        requestId, // The requestId is used to identify the response
        error: `Oops, something went wrong!`,
      } as MessageHandlerData<string>);
      break;

    case "POST_DATA":
      vscode.window.showInformationMessage(`Received data from the webview: ${payload.data}`);
      test(payload.data);
      break;

    // case "SUI_TERMINAL":
    // 	executeCommand(payload.command, payload.suiPath);
    // 	break;

    case "SAVE_ALIASES":
      context.workspaceState
        .update(payload.address, {
          aliases: payload.aliases,
        })
        .then(() => {
          vscode.window.showInformationMessage("Aliases saved successfully!");
        });

    // use value as undefined to remove the key
    // context.workspaceState.update("", undefined);

    default:
      vscode.window.showInformationMessage(`Unknown command: ${command}`);
  }
};

// This method is called when your extension is deactivated
export function deactivate() { }

export const execNew = promisify(exec);

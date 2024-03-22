import { messageHandler } from "@estruyf/vscode/dist/client";

// webview send data to extension
export const sendMessage = (action: string, payload: any) => {
  messageHandler.send(action, payload); // action, payload like redux
};

// webview request data from extension then extension send data to webview
export const requestData = async (action: string) => {
  return messageHandler.request<string>(action);
};

export const requestWithErrorData = async (action: string) => {
  return messageHandler.request<string>(action);
};

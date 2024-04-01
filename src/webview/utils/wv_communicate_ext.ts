import { messageHandler } from "@estruyf/vscode/dist/client";
import { MyCustomTerminalResponse } from "../../types";

export const requestDataFromTerminal = async (payload: any) => {
  return messageHandler.request<MyCustomTerminalResponse>("SUI_TERMINAL", payload);
};

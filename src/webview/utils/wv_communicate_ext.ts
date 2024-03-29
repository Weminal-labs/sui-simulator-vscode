import { messageHandler } from "@estruyf/vscode/dist/client";
import { TerminalResponse } from "../../types";

export const requestDataFromTerminal = async (payload: any) => {
  return messageHandler.request<TerminalResponse>("SUI_TERMINAL", payload);
};

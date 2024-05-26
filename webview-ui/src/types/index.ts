import { SuiMoveNormalizedFunction } from "@mysten/sui.js/client";
import { MoveCallStatus } from "../../../src/enums";

export interface ActionType {
  type: string;
  payload: any;
}

export interface MoveCallState {
  status: MoveCallStatus;
  packageId: string;
  modules: string[];
  currentModule: string;
  functions: {
    [key: string]: SuiMoveNormalizedFunction;
  };
  currentFunction: string;
  args: string[];
  argsUserInput: string[];
  error: string;
  response: string;
}

export interface FileWithPath extends File {
  path: string;
}

export interface MyCustomTerminalResponse {
  stdout: string;
  stderr: {
    message: string;
    isError: boolean;
  };
}
export interface AssignObject{
  name: string,
  index: string,
  command: string,
}

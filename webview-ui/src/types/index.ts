import { SuiMoveNormalizedFunction } from "@mysten/sui.js/client";
import { MoveCallStatus } from "../../../src/enums";
import { GasObject } from "../features/gasAddress/gas";

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
export interface TransactionObject{
  name: string,
  id: string,
  command: string,
  active:boolean,
  mergeState:MergeState|null,
  splitState: SplitState|null

}
export interface PTBType{
  transactions:TransactionObject[]
  command: string;
  mergeCommand:string|null,
  splitCommand:string|null
  receiver: GasObject|null; 
  selected: GasObject[];
  splitObject:GasObject|null;
  amounts:number[]|null

}
export interface MergeState{
  receiver:GasObject,
  selected:GasObject[]
}
export interface SplitState{
  split:GasObject,
  amounts:number[]
}
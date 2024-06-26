import { GasObject } from "../features/gasAddress/gas";
import { PTBType, TransactionObject } from "../types";
type Action =
  | {
      type: "ADD_MERGE_COMMAND";
      value: string;
      receiver: GasObject;
      selected: GasObject[];
    }
  | { type: "ADD_SPLIT_COMMAND"; value: string; splitObject: GasObject; amounts: number[] }
  | { type: "ADD_TRANSACTION"; value: TransactionObject }
  | { type: "DISABLE_PTB_COMMAND"; value: string }
  | {
      type: "ADD_TRANSFER_COMMAND";
      value: string;
      address: string;
      objectId: GasObject[];
    }
  | { type: "ADD_MOVE_CALL_COMMAND"; value: string , packageId: string, module: string, funcs: string, args: string[] , typeArgs: string[]};

export const PTBReducer = (state: PTBType, action: Action): PTBType => {
  if (action.type === "ADD_MERGE_COMMAND") {
    return {
      ...state,
      mergeCommand: action.value,
      selected: action.selected,
      receiver: action.receiver,
      commandIndex: [...state.commandIndex, "Merge"],
    };
  } else if (action.type === "ADD_SPLIT_COMMAND") {
    return {
      ...state,
      splitCommand: action.value,
      splitObject: action.splitObject,
      command: state.command + action.value,
      amounts: action.amounts,
      commandIndex: [...state.commandIndex, "Split"],
    };
  } else if (action.type === "DISABLE_PTB_COMMAND") {
    const temp = state.transactions.map((ele) => {
      if (ele.id === action.value) {
        return {
          ...ele,
          active: false,
        };
      }
      return ele;
    });
    return {
      ...state,
      transactions: temp,
    };
  } else if (action.type === "ADD_TRANSFER_COMMAND") {
    return {
      ...state,
      transferCommand: action.value,
      address: action.address,
      objectId: action.objectId,
      command: state.command + action.value,
      commandIndex: [...state.commandIndex, "Transfer"],
    };
  } else if (action.type === "ADD_MOVE_CALL_COMMAND") {
    return {
      ...state,
      packageId: action.packageId,
      moduleCall: action.module,
      funcsCall: action.funcs,
      argsCall: action.args,
      typeArgsCall: action.typeArgs,
      moveCallCommand: action.value,
      command: state.command + action.value,
      commandIndex: [...state.commandIndex, "MoveCall"],
    };
  } else if (action.type === "ADD_TRANSACTION") {
    return {
      ...state,
      transactions: [...state.transactions, action.value],
      selected: [],
      splitObject: null,
      receiver: null,
      command: "",
      mergeCommand: null,
      splitCommand: null,
      moveCallCommand: null,
      packageId: null,
      moduleCall: "",
      funcsCall: "",
      argsCall: [],
      typeArgsCall: [],
      transferCommand: null,
      address: null,
      objectId: [],
      commandIndex: [],
    };
  }
  return state;
};

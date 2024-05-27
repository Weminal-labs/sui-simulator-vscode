import { GasObject } from "../features/gasAddress/gas";
import { PTBType, TransactionObject } from "../types";
type Action =
  | { 
        type: "ADD_MERGE_COMMAND"; 
        value: string; 
        receiver: GasObject; 
        selected: GasObject[] 
    }

  | { type: "ADD_SPLIT_COMMAND"; value: string; splitObject:GasObject }
  | { type: "ADD_TRANSACTION"; value: TransactionObject };
export const PTBReducer = (state: PTBType, action: Action): PTBType => {
  if (action.type === "ADD_MERGE_COMMAND") {
    return {
      ...state,
      command: state.command +  action.value,
      selected:action.selected,
      receiver:action.receiver
    };
  } else if (action.type === "ADD_SPLIT_COMMAND") {
    return {
      ...state,
      splitObject: action.splitObject,
      command: state.command + action.value,
    };
  }
  else if(action.type==="ADD_TRANSACTION"){
    return {
      ...state,
        transactions:[...state.transactions,action.value],
        // selected:[],
        // splitObject:null,
        // receiver:null,
        // command:""
    }
  }
  return state;
};

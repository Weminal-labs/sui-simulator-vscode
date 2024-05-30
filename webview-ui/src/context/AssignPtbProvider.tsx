import React, { createContext, useContext, useReducer, useState } from "react";
import { PTBType, TransactionObject } from "../types";
import { GasObject } from "../features/gasAddress/gas";
import { PTBReducer } from "../reducer/PtbReducer";

export type AssignContextType = {

  state: PTBType;
  addMergeCommand(value: string, receiver: GasObject, selected: GasObject[]): void;
  addSplitCommand(value: string, splitObject: GasObject, amounts:number[]): void;
  addTransaction (value: TransactionObject) :void,
  disablePtb  (value: string): void
  addTransferObjectCommand(value: string, address: string, objectId: GasObject[]): void;
  addMoveCallCommand(value: string): void;
  // mergeReceiver:GasObject
  // mergeList:GasObject[],
  // mergePayObject:GasObject,
  // splitObject:GasObject,
  // splitPayObject:GasObject,
  // splitType:string,
  // amount:Number[]

};

const AssignContext = createContext<AssignContextType | null>(null);
const initState: PTBType = {
  mergeCommand: null,
  splitCommand: null,
  transferCommand: null,
  address: null,
  objectId: [],
  moveCallCommand: null,
  command: "",
  transactions: [],
  receiver: null,
  selected: [],
  splitObject: null,
  amounts:null,
  commandIndex:[]
};
export const AssignPbtProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const [assigns, setAssigns] = useState<AssignObject[]>([]);
  const [state, dispatch] = useReducer(PTBReducer, initState);

  const [command, setCommand] = useState<string>("");
  const [transactions, setTransactions] = useState<TransactionObject[]>([]);
  const handleAddCommand = (value: string) => {
    setCommand((prev) => {
      return prev + "\n" + value;
    });
  };
  const addMergeCommand = (value: string, receiver: GasObject, selected: GasObject[]) => {
    dispatch({ type: "ADD_MERGE_COMMAND", value, receiver, selected });
  };
  const addSplitCommand = (value: string, splitObject: GasObject, amounts:number[]) => {
    dispatch({ type: "ADD_SPLIT_COMMAND", value, splitObject,amounts });
  };
  const addTransaction = (value: TransactionObject) => {
    dispatch({ type: "ADD_TRANSACTION", value });
  };
  const disablePtb = (value: string) => {
    dispatch({ type: "DISABLE_PTB_COMMAND", value });
  };
  const addMoveCallCommand = (value: string) => {
    dispatch({ type: "ADD_MOVE_CALL_COMMAND", value });
  }

  const addTransferObjectCommand = (value: string, address: string, objectId: GasObject[] ) => {
    dispatch({ type: "ADD_TRANSFER_COMMAND", value, address, objectId});
  };

  return (
    <AssignContext.Provider
      value={{
        addMergeCommand,
        addSplitCommand,
        addTransaction,
        disablePtb,
        addTransferObjectCommand,
        addMoveCallCommand,
        state,
      }}>
      {children}
    </AssignContext.Provider>
  );
};

export const useAssignContext = () => {
  const context = useContext(AssignContext);
  if (context === undefined) {
    throw new Error("Error AssignContext or AssignPtbProvider");
  }
  return context as AssignContextType;
};

import React, { createContext, useContext, useState } from "react";
import { AssignObject } from "../types";
import { GasObject } from "../features/gasAddress/gas";

export type AssignContextType = {
  assigns: string;
  mergeCommand:string,
  splitCommand:string,
  // value: string;
  setAssigns: React.Dispatch<React.SetStateAction<string>>;

  setMergeCommand: React.Dispatch<React.SetStateAction<string>>;
  setSplitCommand: React.Dispatch<React.SetStateAction<string>>;
  // mergeReceiver:GasObject,
  // mergeList:GasObject[],
  // mergePayObject:GasObject,
  // splitObject:GasObject,
  // splitPayObject:GasObject,
  // splitType:string,
  // amount:Number[]

  // handleAddAssign: (assignObject: AssignObject) => void;
  // handleRemoveAssign: (index: number) => void;
  // handleEditAssign: (assignObject: AssignObject,index: number) => void;
};

const AssignContext = createContext<AssignContextType | null>(null);

export const AssignPbtProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const [assigns, setAssigns] = useState<AssignObject[]>([]);
  const [assigns, setAssigns] = useState<string>("");

  const [mergeCommand,setMergeCommand]= useState<string>("")
  const [splitCommand,setSplitCommand] = useState<string>("")
  // const [name, setName] = useState<string>("");
  // const [value, setValue] = useState<string>("");
  // const [assignValue,setAssignValue] = useState<AssignObject>()
  // const handleAddAssign = (assisnObject:AssignObject) => {
  //   if (assisnObject.name !== "" && assisnObject.value !== "") {
  //     setAssigns([...assigns, assisnObject]);
  //     // setName("");
  //     // setValue("");
  //   }
  // };
  // const handleEditAssign = (assignObject: AssignObject, index: number) => {
  //   if (assignObject.name !== "" && assignObject.value !== "") {
  //     setAssigns((prevState) => {
  //       const updatedAssigns = [...prevState];
  //       updatedAssigns[index] = assignObject;
  //       return updatedAssigns;
  //     });
  //   }
  // };

  // const handleRemoveAssign = (index: number) => {
  //   setAssigns((prevState) => prevState.filter((_, i) => i !== index));
  // };
  return (
    <AssignContext.Provider
      value={{
        assigns,
        
        mergeCommand,
        splitCommand,
        setMergeCommand,
        setSplitCommand,
        setAssigns
        // name,
        // setName,
        // value,
        // setValue,
        // handleAddAssign,
        // handleEditAssign,
        // handleRemoveAssign,
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

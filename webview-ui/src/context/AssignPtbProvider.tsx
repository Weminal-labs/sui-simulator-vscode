import React, { createContext, useContext, useState } from "react";

export type AssignContextType = {
  assigns: any[];
  name: string;
  value: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setValue: React.Dispatch<React.SetStateAction<string>>;

  handleAddAssign: () => void;
  handleRemoveAssign: (index: number) => void;
  handleEditAssign: (index: number) => void;
};

const AssignContext = createContext<AssignContextType | null>(null);

export const AssignPbtProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assigns, setAssigns] = useState<any[]>([]);
  const [name, setName] = useState<string>("");
  const [value, setValue] = useState<string>("");

  const handleAddAssign = () => {
    if (name !== "" && value !== "") {
      setAssigns([...assigns, { name, value }]);
      setName("");
      setValue("");
    }
  };
  const handleEditAssign = (index: number) => {
    if (name !== "" && value !== "") {
      // Update the assign object at the given index
      setAssigns((prevState) => {
        const updatedAssigns = [...prevState];
        updatedAssigns[index] = { ...updatedAssigns[index], name, value };
        return updatedAssigns;
      });
    }
  };
  const handleRemoveAssign = (index: number) => {
    if (name !== "" && value !== "") {
      setAssigns((prevState) => prevState.filter((_, i) => i !== index));
    }
  };
  return (
    <AssignContext.Provider
      value={{
        assigns,
        name,
        setName,
        value,
        setValue,
        handleAddAssign,
        handleEditAssign,
        handleRemoveAssign,
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

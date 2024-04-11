import React, { useState } from "react";
import { createContext, useContext } from "react";

export type MySuiEnvContextType = {
  isSuiFile: boolean;
  setIsSuiFile: React.Dispatch<React.SetStateAction<boolean>>;
  suiPath: string;
  setSuiPath: React.Dispatch<React.SetStateAction<string>>;
  projectPath: string;
  setProjectPath: React.Dispatch<React.SetStateAction<string>>;
};

const MySuiEnvContext = createContext<MySuiEnvContextType | null>(null);

export const MySuiEnvProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSuiFile, setIsSuiFile] = useState<boolean>(false);
  const [suiPath, setSuiPath] = useState<string>("");
  const [projectPath, setProjectPath] = useState<string>("");

  return (
    <MySuiEnvContext.Provider
      value={{ isSuiFile, setIsSuiFile, suiPath, setSuiPath, projectPath, setProjectPath }}>
      {children}
    </MySuiEnvContext.Provider>
  );
};

export const useMySuiEnv = () => {
  const context = useContext(MySuiEnvContext);
  if (context === undefined) {
    throw new Error("useMySuiEnv must be used within a MySuiEnvProvider");
  }
  return context as MySuiEnvContextType;
};

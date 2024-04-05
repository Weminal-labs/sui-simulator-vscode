import React, { useState } from "react";
import { createContext, useContext } from "react";

export type SuiConfigContextType = {
  isSuiCargo: boolean;
  setIsSuiCargo: React.Dispatch<React.SetStateAction<boolean>>;
  suiPath: string;
  setSuiPath: React.Dispatch<React.SetStateAction<string>>;
};

const SuiConfigContext = createContext<SuiConfigContextType | null>(null);

export const SuiConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSuiCargo, setIsSuiCargo] = useState<boolean>(false);
  const [suiPath, setSuiPath] = useState<string>("");

  return (
    <SuiConfigContext.Provider
      value={{ isSuiCargo, setIsSuiCargo, suiPath, setSuiPath }}
    >
      {children}
    </SuiConfigContext.Provider>
  );
};

export const useSuiConfig = () => {
  const context = useContext(SuiConfigContext);
  if (context === undefined) {
    throw new Error('useSuiConfig must be used within a SuiConfigProvider');
  }
  return context as SuiConfigContextType;;
};

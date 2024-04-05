import React, { useState } from "react";
import { createContext, useContext } from "react";

export type MySuiAccountContextType = {
  addresses: string[];
  setAddresses: (addresses: string[]) => void;
  currentAddress: string;
  setCurrentAddress: (address: string) => void;
  gasObjects: any[];
  setGasObjects: (gasObjects: any[]) => void;
  currentGasObject: any;
  setCurrentGasObject: (gasObject: any) => void;
};

const MySuiAccountContext = createContext<MySuiAccountContextType | null>(null);

export const MySuiAccountProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [addresses, setAddresses] = useState<string[]>([]);
  const [currentAddress, setCurrentAddress] = useState<string>("");
  const [gasObjects, setGasObjects] = useState<any[]>([]);
  const [currentGasObject, setCurrentGasObject] = useState(null);

  return (
    <MySuiAccountContext.Provider
      value={{
        addresses,
        setAddresses,
        currentAddress,
        setCurrentAddress,
        gasObjects,
        setGasObjects,
        currentGasObject,
        setCurrentGasObject,
      }}
    >
      {children}
    </MySuiAccountContext.Provider>
  );
};

export const useMySuiAccount = () => {
  const context = useContext(MySuiAccountContext);
  if (context === undefined) {
    throw new Error(
      "useMySuiAccount must be used within a MySuiAccountProvider"
    );
  }
  return context as MySuiAccountContextType;
};

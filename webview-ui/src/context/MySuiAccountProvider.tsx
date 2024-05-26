import React, { useState } from "react";
import { createContext, useContext } from "react";
import { requestDataFromTerminal } from "../utils/wv_communicate_ext";
import { SuiCommand } from "../../../src/enums";
import { GasObject } from "../features/gasAddress/gas";

export type MySuiAccountContextType = {
  addresses: string[];
  setAddresses: (addresses: string[]) => void;
  currentAddress: string;
  setCurrentAddress: (address: string) => void;
  gasObjects: any[];
  setGasObjects: (gasObjects: any[]) => void;
  currentGasObject: any;
  setCurrentGasObject: (gasObject: any) => void;
  getTotalGas:() =>Promise<number>;
  getObjectGas:(objectId :string) =>Promise<number>

};

const MySuiAccountContext = createContext<MySuiAccountContextType | null>(null);

export const MySuiAccountProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [addresses, setAddresses] = useState<string[]>([]);
  const [currentAddress, setCurrentAddress] = useState<string>("");
  const [gasObjects, setGasObjects] = useState<any[]>([]);
  const [currentGasObject, setCurrentGasObject] = useState(null);
  const getTotalGas = async ()=> {
    try {
        const resp = await requestDataFromTerminal({
            cmd: SuiCommand.GET_GAS_OBJECTS,
        });

        const { stdout, stderr } = resp;
        const objects = JSON.parse(stdout);
        const totalGasBalance: number = objects.reduce((total:Number, obj:any) => {
            return total + obj.mistBalance;
        }, 0);
        console.log("total: "+totalGasBalance )
        return totalGasBalance/1000000000;
    } catch (error) {
        console.error("Error:", error);
        return 0; 
    }
};
const getObjectGas = async (objectId : string)=> {
  try {
      const resp = await requestDataFromTerminal({
          cmd: SuiCommand.GET_OBJECT,
          objectId:objectId
      });

      const { stdout, stderr } = resp;
      const objects = JSON.parse(stdout);
      return objects.content.fields.balance
  } catch (error) {
      console.error("Error:", error);
      return 0; 
  }
};
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
        getTotalGas,
        getObjectGas
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

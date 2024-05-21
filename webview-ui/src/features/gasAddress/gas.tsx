import React, { useEffect, useState } from "react";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { SuiCommand } from "../../../../src/enums";
import { useSuiClient, useSuiClientContext } from "@mysten/dapp-kit";
import { useMySuiAccount } from "../../context/MySuiAccountProvider";
import { shortenAddress } from "../../utils/address_shortener";
import styles from "./address.module.css";

export interface GasObject {
  gasCoinId: string;
  mistBalance:Number;
  suiBalance: string;
}

export const Gas = () => {
  // remember that then change UI in here need to call to terminal
  const { network } = useSuiClientContext();
  const suiClient = useSuiClient();
  const { currentAddress, currentGasObject, gasObjects, setCurrentGasObject, setGasObjects } =
    useMySuiAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [isShowObjects,setIsShowObjects]= useState(false);
  const [reload, setReload] = useState(1);

  const requestFaucet = async () => {
    const resp = await requestDataFromTerminal({
      cmd: SuiCommand.REQUEST_FAUCET,
    });
    const { stdout, stderr } = resp;
    setIsLoading(true);
    setTimeout(() => {
      setReload(Math.random())
      setIsLoading(false);
    }, 10000)
  };

  // useEffect(() => {
  //   async function getGasObjects() {
  //     const resp = await suiClient.getAllCoins({ owner: currentAddress })
  //     console.log(resp);
  //   }
  //   if (currentAddress) {
  //     getGasObjects();
  //   }
  // }, [currentAddress])

  useEffect(() => {
    async function getGasObjects() {
      setIsLoading(true);
      const resp = await requestDataFromTerminal({
        cmd: SuiCommand.GET_GAS_OBJECTS,
      });
      const { stdout, stderr } = resp;
      const objects = JSON.parse(stdout);
      setGasObjects(objects);
      setCurrentGasObject(null)
      setIsLoading(false);
      // console.log(objects);
    }
    getGasObjects();
  }, [network, currentAddress, reload]);

  const balanceOfCurrentGasObject = gasObjects.find(
    (gasObject) => gasObject.gasCoinId === currentGasObject
  )?.suiBalance;

  const handleSelected = (gasCoinId: String)=>{
    setCurrentGasObject(gasCoinId)
    console.log(currentGasObject);

    setIsShowObjects(!isShowObjects)
  }
  return (
    <>
      <div className="flex flex-col items-start justify-center gap-[24px] relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-[33.6px] whitespace-nowrap">
          Gas Object
        </div>
        <div className="flex flex-col items-start justify-center gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex flex-col items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex w-full items-center justify-between px-0 py-[4px] relative flex-[0_0_auto] rounded-[8px]">
              <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                Gas Coin Id
              </div>
            </div>
            <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
              
              {isLoading ? (
                <p>Loading...</p>
              ) : 
              (
              
                <div className="relative block w-full">
                <div onClick={()=>{setIsShowObjects(!isShowObjects)}} className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
                  <span>{currentGasObject?shortenAddress(currentGasObject, 5):"Choose gas object"}</span>
          
                </div>
                {
                  isShowObjects && 
                  <ul className="z-10 absolute block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
                  {gasObjects.map((gasObject: GasObject, index) => {
                    return (
                      <li
                        className="flex justify-between items-center"
                        onClick={() => handleSelected(gasObject.gasCoinId) }
                        key={index}
                      >
                        
                        <span className={`${currentGasObject && currentGasObject === gasObject.gasCoinId ? styles["activeAddress"] : ""}`}>{shortenAddress(gasObject.gasCoinId, 5)}</span>
                        <button
                          className="copy-button"
                          onClick={(e) => {
                            setIsShowObjects(false)
                            e.stopPropagation(); 
                            navigator.clipboard.writeText(gasObject.gasCoinId);
                          }}
                        >
                          Copy
                        </button>
                      </li>
                    );
                  })}
                </ul>
                }
                </div>
                
              
              )
              }
              <div className="flex w-full items-center px-0 py-[4px] relative flex-[0_0_auto] rounded-[8px]">
                <p className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#5c5c5c] text-[14px] tracking-[0] leading-[16.8px] whitespace-nowrap">
                  The gas owed by the address
                </p>
              </div>
            </div>
          </div>
          {balanceOfCurrentGasObject && (
            <div className="flex w-full items-center justify-between px-0 py-[4px] relative flex-[0_0_auto] rounded-[8px]">
              <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                Balance
              </div>
              <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                {balanceOfCurrentGasObject}
              </div>
            </div>
          )}
          <button className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]" onClick={requestFaucet}>
            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
              Faucet
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

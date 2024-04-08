import React, { useEffect, useState } from "react";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { SuiCommand } from "../../../../src/enums";
import { useSuiClientContext } from "@mysten/dapp-kit";
import { useMySuiAccount } from "../../context/MySuiAccountProvider";
import { shortenAddress } from "../../utils/address_shortener";

export interface GasObject {
  gasCoinId: string;
  suiBalance: number;
}

export const Gas = () => {
  // remember that then change UI in here need to call to terminal
  const { network } = useSuiClientContext();
  const { currentAddress, currentGasObject, gasObjects, setCurrentGasObject, setGasObjects } =
    useMySuiAccount();

  const [isLoading, setIsLoading] = useState(false);

  const requestFaucet = () => {};

  useEffect(() => {
    async function getGasObjects() {
      setIsLoading(true);
      const resp = await requestDataFromTerminal({
        cmd: SuiCommand.GET_GAS_OBJECTS,
      });
      const { stdout, stderr } = resp;
      const objects = JSON.parse(stdout);
      setGasObjects(objects);
      setIsLoading(false);
      // console.log(objects);
    }
    getGasObjects();
  }, [network, currentAddress]);

  const balanceOfCurrentGasObject = gasObjects.find(
    (gasObject) => gasObject.gasCoinId === currentGasObject
  )?.suiBalance;

  console.log(currentGasObject);

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
              {/* <div className="flex items-center justify-between px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px] border border-solid border-[#676767]">
                <div className="relative w-fit [font-family:'Aeonik-Medium',Helvetica] font-medium text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                  Ox122346...heh8faf
                </div>
                <ArrowDown className="!relative !w-[24px] !h-[24px]" />
              </div> */}
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <select
                  className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"
                  value={currentGasObject}
                  onChange={(e) => setCurrentGasObject(e.target.value)}>
                  <option selected>Choose gas object</option>
                  {gasObjects.map((gasObject: GasObject, index) => {
                    return (
                      <option value={gasObject.gasCoinId}>
                        {shortenAddress(gasObject.gasCoinId, 5)}
                      </option>
                    );
                  })}
                </select>
              )}
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
          <button className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
              Faucet
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

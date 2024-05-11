import React, { useEffect, useState } from "react";
import { useMySuiAccount } from "../context/MySuiAccountProvider";
import { shortenAddress } from "../utils/address_shortener";
import { GasObject } from "../features/gasAddress/gas";
import styles from "../features/gasAddress/address.module.css";
import { requestDataFromTerminal } from "../utils/wv_communicate_ext";
import { SuiCommand } from "../../../src/enums";
import { Error } from "./Error";
import { effects } from "../types/effectObjetc";
import { Label } from "./Label";
import Result from "./Result";

const Merge = () => {
  const [open,setOpen] = useState(false)

  const { getObjectGas, gasObjects, setGasObjects } = useMySuiAccount();
  const [primary, setPrimary] = useState<string>("");
  const [merged, setMerged] = useState<string>("");
  const [gasPay, setGasPay] = useState<string>("");
  const [budget, setBudget] = useState<string>("100000000"); // Change the type to string

  const [gasPrimary, setGasPrimary] = useState<Number | null>(null);
  const [gasMerged, setGasMerged] = useState<Number | null>(null);
  const [gasObjectPay, setGasObjectPay] = useState<Number | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isShowPrimary, setIsShowPrimary] = useState(false);
  const [isShowMerged, setIsShowMerged] = useState(false);
  const [isShowGasPay, setIsShowGasPay] = useState(false);

  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showDialog, setshowDialog] = useState<boolean>(false);

  const [effect, setEffect] = useState<effects | null>(null);

  const handleShowDialog = ()=>{
    setshowDialog(false)
  }
  const handleSelectedGasPay = async (gasCoinId: string) => {
    setGasPay(gasCoinId);

    setIsShowGasPay(!isShowGasPay);
    const gasObject = await getObjectGas(gasCoinId);
    setGasObjectPay(gasObject);
  };
  const handleSelectedPrimary = async (gasCoinId: string) => {
    setPrimary(gasCoinId);
    setIsShowPrimary(!isShowPrimary);
    const gasObject = await getObjectGas(gasCoinId);
    setGasPrimary(gasObject);
  };
  const handleSelectedMerged = async (gasCoinId: string) => {
    setMerged(gasCoinId);
    setIsShowMerged(!isShowMerged);
    const gasObject = await getObjectGas(gasCoinId);
    setGasMerged(gasObject);
  };
  const handleSubmit = async () => {
    const resp = await requestDataFromTerminal({
      cmd: SuiCommand.MERGE_COIN,
      primaryCoin: primary,
      mergedCoin: merged,
      budget: budget,
      payObject: gasPay,
    });
    const { stdout, stderr } = resp;

    if (stderr.isError) {
      setError(stderr.message);
      setIsError(true);
    } else {
      const objects = JSON.parse(stdout);
      const effectResponse: effects = objects.effects;
      setshowDialog(true)

      setEffect(effectResponse);
    }
    setMerged("")
    setGasMerged(0);
    setGasPrimary(await getObjectGas(primary));
    setGasObjectPay(await getObjectGas(gasPay));
  };
  return (
    <>
      <div className="flex flex-col items-start justify-center gap-[24px] relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[20px] tracking-[0] leading-[33.6px] whitespace-nowrap"
        onClick={()=>{setOpen(!open)}}>
          Merge Coin
        </div>
        {open &&
        <div className="flex flex-col items-start justify-center gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
            Primary Coin
          </div>
          <div className="relative block w-full">
            <div
              onClick={() => {
                setIsShowPrimary(!isShowPrimary);
              }}
              className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
              <span>{primary ? shortenAddress(primary, 5) : "Choose gas object"}</span>
            </div>
            {isShowPrimary && (
              <ul className="z-10 absolute block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
                {gasObjects.map((gasObject: GasObject, index) => {
                  if (gasObject.gasCoinId !== merged && gasObject.gasCoinId !== gasPay) {
                    return (
                      <li
                        className="flex justify-between items-center"
                        onClick={() => handleSelectedPrimary(gasObject.gasCoinId)}
                        key={index}>
                        <span
                          className={`${
                            primary && primary === gasObject.gasCoinId
                              ? styles["activeAddress"]
                              : ""
                          }`}>
                          {shortenAddress(gasObject.gasCoinId, 5)}
                        </span>
                        <button
                          className="copy-button"
                          onClick={(e) => {
                            setIsShowPrimary(false);
                            e.stopPropagation();
                            navigator.clipboard.writeText(gasObject.gasCoinId);
                          }}>
                          Copy
                        </button>
                      </li>
                    );
                  }
                })}
              </ul>
            )}
          </div>
          <p className="relative flex-1 mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#5c5c5c] text-[14px] tracking-[0] leading-[16.8px]">
            Gas: {gasPrimary ? +gasPrimary : "0"}
          </p>
          <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
            Coin to merge
          </div>
          <div className="relative block w-full">
            <div
              onClick={() => {
                setIsShowMerged(!isShowMerged);
              }}
              className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
              <span>{merged ? shortenAddress(merged, 5) : "Choose gas object"}</span>
            </div>
            {isShowMerged && (
              <ul className="z-10 absolute block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
                {gasObjects.map((gasObject: GasObject, index) => {
                  if (gasObject.gasCoinId !== primary && gasObject.gasCoinId !== gasPay) {
                    return (
                      <li
                        className="flex justify-between items-center"
                        onClick={() => handleSelectedMerged(gasObject.gasCoinId)}
                        key={index}>
                        <span
                          className={`${
                            merged && merged === gasObject.gasCoinId ? styles["activeAddress"] : ""
                          }`}>
                          {shortenAddress(gasObject.gasCoinId, 5)}
                        </span>
                        <button
                          className="copy-button"
                          onClick={(e) => {
                            setIsShowMerged(false);
                            e.stopPropagation();
                            navigator.clipboard.writeText(gasObject.gasCoinId);
                          }}>
                          Copy
                        </button>
                      </li>
                    );
                  }
                })}
              </ul>
            )}
          </div>
          <p className="relative flex-1 mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#5c5c5c] text-[14px] tracking-[0] leading-[16.8px]">
            Gas: {gasMerged ? +gasMerged : "0"}
          </p>
          <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
            Gas Pay
          </div>
          <div className="relative block w-full">
            <div
              onClick={() => {
                setIsShowGasPay(!isShowGasPay);
              }}
              className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
              <span>{gasPay ? shortenAddress(gasPay, 5) : "Choose gas object"}</span>
            </div>
            {isShowGasPay && (
              <ul className="z-10 absolute block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
                {gasObjects.map((gasObject: GasObject, index) => {
                  if (gasObject.gasCoinId !== primary && gasObject.gasCoinId !== merged) {
                    return (
                      <li
                        className="flex justify-between items-center"
                        onClick={() => handleSelectedGasPay(gasObject.gasCoinId)}
                        key={index}>
                        <span
                          className={`${
                            gasPay && gasPay === gasObject.gasCoinId ? styles["activeAddress"] : ""
                          }`}>
                          {shortenAddress(gasObject.gasCoinId, 5)}
                        </span>
                        <button
                          className="copy-button"
                          onClick={(e) => {
                            setIsShowGasPay(false);
                            e.stopPropagation();
                            navigator.clipboard.writeText(gasObject.gasCoinId);
                          }}>
                          Copy
                        </button>
                      </li>
                    );
                  }
                })}
              </ul>
            )}
          </div>
          <p className="relative flex-1 mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#5c5c5c] text-[14px] tracking-[0] leading-[16.8px]">
            Gas: {gasObjectPay ? +gasObjectPay : "0"}
          </p>
          <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
            Gas budget
          </div>
          <div className="relative block w-full">
            <input
              type="number"
              //   onClick={() => {
              //     setIsShowMerged(!isShowMerged);
              //   }}
              value={budget}
              onChange={(e) => {
                setBudget(e.target.value);
              }}
              className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"></input>
          </div>
          <button
            className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]"
            onClick={handleSubmit}>
            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
              Merge
            </div>
          </button>
        </div>
        }
      </div>
      
      {isError && <Error errorMsg={error} />}

      {showDialog && effect  && (
       <Result effect={effect} onClose={handleShowDialog}/>
      )}
    </>
  );
};

export default Merge;

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
import { CopyIcon } from "../icons/CopyIcon";

const Merge = () => {
  const [open, setOpen] = useState(false);

  const { getObjectGas, gasObjects, setGasObjects } = useMySuiAccount();
  const [primary, setPrimary] = useState<GasObject | null>(null);
  const [merged, setMerged] = useState<GasObject | null>(null);
  const [gasPay, setGasPay] = useState<GasObject | null>(null);
  const [budget, setBudget] = useState<string>("100000000"); // Change the type to string

  const [isLoading, setIsLoading] = useState(false);
  const [isShowPrimary, setIsShowPrimary] = useState(false);
  const [isShowMerged, setIsShowMerged] = useState(false);
  const [isShowGasPay, setIsShowGasPay] = useState(false);

  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showDialog, setshowDialog] = useState<boolean>(false);

  const [effect, setEffect] = useState<effects | null>(null);
  const getGasObjects = async () => {
    const resp = await requestDataFromTerminal({
      cmd: SuiCommand.GET_GAS_OBJECTS,
    });
    const { stdout, stderr } = resp;
    const objects = JSON.parse(stdout);
    setGasObjects(objects);
    objects.map((gasObject: GasObject) => {
      if (gasObject.gasCoinId === primary?.gasCoinId) {
        console.log(gasObject.mistBalance);
        setPrimary(gasObject);
      } else if (gasObject.gasCoinId === gasPay?.gasCoinId) {
        console.log(gasObject.mistBalance);

        setGasPay(gasObject);
      }
    });
  };
  useEffect(() => {
    getGasObjects();
  }, []);
  const handleShowDialog = () => {
    setshowDialog(false);
  };
  const handleSelectedGasPay = async (gasObject: GasObject) => {
    setGasPay(gasObject);

    setIsShowGasPay(!isShowGasPay);
  };
  const handleSelectedPrimary = async (gasObject: GasObject) => {
    setPrimary(gasObject);
    setIsShowPrimary(!isShowPrimary);
  };
  const handleSelectedMerged = async (gasObject: GasObject) => {
    setMerged(gasObject);
    setIsShowMerged(!isShowMerged);
  };
  const handleSubmit = async () => {
    const resp = await requestDataFromTerminal({
      cmd: SuiCommand.MERGE_COIN,
      primaryCoin: primary?.gasCoinId,
      mergedCoin: merged?.gasCoinId,
      budget: budget,
      payObject: gasPay?.gasCoinId,
    });
    const { stdout, stderr } = resp;

    if (stderr.isError) {
      setError(stderr.message);
      setIsError(true);
    } else {
      const objects = JSON.parse(stdout);
      const effectResponse: effects = objects.effects;
      setshowDialog(true);

      setEffect(effectResponse);
    }
    setMerged(null);
    getGasObjects();
  };
  return (
    <>
      <div className="flex flex-col items-start justify-center gap-[24px] relative self-stretch w-full flex-[0_0_auto]">
        <div
          className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[20px] tracking-[0] leading-[33.6px] whitespace-nowrap"
          onClick={() => {
            setOpen(!open);
          }}>
          Merge Coin
        </div>
        {open && (
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
                <span>{primary ? shortenAddress(primary.gasCoinId, 5) : "Choose gas object"}</span>
              </div>
              {isShowPrimary && (
                <ul className="z-10 absolute block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
                  {gasObjects.map((gasObject: GasObject, index) => {
                    if (
                      gasObject.gasCoinId !== merged?.gasCoinId &&
                      gasObject.gasCoinId !== gasPay?.gasCoinId
                    ) {
                      return (
                        <li className="flex justify-between items-center" key={index}>
                          <span
                            onClick={() => handleSelectedPrimary(gasObject)}
                            className={`${
                              primary && primary.gasCoinId === gasObject.gasCoinId
                                ? styles["activeAddress"]
                                : ""
                            } flex-1`}>
                            {shortenAddress(gasObject.gasCoinId, 5)}
                          </span>
                          <CopyIcon
                            handleClick={() => navigator.clipboard.writeText(gasObject.gasCoinId)}
                          />

                        </li>
                      );
                    }
                  })}
                </ul>
              )}
            </div>
            <p className="relative flex-1 mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#5c5c5c] text-[14px] tracking-[0] leading-[16.8px]">
              Gas: {primary ? +primary?.mistBalance : "0"}
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
                <span>{merged ? shortenAddress(merged.gasCoinId, 5) : "Choose gas object"}</span>
              </div>
              {isShowMerged && (
                <ul className="z-10 absolute block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
                  {gasObjects.map((gasObject: GasObject, index) => {
                    if (
                      gasObject.gasCoinId !== primary?.gasCoinId &&
                      gasObject.gasCoinId !== gasPay?.gasCoinId
                    ) {
                      return (
                        <li className="flex justify-between items-center" key={index}>
                          <span
                            onClick={() => handleSelectedMerged(gasObject)}
                            className={`${
                              merged && merged.gasCoinId === gasObject.gasCoinId
                                ? styles["activeAddress"]
                                : ""
                            } flex-1`}>
                            {shortenAddress(gasObject.gasCoinId, 5)}
                          </span>
                          <CopyIcon
                            handleClick={() => navigator.clipboard.writeText(gasObject.gasCoinId)}
                          />
                        </li>
                      );
                    }
                  })}
                </ul>
              )}
            </div>
            <p className="relative flex-1 mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#5c5c5c] text-[14px] tracking-[0] leading-[16.8px]">
              Gas: {merged ? +merged.mistBalance : "0"}
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
                <span>{gasPay ? shortenAddress(gasPay.gasCoinId, 5) : "Choose gas object"}</span>
              </div>
              {isShowGasPay && (
                <ul className="z-10 absolute block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
                  {gasObjects.map((gasObject: GasObject, index) => {
                    if (
                      gasObject.gasCoinId !== primary?.gasCoinId &&
                      gasObject.gasCoinId !== merged?.gasCoinId
                    ) {
                      return (
                        <li className="flex justify-between items-center" key={index}>
                          <span
                            onClick={() => handleSelectedGasPay(gasObject)}
                            className={`${
                              gasPay && gasPay.gasCoinId === gasObject.gasCoinId
                                ? styles["activeAddress"]
                                : ""
                            } flex-1`}>
                            {shortenAddress(gasObject.gasCoinId, 5)}
                          </span>
                          <CopyIcon
                            handleClick={() => navigator.clipboard.writeText(gasObject.gasCoinId)}
                          />

                          {/* <button
                            className="copy-button"
                            onClick={(e) => {
                              setIsShowGasPay(false);
                              e.stopPropagation();
                              navigator.clipboard.writeText(gasObject.gasCoinId);
                            }}>
                            Copy
                          </button> */}
                        </li>
                      );
                    }
                  })}
                </ul>
              )}
            </div>
            <p className="relative flex-1 mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#5c5c5c] text-[14px] tracking-[0] leading-[16.8px]">
              Gas: {gasPay ? +gasPay?.mistBalance : "0"}
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
        )}
      </div>

      {isError && <Error errorMsg={error} closeError={() => setIsError(false)} />}

      {showDialog && effect && <Result effect={effect} onClose={handleShowDialog} />}
    </>
  );
};

export default Merge;

import React, { useEffect, useState } from "react";
import styles from "../features/gasAddress/address.module.css";
import { useMySuiAccount } from "../context/MySuiAccountProvider";
import { requestDataFromTerminal } from "../utils/wv_communicate_ext";
import { SuiCommand } from "../../../src/enums";
import { shortenAddress } from "../utils/address_shortener";
import { GasObject } from "../features/gasAddress/gas";
import { CopyIcon } from "../icons/CopyIcon";
import { ArrowDown } from "../icons/ArrowDown";
import { ArrowRight } from "../icons/ArrowRight";
import { Error } from "./Error";
import Success from "./Success";

const Split = () => {
  const [open, setOpen] = useState(false);

  const { gasObjects, getObjectGas, setGasObjects } = useMySuiAccount();
  const [primary, setPrimary] = useState<GasObject | null>(null);
  const [gasPay, setGasPay] = useState<GasObject | null>(null);
  const [budget, setBudget] = useState<string>("100000000"); // Change the type to string
  const [type, setType] = useState<string>("count");
  const [amount, setAmount] = useState<string>("2");
  // const [gasPrimary, setGasPrimary] = useState<Number|null>(null);
  // const [gasObjectPay, setGasObjectPay] = useState<Number|null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isShowPrimary, setIsShowPrimary] = useState(false);
  const [isShowGasPay, setIsShowGasPay] = useState(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
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
  useEffect(() => {
    if (type === "count") {
      setAmount("2");
    } else {
      setAmount("100000000");
    }
  }, [type]);
  const handleSelectedPrimary = async (gasCoin: GasObject) => {
    setPrimary(gasCoin);
    setIsShowPrimary(!isShowPrimary);
  };
  const handleSelectedGasPay = async (gasCoin: GasObject) => {
    setGasPay(gasCoin);

    setIsShowGasPay(!isShowGasPay);
  };
  const handleSubmit = async () => {
    const resp = await requestDataFromTerminal({
      cmd: SuiCommand.SPLIT_COIN,
      objectId: primary?.gasCoinId,
      type: type,
      amount: amount,
      payObject: gasPay?.gasCoinId,
      budget: budget,
    });
    const { stdout, stderr } = resp;

    if (stderr.isError) {
      setError(stderr.message);
      setIsError(true);
      setIsSuccess(false);

    } else {
      // const objects = JSON.parse(stdout);
      // const effectResponse: effects = objects.effects;
      setIsError(false);
      setIsSuccess(true);
      setSuccess("Split Coin");
  
      setTimeout(() => {
        setIsSuccess(false);
        setSuccess("");
      }, 3000);
    }
    // setGasPrimary(await getObjectGas(primary))
    // setGasObjectPay(await getObjectGas(gasPay))
    getGasObjects();
  };
  const switchType = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  };
  return (
    <>
      <div className="flex flex-col items-start justify-center gap-[24px] relative self-stretch w-full flex-[0_0_auto] border border-white p-4 rounded-lg">
        <div
          className="flex justify-between cursor-pointer w-full"
          onClick={() => {
            setOpen(!open);
          }}>
          <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[20px] tracking-[0] leading-[33.6px] whitespace-nowrap">
            Split Coin
          </div>
          <div className="text-[20px]">
            {open ? (
              <ArrowDown className="!w-[24px] !h-[24px]"></ArrowDown>
            ) : (
              <ArrowRight className="!w-[24px] !h-[24px]"></ArrowRight>
            )}
          </div>
        </div>

        {open && (
          <div className="flex flex-col items-start justify-center gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
            <div className=" w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
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
                    if (gasObject.gasCoinId !== gasPay?.gasCoinId) {
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
              Gas: {primary ? +primary.mistBalance : "0"}
            </p>
            <select
              className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"
              value={type}
              onChange={switchType}>
              <option value="amounts">Amount</option>
              <option value="count">Count</option>
            </select>
            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
              {type === "Amount" ? "Amount" : "Count"}
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"></input>
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
                    if (gasObject.gasCoinId !== primary?.gasCoinId) {
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
                        </li>
                      );
                    }
                  })}
                </ul>
              )}
            </div>
            <p className="relative flex-1 mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#5c5c5c] text-[14px] tracking-[0] leading-[16.8px]">
              Gas: {gasPay ? +gasPay.mistBalance : "0"}
            </p>
            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
              Gas budget
            </div>
            <div className="relative block w-full">
              <input
                type="number"
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
                Split
              </div>
            </button>
          </div>
        )}
              {isError && <Error errorMsg={error} closeError={() => setIsError(false)} />}
      {isSuccess && <Success successMsg={success} closeSuccess={() => setIsSuccess(false)} />}
      </div>

    </>
  );
};

export default Split;

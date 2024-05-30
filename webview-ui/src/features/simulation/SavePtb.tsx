import React, { useState } from "react";
import { shortenAddress } from "../../utils/address_shortener";
import { CopyIcon } from "../../icons/CopyIcon";
import { GasObject } from "../gasAddress/gas";
import styles from "../gasAddress/address.module.css";
import { useMySuiAccount } from "../../context/MySuiAccountProvider";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "../../icons/ArrowLeft";
import { useAssignContext } from "../../context/AssignPtbProvider";
import { v4 as uuidv4 } from "uuid";
import { Error } from "../../components/Error";
import Success from "../../components/Success";
import { MergeState, MoveCallPTBState, SplitState, TransferState } from "../../types";

const SavePtb = () => {
  const [objectPay, setObjectPay] = useState<GasObject | null>(null);
  const [isShowObjectPay, setIsShowObjectPay] = useState(false);
  const [budget, setBudget] = useState<string>("100000000"); // Change the type to string
  const [name, setName] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();

  const { gasObjects, getObjectGas, setGasObjects } = useMySuiAccount();
  const handleNavigate = () => {
    navigate(-1);
  };

  const handleSelectedObjectPay = async (gasCoin: GasObject) => {
    setObjectPay(gasCoin);

    setIsShowObjectPay(!isShowObjectPay);
  };
  const { addTransaction, state } = useAssignContext();
  const createMergeState = (): MergeState | null => {
    if (state.receiver !== null) {
      return {
        receiver: state.receiver,
        selected: state.selected ?? [],
      };
    }
    return null;
  };

  const createSplitState = (): SplitState | null => {
    if (state.splitObject !== null) {
      return {
        amounts: state.amounts ?? [],
        split: state.splitObject,
      };
    }
    return null;
  };
  const createTranferState = (): TransferState | null => {
    if (state.address !== null) {
      return {
        address: state.address,
        objectId: state.objectId ?? [],
      };
    }
    return null;
  };
  const createMoveCallState = (): MoveCallPTBState | null => {
    if (state.packageId !== null) {
      return {
        packageId: state.packageId,
        module: state.moduleCall,
        funcs: state.funcsCall,
        args: state.argsCall ?? [],
        typeArgs: state.typeArgsCall ?? [],
      };
    }
    return null;
  };
  const handleSubmit = () => {
    let finalCommand = "";
    // (state?.mergeCommand ?? "") + (state?.splitCommand ?? "") + (state?.transferCommand ?? "");
    state.commandIndex.forEach((ele) => {
      if (ele === "Merge") {
        finalCommand += state?.mergeCommand ?? "";
      } else if (ele === "Split") {
        finalCommand += state?.splitCommand ?? "";
      } else if (ele === "Transfer") {
        finalCommand += state?.transferCommand ?? "";
      } else if (ele === "MoveCall") {
        finalCommand += state?.moveCallCommand ?? "";
      }
    });
    if (name === "") {
      setIsError(true);
      setIsSuccess(false);
      setError("Please! Enter transaction name");
      return;
    }
    if (finalCommand === "") {
      setIsError(true);
      setIsSuccess(false);
      setError("Please! Add your command");
      return;
    }
    if (objectPay === null) {
      setIsSuccess(false);
      setIsError(true);
      setError("Please! Select gas object");
      return;
    }
    const newId = uuidv4(); // Generate a unique ID
    const addBudget = `--gas-coin @${objectPay?.gasCoinId} \\\n--gas-budget ${budget}`;
    addTransaction({
      command: finalCommand + addBudget,
      id: newId,
      name: name,
      active: true,
      mergeState: createMergeState(),
      splitState: createSplitState(),
      transferObject: createTranferState(),
      moveCallState: createMoveCallState(),
      commandIndex: state.commandIndex,
    });
    navigate(-2);
  };

  const checkInclude = (id: string): Boolean => {
    return state.selected.find((ele) => {
      return ele.gasCoinId === id;
    })
      ? true
      : false;
  };
  const checkIncludeTransfer = (id: string): Boolean => {
    console.log("namo"+state.objectId.length)
    return state.objectId.find((ele) => {
      return ele.gasCoinId === id;
    })
      ? true
      : false;
  };
  const checkGasId = (gasCoin: GasObject): Boolean => {
    if (state.receiver !== null && state.receiver.gasCoinId === gasCoin.gasCoinId) {
      return false;
    } else if (state.splitObject !== null && state.splitObject.gasCoinId === gasCoin.gasCoinId) {
      return false;
    } else if (state.selected !== null && checkInclude(gasCoin.gasCoinId)) {
      return false;
    }
    else if(state.objectId!==null && checkIncludeTransfer(gasCoin.gasCoinId)){
      return false
    }
    return true;
  };
  return (
    <div className="h-[100vh] grow overflow-y-scroll">
      <div className="absolute w-[640px] sidebar:w-[400px] h-[766px] top-[-178px] left-[25px]">
        <div className="flex flex-col w-full items-start gap-[36px] absolute top-[228px] left-0">
          <div
            className="flex items-end gap-[8px] relative self-stretch w-full flex-[0_0_auto]"
            onClick={handleNavigate}>
            <ArrowLeft className="!relative !w-[24px] !h-[24px]" />
            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap uppercase">
              Save PTB Command
            </div>
          </div>
          <div className="flex gap-5 items-start w-full">
            <div className="border border-red-100 w-[200px] p-4">
              <div className=" w-full mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                Transaction Name
              </div>
            </div>

            <div className="flex flex-1">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-red-100 rounded-lg bg-[#0e0f0e]"></input>
            </div>
          </div>
          <div className="flex gap-5 items-start w-full">
            <div className="border border-red-100 w-[200px] p-4 ">
              <div className="relative w-full mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                Gas Pay
              </div>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <div className="relative block w-full">
                <div
                  onClick={() => {
                    setIsShowObjectPay(!isShowObjectPay);
                  }}
                  className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-red-100 rounded-lg bg-[#0e0f0e]">
                  <span>
                    {objectPay ? shortenAddress(objectPay.gasCoinId, 5) : "Choose gas object"}
                  </span>
                </div>
                {isShowObjectPay && (
                  <ul className="z-10 absolute block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
                    {gasObjects.map((gasObject: GasObject, index: number) => {
                      if (checkGasId(gasObject)) {
                        return (
                          <li className="flex justify-between items-center" key={index}>
                            <span
                              onClick={() => handleSelectedObjectPay(gasObject)}
                              className={`${
                                objectPay && objectPay.gasCoinId === gasObject.gasCoinId
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
              <p className="relative flex-1 mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[14px] tracking-[0] leading-[16.8px]">
                Gas: {objectPay ? +objectPay.mistBalance : "0"}
              </p>
            </div>
          </div>

          <div className="flex gap-5 items-start w-full">
            <div className="border border-red-100 w-[200px] p-4 ">
              <div className=" w-full mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                Gas budget
              </div>
            </div>

            <div className="flex-1">
              <input
                type="number"
                value={budget}
                onChange={(e) => {
                  setBudget(e.target.value);
                }}
                className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-red-100 rounded-lg bg-[#0e0f0e]"></input>
            </div>
          </div>

          <div className="flex gap-5 w-full">
            <div className="w-[200px]">
              <button
                className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]"
                onClick={handleSubmit}>
                <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                  Save
                </div>
              </button>
            </div>

            <div className="flex-1  h-[60px]">
              {isError && <Error errorMsg={error} closeError={() => setIsError(false)} />}
              {isSuccess && (
                <Success successMsg={success} closeSuccess={() => setIsSuccess(false)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavePtb;

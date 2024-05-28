import React, { useEffect, useState } from "react";
import { useMySuiAccount } from "../../context/MySuiAccountProvider";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { SuiCommand } from "../../../../src/enums";
import { shortenAddress } from "../../utils/address_shortener";
import { GasObject } from "../gasAddress/gas";
import styles from "../gasAddress/address.module.css";
import SplitInputRow from "../../components/SplitInputRow";
import { useAssignContext } from "../../context/AssignPtbProvider";
import { Error } from "../../components/Error";
import Success from "../../components/Success";

export const SplitCoinsPtb = () => {
  const { getObjectGas, gasObjects, setGasObjects } = useMySuiAccount();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");

  const {
    addresses,
    currentAddress,
    setCurrentAddress,
    setAddresses,
    getTotalGas,
    setCurrentGasObject,
  } = useMySuiAccount();
  const {
    state,

    addSplitCommand,
  } = useAssignContext();
  async function getGasObjects() {
    const resp = await requestDataFromTerminal({ cmd: SuiCommand.GET_GAS_OBJECTS });
    const { stdout } = resp;
    const objects = JSON.parse(stdout);
    console.log(objects);
    setGasObjects(objects);
  }
  useEffect(() => {
    getGasObjects();
  }, []);

  const [split, setSplit] = useState<GasObject|null>(null);
  const [isShowSplit, setIsShowSplit] = useState<boolean>(false);
  // const [selected, setSelected] = useState<GasObject[]>([]);
  const [entries, setEntries] = useState<{ amount: number; address: string }[]>([
    { amount: 10000, address: "" },
  ]);

  const handleSelectedSplit = async (gasCoin: GasObject) => {
    setSplit(gasCoin);
    setIsShowSplit(!isShowSplit);
  };

  const increaseAmountElement = () => {
    setEntries((prev) => [...prev, { amount: 10000, address: "" }]);
  };

  const setAmountValue = (index: number, value: number) => {
    setEntries((prev) => {
      const newEntries = [...prev];
      newEntries[index].amount = value;
      return newEntries;
    });
  };

  const setAddressValue = (index: number, value: string) => {
    setEntries((prev) => {
      const newEntries = [...prev];
      newEntries[index].address = value;
      return newEntries;
    });
  };
  //   function convertSelectedToString(selected: GasObject[]): string {
  //     return selected.map(item => `@${item.gasCoinId}`).join(',');
  // }
  const checkExistingAddress = (): boolean => {
    return entries.find((ele) => {
      return ele.address === "";
    })
      ? false
      : true;
  };
  const handleSubmit = () => {
    // --assign to_address @0x02a212de6a9dfa3a69e22387acfbafbb1a9e591bd9d636e7895dcfc8de05f331 \
    if (checkExistingAddress()==false || split===null) {
      setIsError(true);
      setIsSuccess(false)

      setError("Please! Fill your information");
      return;
    }
    const assignAddress = entries.map((element, index) => {
      return `--assign address_${index} @${element.address}`;
    });

    const targetObject = `--assign target @${split?.gasCoinId}`;

    const result = entries.map((element, index) => {
      return `--transfer-objects "[coins.${index}]" address_${index}`;
    });

    const amounts = entries.map((ele) => ele.amount);
    const splitCommand = `--split-coins "target" "[${amounts.join(",")}]" \\\n--assign coins \\\n`;

    const finalCommand =
      targetObject +
      " \\\n" +
      splitCommand +
      assignAddress.join(" \\\n") +
      " \\\n" +
      result.join(" \\\n") +
      " \\\n";

      setIsError(false);
      setIsSuccess(true)
      setSuccess("Add split command to PTB")
    addSplitCommand(finalCommand, split!);
    setTimeout(() => {
      setIsSuccess(false);
      setSuccess("");
    }, 3000);
  };

  const checkGasObject = (gasObject: GasObject) => {
    if (
      checkInclude(gasObject.gasCoinId) == false &&
      gasObject.gasCoinId != state.receiver?.gasCoinId
    ) {
      return true;
    }
    return false;
  };
  const checkInclude = (id: string): Boolean => {
    return state.selected.find((ele) => {
      return ele.gasCoinId === id;
    })
      ? true
      : false;
  };
  return (
    <div className="flex flex-col gap-7 mt-5 ml-5 w-full">
      <div className="flex gap-5 items-center ">
        <div className="border border-red-100 w-[200px] p-4">
          <div>Split Object</div>
        </div>

        <div className="relative block flex-1">
          <div
            className="block w-full h-[54px] px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"
            onClick={() => setIsShowSplit(!isShowSplit)}>
            <span>{split ? shortenAddress(split.gasCoinId, 5) : "Choose gas object"}</span>
          </div>

          {isShowSplit && (
            <ul className="z-10 absolute block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
              {gasObjects.map((gasObject: GasObject, index) => {
                if (checkGasObject(gasObject)) {
                  return (
                    <li
                      className="flex justify-between items-center"
                      onClick={() => handleSelectedSplit(gasObject)}
                      key={index}>
                      <span
                        className={`${
                          split && split.gasCoinId === gasObject.gasCoinId
                            ? styles["activeAddress"]
                            : ""
                        }`}>
                        {shortenAddress(gasObject.gasCoinId, 5)}
                      </span>
                      <button
                        onClick={(e) => {
                          setIsShowSplit(false);
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
      </div>
      <div className="flex gap-5 items-center">
      <div className="w-[200px]">
          <button
            className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]"
            onClick={() => handleSubmit()}>
            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
              Add Command
            </div>
          </button>
        </div>
        <div className="flex-1  h-[60px] ">
          {isError && <Error errorMsg={error} closeError={() => setIsError(false)} />}
          {isSuccess && <Success successMsg={success} closeSuccess={() => setIsSuccess(false)} />}
        </div>
      </div>
      <div className="flex justify-around">
        <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
          Amount
        </div>
        <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
          Address Object
        </div>
      </div>
      <div className="flex flex-col gap-7">
        {entries.map((entry, index) => (
          <SplitInputRow
            key={index}
            index={index}
            valueAmount={entry.amount}
            valueAddress={entry.address}
            setValueNumber={setAmountValue}
            setValueAddress={setAddressValue}
          />
        ))}
      </div>
      <div className="flex justify-between items-center ">
        <button
          className="bg-blue-500 text-white font-bold px-3 rounded text-2xl w-[40px] h-[40px] flex self-center "
          onClick={increaseAmountElement}>
          +
        </button>
      
      </div>
     
    </div>
  );
};

export default SplitCoinsPtb;

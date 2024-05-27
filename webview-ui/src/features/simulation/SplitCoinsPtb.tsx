import React, { useEffect, useState } from "react";
import { useMySuiAccount } from "../../context/MySuiAccountProvider";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { SuiCommand } from "../../../../src/enums";
import { shortenAddress } from "../../utils/address_shortener";
import { GasObject } from "../gasAddress/gas";
import styles from "../gasAddress/address.module.css";
import SplitInputRow from "../../components/SplitInputRow";
import { useAssignContext } from "../../context/AssignPtbProvider";

export const SplitCoinsPtb = () => {
  const { getObjectGas, gasObjects, setGasObjects } = useMySuiAccount();
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
  useEffect(() => {
    async function getGasObjects() {
      const resp = await requestDataFromTerminal({ cmd: SuiCommand.GET_GAS_OBJECTS });
      const { stdout } = resp;
      const objects = JSON.parse(stdout);
      console.log(objects);
      setGasObjects(objects);
    }
    getGasObjects();
  }, []);

  const [split, setSplit] = useState<GasObject>();
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
  const handleSubmit = () => {
    const result = entries.map((element, index) => {
      return `--transfer-object "[coins.${index}]" @${element.address} \\ \n`;
    });
    console.log(result);

    
    const amounts = entries.map((ele) => ele.amount);
    const splitCommand = `--split-coins ${split?.gasCoinId} "[${amounts.join(
      ","
    )}]" \\ \n--assign coins \\ \n`;
    console.log(splitCommand);
    const finalCommand = splitCommand + result.join("");
    console.log(finalCommand);
    addSplitCommand(finalCommand, split!);
  };
  return (
    <div className="flex flex-col gap-10 mt-5 ml-5 w-full">
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
                if (
                  !state.selected?.includes(gasObject) &&
                  state.receiver?.gasCoinId !== gasObject.gasCoinId
                ) {
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
        <div className="w-[200px]">
          <button
            className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]"
            onClick={() => handleSubmit()}>
            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
              Add Command
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplitCoinsPtb;

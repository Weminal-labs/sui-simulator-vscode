import React, { useEffect, useState } from "react";
import { useMySuiAccount } from "../../context/MySuiAccountProvider";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { SuiCommand } from "../../../../src/enums";
import { shortenAddress } from "../../utils/address_shortener";
import { GasObject } from "../gasAddress/gas";
import styles from "../gasAddress/address.module.css";
export const SplitCoinsPtb = () => {
  const { getObjectGas, gasObjects, setGasObjects } = useMySuiAccount();

  const [addReceiver, setAddReceiver] = useState("");
  useEffect(() => {
    async function getGasObjects() {
      const resp = await requestDataFromTerminal({
        cmd: SuiCommand.GET_GAS_OBJECTS,
      });
      const { stdout, stderr } = resp;
      const objects = JSON.parse(stdout);
      console.log(objects);
      setGasObjects(objects);
      // setCurrentGasObject(null)
      // setIsLoading(false);
      // console.log(objects);
    }
    getGasObjects();
  }, []);
  const [split, setSplit] = useState<string>("");
  const [objectPay, setobjectPay] = useState<string>("");

  const [isShowSplit, setIsShowSplit] = useState<boolean>(true);
  const [selected, setSelected] = useState<GasObject[]>([]);

  const handleSelectedSplit = async (gasCoinId: string) => {
    setSplit(gasCoinId);
    setIsShowSplit(!isShowSplit);
  };
  return (
    <div className="flex flex-col gap-10 mt-5 ml-5 w-full">
      <div className="flex gap-5 items-center ">
        <div className="border border-red-100 w-[200px] p-4">
          <button>Split Object</button>{" "}
        </div>
        <div className="relative block flex-1">
          <div
            className="block w-full  h-[54px]   px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"
            onClick={() => {
              setIsShowSplit(!isShowSplit);
            }}>
            <span>{split ? shortenAddress(split, 5) : "Choose gas object"}</span>
          </div>

          {isShowSplit && (
            <ul className="z-10 absolute block w-full px-4 py-3  text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
              {gasObjects.map((gasObject: GasObject, index) => {
                if (selected.includes(gasObject) == false && gasObject.gasCoinId !== objectPay) {
                  return (
                    <li
                      className="flex justify-between items-center"
                      onClick={() => handleSelectedSplit(gasObject.gasCoinId)}
                      key={index}>
                      <span
                        className={`${
                          split && split === gasObject.gasCoinId ? styles["activeAddress"] : ""
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
      <div className="relative block flex-1"></div>
    </div>
  );
};

export default SplitCoinsPtb;

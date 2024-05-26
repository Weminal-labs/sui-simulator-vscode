import React, { useEffect, useState } from "react";
import { useMySuiAccount } from "../../context/MySuiAccountProvider";
import { GasObject } from "../gasAddress/gas";
import { shortenAddress } from "../../utils/address_shortener";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { SuiCommand } from "../../../../src/enums";
import styles from "../gasAddress/address.module.css";

const MergeCoinsPtb = () => {
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
  const [merged, setMerged] = useState<string>("");
  const [objectPay, setobjectPay] = useState<string>("");

  // const [gasObjectPay, setGasObjectPay] = useState<Number | null>(null);

  const [selected, setSelected] = useState<GasObject[]>([]);

  // const objectList = [
  //   { name: "Object 1", value: 100, balance: 50 },
  //   { name: "Object 2", value: 200, balance: 100 },
  // ];
  const [isShowMerged, setIsShowMerged] = useState(false);
  const [isShowPay, setIsShowPay] = useState(false);

  const handleSelectedMerged = async (gasCoinId: string) => {
    setMerged(gasCoinId);
    setIsShowMerged(!isShowMerged);
  };
  const handleSelectedObjectPay = async (gasCoinId: string) => {
    setobjectPay(gasCoinId);
    setIsShowPay(!isShowPay);
  };
  const handledSelectObject = (object: GasObject, isChecked: boolean) => {
    setSelected((prevSelected) =>
      isChecked
        ? [...prevSelected, object]
        : prevSelected.filter((element) => element.gasCoinId !== object.gasCoinId)
    );
  };
  function convertSelectedToString(selected: GasObject[]): string {
    return selected.map(item => `@${item.gasCoinId}`).join(',');
}
  const handleSubmit = () => {
    console.log("-----SUBMIT MERGE PTB-----");
   const SelectObjectID: string = convertSelectedToString(selected);

   let result = `--merge-coins @${merged} "[${SelectObjectID}]" --gas-coin @${objectPay}`
  console.log(result);
  };
  return (
    <div className="flex flex-col gap-10 mt-5 ml-5 w-full">
      <div className="flex gap-5 items-center ">
        <div className="border border-red-100 w-[200px] p-4">
          <button>Object Recerver</button>
        </div>
        <div className="relative block flex-1">
          <div
            className="block w-full  h-[54px]   px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"
            onClick={() => {
              setIsShowMerged(!isShowMerged);
            }}>
            <span>{merged ? shortenAddress(merged, 5) : "Choose gas object"}</span>
          </div>

          {isShowMerged && (
            <ul className="z-10 absolute block w-full px-4 py-3  text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
              {gasObjects.map((gasObject: GasObject, index) => {
                if (selected.includes(gasObject) == false && gasObject.gasCoinId !== objectPay) {
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
      </div>
      <div className="flex  gap-5 items-center">
        <div className="border border-red-100  w-[200px] p-4">Object Pay</div>
        <div className="relative block flex-1">
          <div
            className="block w-full  h-[54px]   px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"
            onClick={() => {
              setIsShowPay(!isShowPay);
            }}>
            <span>{objectPay ? shortenAddress(objectPay, 5) : "Choose gas object"}</span>
          </div>

          {isShowPay && (
            <ul className="z-10 absolute block w-full px-4 py-3  text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
              {gasObjects.map((gasObject: GasObject, index) => {
                if (selected.includes(gasObject) == false && gasObject.gasCoinId !== merged) {
                  return (
                    <li
                      className="flex justify-between items-center"
                      onClick={() => handleSelectedObjectPay(gasObject.gasCoinId)}
                      key={index}>
                      <span
                        className={`${
                          objectPay && objectPay === gasObject.gasCoinId
                            ? styles["activeAddress"]
                            : ""
                        }`}>
                        {shortenAddress(gasObject.gasCoinId, 5)}
                      </span>
                      <button
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
      </div>
      <div className="w-[200px]">
        <button
          className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]"
          onClick={handleSubmit}>
          <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
           Add Command 
          </div>
        </button>
      </div>
      <div>
        <div className="text-center text-3xl text-white ">Object List</div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#0e0f0e] text-xl">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b border-white text-left text-white leading-4 font-medium">
                  Object
                </th>
                <th className="px-6 py-3 border-b border-white text-left text-white  leading-4 font-medium">
                  Mist Balance
                </th>
                <th className="px-6 py-3 border-b border-white text-left text-white  leading-4 font-medium">
                  Sui Balance
                </th>
                <th className="px-6 py-3 border-b border-white text-left text-white leading-4 font-medium">
                  Selected
                </th>
              </tr>
            </thead>
            <tbody>
              {gasObjects.map((obj: GasObject, index) => {
                if (obj.gasCoinId !== merged && obj.gasCoinId !== objectPay) {
                  return (
                    <tr key={obj.gasCoinId}>
                      <td className="px-6 py-4 border-b border-white text-white">
                        {shortenAddress(obj.gasCoinId, 5)}
                      </td>
                      <td className="px-6 py-4 border-b border-white text-white">
                        {obj.mistBalance.toString()}
                      </td>
                      <td className="px-6 py-4 border-b border-white text-white">
                        {obj.suiBalance}
                      </td>
                      <td className="px-6 py-4 border-b border-white text-white">
                        <input
                          onChange={(e) => handledSelectObject(obj, e.target.checked)}
                          type="checkbox"
                          className="form-checkbox h-6 w-6 text-green-500 rounded-md border-2 border-green-500 focus:ring-green-500"
                        />
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default MergeCoinsPtb;

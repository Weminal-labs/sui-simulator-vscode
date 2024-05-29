import React, { useEffect, useState } from "react";
import { useAssignContext } from "../../context/AssignPtbProvider";
import { useMySuiAccount } from "../../context/MySuiAccountProvider";
import { useSuiClientContext } from "@mysten/dapp-kit";
import { SuiCommand } from "../../../../src/enums";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { shortenAddress } from "../../utils/address_shortener";
// import styles from "../features/gasAddress/address.module.css";

const TransferObjectPtb = () => {
  const [address, setAddress] = useState<string>("");
  const [objectId, setObjectId] = useState<string[]>([""]);

  const { state, addTransferObjectCommand } = useAssignContext();

  const handleSubmit = () => {
    if (objectId[0] === "") {
      return;
    }
    console.log("🚀 ~ handleSubmit ~ objectId:", objectId)
    console.log("🚀 ~ handleSubmit ~ network:", network)
    console.log("🚀 ~ handleSubmit ~ address:", address)
    const command: string = `--transfer-objects "[@${objectId.join(",@")}]" @${address} \\\n`;
    addTransferObjectCommand(command);
    console.log("🚀 ~ handleSubmit ~ command:", command)
  };

  const increaseAmountElement = () => {
    setObjectId((prev) => [...prev, ""]);
  };
  const removeElementAtIndex = (index: number) => {
    setObjectId((prev) => prev.filter((_, i) => i !== index));
  };

  const { addresses, setCurrentAddress, setAddresses } = useMySuiAccount();
  const [isShowAddress, setIsShow] = useState<Boolean>(false);
  const { network } = useSuiClientContext();
  useEffect(() => {
    async function getAddresses() {
      // setIsLoading(true);
      const resp = await requestDataFromTerminal({
        cmd: SuiCommand.GET_ADDRESSES,
      });
      const { stdout, stderr } = resp;
      const objects = JSON.parse(stdout);
      const { activeAddress, addresses } = objects;
      setCurrentAddress(activeAddress);
      setAddresses(addresses);
    }
    getAddresses();
    // showTotalGas();
  }, [network]);
  return (
    <div className="flex flex-col gap-7 mt-5 w-full">
      <div className="flex flex-col ">
        <label className="block mb-2 text-lg font-medium">Address:</label>
      </div>
      <div className="relative block flex-1">
        <div
          className="block w-full h-[54px] px-4 py-3 text-[#8f8f8f] text-[18px] border border-red-100 rounded-lg bg-[#0e0f0e]"
          onClick={() => setIsShow(!isShowAddress)}>
          <span>{address ? shortenAddress(address, 5) : "Choose gas object"}</span>
        </div>

        {isShowAddress && (
          <ul className="z-10 absolute block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
            {addresses.map((addressObject: any) => (
              <li
                // key={index}
                className="flex justify-between items-center"
                onClick={() => {
                  setAddress(addressObject[1].toString());
                  setIsShow(false);
                }}>
                <span
                className="">
                  {/* // className={`${
                  //   // address && address === addressObject[1] ? styles["activeAddress"] : ""
                  //   "active"
                  // }`}> */}
                  {shortenAddress(addressObject[1], 5)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(addressObject[1]);
                  }}>
                  Copy
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col ">
        <label className="block mb-2 text-lg font-medium">Object_ID:</label>
        {objectId.map((arg, index) => (
          <div key={index} className="flex items-center mb-2 gap-2">
            <input
              key={index}
              type="text"
              value={arg}
              onChange={(e) => {
                const newObjectsID = [...objectId];
                newObjectsID[index] = e.target.value;
                setObjectId(newObjectsID);
              }}
              className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"
            />
            <button
              className="bg-red-500 text-white font-bold px-3 rounded text-2xl w-[40px] h-[40px] flex self-center"
              onClick={() => removeElementAtIndex(index)}>
              -
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center ">
        <button
          className="bg-blue-500 text-white font-bold px-3 rounded text-2xl w-[40px] h-[40px] flex self-center "
          onClick={increaseAmountElement}>
          +
        </button>
      </div>

      <div className="flex flex-col">
        <div className="w-[200px]">
          <button
            className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]"
            onClick={() => handleSubmit()}>
            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
              Add Command
            </div>
          </button>
        </div>
        {/* <div className="flex-1  h-[60px] ">
          {isError && <Error errorMsg={error} closeError={() => setIsError(false)} />}
          {isSuccess && <Success successMsg={success} closeSuccess={() => setIsSuccess(false)} />}
        </div> */}
      </div>
    </div>
  );
};

export default TransferObjectPtb;

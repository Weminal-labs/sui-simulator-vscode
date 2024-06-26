import React, { useEffect, useState } from "react";
import { useAssignContext } from "../../context/AssignPtbProvider";
import ObjectDropdown from "../../components/ObjectDropdown";
import { GasObject } from "../gasAddress/gas";
import { useMySuiAccount } from "../../context/MySuiAccountProvider";
import { shortenAddress } from "../../utils/address_shortener";
import styles from "../gasAddress/address.module.css";
import { useSuiClientContext } from "@mysten/dapp-kit";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { SuiCommand } from "../../../../src/enums";
import Success from "../../components/Success";
import { Error } from "../../components/Error";

const TransferObjectPtb = () => {
  const [objectId, setObjectId] = useState<GasObject[]>([]);

  const { state, addTransferObjectCommand } = useAssignContext();

  const [isShowAddress, setIsShow] = useState<Boolean>(false);
  const [addressValue, setAddressValue] = useState<string>("");
  const { network } = useSuiClientContext();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const { addresses, setCurrentAddress, setAddresses, setGasObjects, gasObjects } =
    useMySuiAccount();

  async function getGasObjects() {
    const resp = await requestDataFromTerminal({ cmd: SuiCommand.GET_GAS_OBJECTS });
    const { stdout } = resp;
    const objects = JSON.parse(stdout);
    setGasObjects(objects);
  }
  useEffect(() => {
    getGasObjects();
  }, []);
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
      // setIsLoading(false);
    }
    getAddresses();
    if (state.address !== null) {
      setAddressValue(state.address);
    }
    if (state.objectId !== null) {
      setObjectId((prev) => {
        return [...prev, ...state.objectId];
      });
    }
    // showTotalGas();
  }, [network]);
  const handleSubmit = () => {
    if (objectId[0].gasCoinId === "") {
      setIsError(true);
      setIsSuccess(false);

      setError("Please! Fill your information");
      return;
    }
    let resultArray: string[] = [];
    objectId.forEach((ele) => {
      resultArray.push(ele.gasCoinId);
    });
    const command: string = `--transfer-objects "[@${resultArray.join(
      ",@"
    )}]" @${addressValue} \\\n`;
    addTransferObjectCommand(command, addressValue, objectId);
    setIsError(false);
    setIsSuccess(true);
    setSuccess("Add transfer command to PTB");

    setTimeout(() => {
      setIsSuccess(false);
      setSuccess("");
    }, 3000);
  };

  const increaseAmountElement = () => {
    setObjectId((prev) => [...prev, { gasCoinId: "", mistBalance: 0, suiBalance: "" }]);
  };
  const removeElementAtIndex = (index: number) => {
    setObjectId((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSetValue = (index: number, value: GasObject) => {
    setObjectId((prev) => {
      const newEntries = [...prev];
      newEntries[index] = value;
      return newEntries;
    });
  };
  const checkIncludeMergeSelected = (id: string): boolean => {
    return state.selected.find((ele) => {
      return ele.gasCoinId === id;
    })
      ? true
      : false;
  };
  const checkInclude = (id: string): boolean => {
    return objectId.find((ele) => {
      return ele.gasCoinId === id;
    })
      ? true
      : false;
  };
  const handledSelectObject = (object: GasObject, isChecked: boolean) => {
    setObjectId((prevSelected) =>
      isChecked
        ? [...prevSelected, object]
        : prevSelected.filter((element) => element.gasCoinId !== object.gasCoinId)
    );
  };
  return (
    <div className="flex flex-col gap-7 mt-5 w-full">
      <div className="flex gap-5 items-start w-full">
        <div className="border border-red-100 w-[200px] p-4">
          <div className="text-center w-full mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
            Address Id
          </div>
        </div>
        <div className=" flex-1">
          <div className="relative block">
            <div
              className="block w-full h-[54px] px-4 py-3 text-[#8f8f8f] text-[18px] border border-red-100 rounded-lg bg-[#0e0f0e]"
              onClick={() => setIsShow(!isShowAddress)}>
              <span>{addressValue ? shortenAddress(addressValue, 5) : "Choose address"}</span>
            </div>

            {isShowAddress && (
              <ul className="z-10 absolute block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
                {addresses.map((addressObject: any) => (
                  <li
                    className="flex justify-between items-center"
                    onClick={() => {
                      setAddressValue(addressObject[1].toString());
                      setIsShow(false);
                    }}>
                    <span
                      className={`${
                        addressValue && addressValue === addressObject[1]
                          ? styles["activeAddress"]
                          : ""
                      }`}>
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
        </div>
      </div>
      <div className="flex gap-5">
        <div className="w-[200px]">
          <button
            className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] w-full bg-white rounded-[8px]"
            onClick={() => handleSubmit()}>
            <div className="text-black text-[18px] font-medium">Add Command</div>
          </button>
        </div>
        <div className="flex-1  h-[60px]">
          {isError && <Error errorMsg={error} closeError={() => setIsError(false)} />}
          {isSuccess && <Success successMsg={success} closeSuccess={() => setIsSuccess(false)} />}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className=" text-2xl text-white">Object List</div>
        <div className="overflow-x-auto border border-white rounded-lg">
          <table className="min-w-full bg-[#0e0f0e] text-xl">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b border-white text-left text-white">Object</th>
                <th className="px-6 py-3 border-b border-white text-left text-white">
                  Mist Balance
                </th>
                <th className="px-6 py-3 border-b border-white text-left text-white">
                  Sui Balance
                </th>
                <th className="px-6 py-3 border-b border-white text-left text-white">Selected</th>
              </tr>
            </thead>
            <tbody>
              {gasObjects.map((obj: GasObject) => {
                if (checkIncludeMergeSelected(obj.gasCoinId) === false) {
                  return (
                    <tr key={obj.gasCoinId}>
                      <td className="px-6 py-4 ">{shortenAddress(obj.gasCoinId, 5)}</td>
                      <td className="px-6 py-4  ">{obj.mistBalance.toString()}</td>
                      <td className="px-6 py-4  ">{obj.suiBalance}</td>
                      <td className="px-6 py-4  ">
                        <input
                          checked={checkInclude(obj.gasCoinId)}
                          onChange={(e) => handledSelectObject(obj, e.target.checked)}
                          type="checkbox"
                          className="form-checkbox h-6 w-6 text-green-500 rounded-md border-2 border-green-500 focus:ring-green-500"
                        />
                      </td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransferObjectPtb;

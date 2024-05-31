import React, { useEffect, useState } from "react";
import { shortenAddress } from "../utils/address_shortener";
import styles from "../features/gasAddress/address.module.css";
import { useSuiClientContext } from "@mysten/dapp-kit";
import { requestDataFromTerminal } from "../utils/wv_communicate_ext";
import { SuiCommand } from "../../../src/enums";
import { useMySuiAccount } from "../context/MySuiAccountProvider";
interface splitRowProp {
  index: number;
  valueAmount: number;
  valueAddress: string;
  setValueNumber(index: number, value: number): void;
  setValueAddress(index: number, value: string): void;

  // setValue: React.Dispatch<React.SetStateAction<string>>;
}
const SplitInputRow = ({
  index,
  setValueNumber,
  setValueAddress,
  valueAddress,
  valueAmount,
}: splitRowProp) => {
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
      // setIsLoading(false);
      // console.log(objects);
    }
    getAddresses();
    // showTotalGas();
  }, [network]);
  return (
    <div className="flex justify-around gap-3">
      <div className=" flex-1">
        <input
          onChange={(e) => {
            setValueNumber(index, Number(e.target.value));
          }}
          value={valueAmount}
          type="number"
          className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-red-100 rounded-lg bg-[#0e0f0e]"></input>
      </div>
      <div className="relative block flex-1">
        <div
          className="block w-full h-[54px] px-4 py-3 text-[#8f8f8f] text-[18px] border border-red-100 rounded-lg bg-[#0e0f0e]"
          onClick={() => setIsShow(!isShowAddress)}>
          <span>{valueAddress ? shortenAddress(valueAddress, 5) : "Choose gas object"}</span>
        </div>

        {isShowAddress && (
          <ul className="z-10 absolute block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
            {addresses.map((addressObject: any) => (
              <li
                className="flex justify-between items-center"
                onClick={() => {
                  setValueAddress(index, addressObject[1].toString());
                  setIsShow(false);
                }}
                key={index}>
                <span
                  className={`${
                    valueAddress && valueAddress === addressObject[1] ? styles["activeAddress"] : ""
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
  );
};

export default SplitInputRow;

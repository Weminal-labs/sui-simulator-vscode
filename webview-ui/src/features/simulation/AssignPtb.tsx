import React, { useEffect, useState } from "react";
import { useAssignContext } from "../../context/AssignPtbProvider";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { SuiCommand } from "../../../../src/enums";
import { useSuiClientContext } from "@mysten/dapp-kit";
import { useMySuiAccount } from "../../context/MySuiAccountProvider";
import { shortenAddress } from "../../utils/address_shortener";
import styles from "../gasAddress/address.module.css";
import { AssignObject } from "../../types";

export const AssignPtb = () => {
  const [name, setName] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [assignList,setAssignList] =useState<AssignObject[]>([])
  const [isShowAddress, setIsShow] = useState<Boolean>(false);
  const { network } = useSuiClientContext();
  const {
    addresses,
    currentAddress,
    setCurrentAddress,
    setAddresses,
    getTotalGas,
    setCurrentGasObject,
  } = useMySuiAccount();
  const [totalGas, setTotalGas] = useState<Number | null>(null);

  const {
    assigns,
    // name,
    // value,
    // setName,
    // setValue,
    // handleAddAssign,
    // handleEditAssign,
    // handleRemoveAssign,
  } = useAssignContext();

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
  if (assigns === null) {
    console.log("assigs is null");
  }

  return (
    <>
      <div className="flex flex-col gap-[10px] w-full shadow-md rounded-md p-4">
        {/* <div className="font-bold text-[18px] ">Assign</div> */}
        <div className="flex gap-5 items-center ">
          <div className="border border-red-100 w-[200px] p-4">
            <div>Assign Name</div>
          </div>
          {/* <input
          type="text"
          className="w-full mr-2 border rounded-md px-4 py-2 text-black"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /> */}
          <div className="relative block flex-1">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"></input>
          </div>
        </div>
        <div className="flex gap-5 items-center ">
          <div className="border border-red-100 w-[200px] p-4">
            <div>Assign Value</div>
          </div>
          {/* <input
          type="text"
          className="w-full border rounded-md px-4 py-2 text-black"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        /> */}
          <div className="relative block flex-1">
            <div
              className="block w-full  h-[54px]   px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"
              onClick={() => {
                setIsShow(!isShowAddress);
              }}>
              <span>{value ? shortenAddress(value, 5) : "Choose gas object"}</span>
            </div>

            {isShowAddress && (
              <ul className="z-10 absolute block w-full px-4 py-3  text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
                {addresses.map((addressObject: any, index) => {
                  return (
                    <li
                      className="flex justify-between items-center"
                      onClick={() => setValue(addressObject[1])}
                      key={index}>
                      <span
                        className={`${
                          value && value === addressObject[1] ? styles["activeAddress"] : ""
                        }`}>
                        {shortenAddress(addressObject[1], 5)}
                      </span>
                      <button
                        onClick={(e) => {
                          // setIsShow(false);
                          e.stopPropagation();
                          navigator.clipboard.writeText(addressObject[1]);
                        }}>
                        Copy
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
        <button
          className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-[200px] flex-[0_0_auto] bg-white rounded-[8px]"
          onClick={() => handleAddAssign({ name: name, value: value })}>
          <div className="relative w-fit text-black mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
            Add to list
          </div>
        </button>
      </div>
      <div className="container mx-auto mt-4">
        <div className="flex flex-col">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Assign list</h2>
          </div>
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Value</th>
                <th className="border p-2 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {assignList?.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.value}</td>
                  <td className="border p-2 ">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 mr-20"
                      onClick={() =>
                        handleEditAssign({ name: item.name, value: item.value }, index)
                      }>
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                      onClick={() => handleRemoveAssign(index)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AssignPtb;

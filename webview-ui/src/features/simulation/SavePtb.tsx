import React, { useState } from "react";
import { shortenAddress } from "../../utils/address_shortener";
import { CopyIcon } from "../../icons/CopyIcon";
import { GasObject } from "../gasAddress/gas";
import styles from "../gasAddress/address.module.css";
import { useMySuiAccount } from "../../context/MySuiAccountProvider";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "../../icons/ArrowLeft";
import { useAssignContext } from "../../context/AssignPtbProvider";

const SavePtb = () => {
  const [objectPay, setObjectPay] = useState<GasObject | null>(null);
  const [isShowObjectPay, setIsShowObjectPay] = useState(false);
  const [budget, setBudget] = useState<string>("100000000"); // Change the type to string
const [name,setName]= useState<string>("")
  
  const navigate = useNavigate();

  const { gasObjects, getObjectGas, setGasObjects } = useMySuiAccount();
  const handleNavigate = () => {
    navigate(-1);
  };
  const handleSelectedObjectPay = async (gasCoin: GasObject) => {
    setObjectPay(gasCoin);

    setIsShowObjectPay(!isShowObjectPay);
  };
  const {
        assigns,
        setAssignList,
        setAssigns
  } = useAssignContext();
  const handleSubmit = () => {

    setAssignList((prev)=>{
        return [...prev,{command:assigns,index:"1",name:name}]
    })
    setAssigns("")
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
          <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
            Transaction Name
          </div>
          <div className="relative block w-full">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"></input>
          </div>
          <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
            Gas Pay
          </div>
          <div className="relative block w-full">
            <div
              onClick={() => {
                setIsShowObjectPay(!isShowObjectPay);
              }}
              className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
              <span>{objectPay ? shortenAddress(objectPay.gasCoinId, 5) : "Choose gas object"}</span>
            </div>
            {isShowObjectPay && (
              <ul className="z-10 absolute block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
                {gasObjects.map((gasObject: GasObject, index: number) => {
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
                })}
              </ul>
            )}
          </div>
          <p className="relative flex-1 mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#5c5c5c] text-[14px] tracking-[0] leading-[16.8px]">
            Gas: {objectPay ? +objectPay.mistBalance : "0"}
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
              Save
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavePtb;

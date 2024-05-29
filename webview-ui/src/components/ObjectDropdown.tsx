import React, { useState } from 'react'
import { shortenAddress } from '../utils/address_shortener';
import { GasObject } from '../features/gasAddress/gas';
import { useMySuiAccount } from '../context/MySuiAccountProvider';
import styles from "../features/gasAddress/address.module.css";
interface ComponentProp {
    
    object: GasObject;
    setValue(index:number,value:GasObject): void;
    index:number
    // setValue: React.Dispatch<React.SetStateAction<string>>;
  }
const ObjectDropdown = ({setValue,index,object}:ComponentProp) => {
    const [isShow, setIsShow] = useState(false);
    const { getObjectGas, gasObjects, setGasObjects } = useMySuiAccount();

  return (
    <div className="flex flex-col gap-1 flex-1">
          <div className="relative block ">
            <div
              className="block w-full h-[54px] px-4 py-3 text-[#8f8f8f] text-[18px] border border-red-100 rounded-lg bg-[#0e0f0e]"
              onClick={() => setIsShow(!isShow)}>
              <span>{object ? shortenAddress(object.gasCoinId, 5) : "Choose gas object"}</span>
            </div>

            {isShow && (
              <ul className="z-10 absolute block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
                {gasObjects.map((gasObject: GasObject) => {
                  if (
                        true
                  ) {
                    return (
                      <li
                        className="flex justify-between items-center"
                        onClick={() =>{ setValue(index,gasObject)
                            setIsShow(false)

                        }}
                        key={gasObject.gasCoinId}>
                        <span
                          className={`${
                            object && object.gasCoinId === gasObject.gasCoinId
                              ? styles["activeAddress"]
                              : ""
                          }`}>
                          {shortenAddress(gasObject.gasCoinId, 5)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(gasObject.gasCoinId);
                            setIsShow(false);
                          }}>
                          Copy
                        </button>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            )}
        
          </div>
          <p className="relative flex-1 mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[14px] tracking-[0] leading-[16.8px]">
              Gas Balance: {object ? +object.mistBalance : "0"}
            </p>
        </div>
  )
}

export default ObjectDropdown

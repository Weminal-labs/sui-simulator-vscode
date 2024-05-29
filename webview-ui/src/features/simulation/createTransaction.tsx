import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "../../icons/ArrowLeft";

import AssignPtb from "./AssignPtb";
import MergeCoinsPtb from "./MergeCoinsPtb";
import MoveCallPtb from "./MoveCallPtb";
import SplitCoinsPtb from "./SplitCoinsPtb";
import TransferObjectPtb from "./TransferObjectPtb";
import { useAssignContext } from "../../context/AssignPtbProvider";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { SuiCommand } from "../../../../src/enums";
import { useMySuiAccount } from "../../context/MySuiAccountProvider";

export const CreateTransaction = () => {
  const [selectedCommand, setselectedCommand] = useState<string>("");
  const navigate = useNavigate();
  const {} = useAssignContext();
  const { getObjectGas, gasObjects, setGasObjects } = useMySuiAccount();

  const handleNavigate = () => {
    navigate("/simulation");
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setselectedCommand(event.target.value);
  };
  // useEffect(()=>{
  //       async function getGasObjects() {
  //     const resp = await requestDataFromTerminal({
  //       cmd: SuiCommand.GET_GAS_OBJECTS,
  //     });
  //     const { stdout } = resp;
  //     const objects = JSON.parse(stdout);
  //     setGasObjects(objects);
  //   }

  //   getGasObjects();
  // },[])
  const renderSelectedComponent = () => {
    switch (selectedCommand) {
      case "Assign":
        return <AssignPtb />;
      case "Split-coins":
        return <SplitCoinsPtb />;
      case "Merge-coins":
        return <MergeCoinsPtb />;
      case "Move-call":
        return <MoveCallPtb />;
      case "Transfer-object":
        return <TransferObjectPtb />;
      default:
        return null;
    }
  };
  return (
    <>
      <div className="h-[200vh] grow overflow-y-scroll">
        <div className="absolute w-[800px] sidebar:w-[400px] h-[766px] top-[-178px] left-[25px]">
          <div className="flex flex-col w-full items-start gap-[36px] absolute top-[228px] left-0">
            {/* <div className="relative w-full top-16"> */}
            <div
              className="flex items-end gap-[8px] relative self-stretch w-full flex-[0_0_auto]"
              onClick={handleNavigate}>
              <ArrowLeft className="!relative !w-[24px] !h-[24px]" />
              <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap uppercase">
                Simulation
              </div>
              {/* </div> */}
            </div>
            <div className="relative flex flex-col w-full gap-3">
              <div className="w-fit font-normal text-white text-[20px] uppercase p-3">Command</div>

              <div className="flex justify-between">
                <div className="font-normal text-white text-[20px] ">
                <select
                  value={selectedCommand}
                  onChange={handleChange}
                  className="text-white bg-black p-3 rounded-md">
                  <option value="" className="text-white">
                    Select an option
                  </option>
                  <option value="Assign" className="text-white">
                    Assign
                  </option>
                  <option value="Split-coins" className="text-white">
                    Split-Coins
                  </option>
                  <option value="Move-call" className="text-white">
                    Move-call
                  </option>
                  <option value="Merge-coins" className="text-white">
                    Merge-Coins
                  </option>
                  <option value="Transfer-object" className="text-white">
                    Transfer-objects
                  </option>
                </select>
                </div>

                <button
                  className="flex items-center justify-center  self-stretch	 w-[100px] cursor-pointer  bg-white rounded-[8px]"
                  onClick={() => {
                    navigate("/SavePtb");
                  }}>
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                    Save
                  </div>
                </button>
              </div>

              {renderSelectedComponent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

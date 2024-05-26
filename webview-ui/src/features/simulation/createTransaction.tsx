import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "../../icons/ArrowLeft";

import AssignPtb from "./AssignPtb";
import MergeCoinsPtb from "./MergeCoinsPtb";
import MoveCallPtb from "./MoveCallPtb";
import SplitCoinsPtb from "./SplitCoinsPtb";
import TransferObjectPtb from "./TransferObjectPtb";

export const CreateTransaction = () => {
  const [selectedCommand, setselectedCommand] = useState<string>("");
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/simulation");
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setselectedCommand(event.target.value);
  };

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
      <div className="flex flex-col flex-grow overflow-y-scroll">
        <div className="absolute w-[940px] sidebar:w-[400px] h-[766px] top-[-178px] left-[25px]">
          <div className="flex flex-col w-full items-start gap-[64px] absolute top-[228px] left-0">
            <div className="relative w-full top-16">
              <div
                className="flex items-end gap-[8px] relative self-stretch w-full flex-[0_0_auto]"
                onClick={handleNavigate}>
                <ArrowLeft className="!relative !w-[24px] !h-[24px]" />
                <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap uppercase">
                  Simulation
                </div>
              </div>
            </div>
            <div className="relative flex flex-col w-full gap-3">
              <div className="w-fit font-normal text-white text-[20px] uppercase">Command</div>
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
                </select>
              </div>
              {renderSelectedComponent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

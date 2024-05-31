import { useEffect, useReducer, useState } from "react";
import { ArrowLeft } from "../../icons/ArrowLeft";
import { useNavigate } from "react-router-dom";
import { useSuiClient } from "@mysten/dapp-kit";

import { MoveCallWidget } from "../packageExplorer/MoveCallWidget";

export default function index() {
  const navigate = useNavigate();
  const suiClient = useSuiClient();
  const [actions, setActions] = useState<string[]>([]);

  const handleNavigate = () => {
    navigate("/");
  };

  const handleAddAction = () => {
    setActions([...actions, ""]);
  };

  return (
    <div className="h-[200vh] grow overflow-y-scroll">
      <div className="absolute w-[640px] sidebar:w-[400px] h-[766px] top-[-178px] left-[25px]">
        <div className="flex flex-col w-full items-start gap-[64px] absolute top-[228px] left-0">
          <div className="flex-col gap-[40px] p-[24px] self-stretch w-full flex-[0_0_auto] rounded-[16px] flex items-start relative">
            <div
              className="flex items-end gap-[8px] relative self-stretch w-full flex-[0_0_auto]"
              onClick={handleNavigate}>
              <ArrowLeft className="!relative !w-[24px] !h-[24px]" />
              <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap uppercase">
                Back
              </div>
            </div>
            {actions.map((_, index) => {
              return <MoveCallWidget />;
            })}
            <button onClick={handleAddAction}>Add action</button>
          </div>
        </div>
      </div>
    </div>
  );
}

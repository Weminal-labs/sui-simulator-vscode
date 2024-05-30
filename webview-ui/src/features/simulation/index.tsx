import React, { useState } from "react";
import { Tab } from "../../components/Tab";
import { Link } from "react-router-dom";

import { ArrowLeft } from "../../icons/ArrowLeft";
import { useNavigate } from "react-router-dom";
import { CreateTransaction } from "./createTransaction";
import { ListTransaction } from "./listTransaction";
import { Label } from "../../components/Label";

const Simulation = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/");
  };

  // Hàm xử lý sự kiện khi click vào nút "Create Transaction"
  const handleCreateTransaction = () => {
    navigate("/create-transaction");
  };

  return (
    <>
      <div className="h-[200vh] grow overflow-y-scroll">
        <div className="absolute w-[800px] sidebar:w-[400px] h-[766px] top-[-178px] left-[25px]">
          <div className="flex flex-col w-full items-start gap-[36px] absolute top-[228px] left-0">
            <div className="flex-col gap-[40px] p-[24px] self-stretch w-full flex-[0_0_auto] rounded-[16px] flex items-start relative">
              <div
                className="flex items-end gap-[8px] relative self-stretch w-full flex-[0_0_auto]"
                onClick={handleNavigate}>
                <ArrowLeft className="!relative !w-[24px] !h-[24px]" />
                <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap uppercase">
                  Simulation
                </div>
              </div>
              <div className="flex flex-col items-end gap-[16px] relative self-stretch w-full flex-[0_0_auto] ">
                <div className=" absolute left-0 top-0 ">
                  <Label
                    status="default"
                    text="Transaction"
                    className={"font-medium text-3xl"}
                    labelClassName={undefined}
                  />
                </div>
                <div className="absolute top-0 right-5 w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#ffffff] text-[16px] tracking-[0] leading-[19.2px] whitespace-nowrap">
                  <button
                    className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]"
                    onClick={handleCreateTransaction}>
                    <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                      Create Transaction
                    </div>
                  </button>
                </div>
              </div>
              <ListTransaction />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Simulation;

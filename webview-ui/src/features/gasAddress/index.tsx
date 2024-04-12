import React from "react";
import { Address } from "./address";
import { Gas } from "./gas";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "../../icons/ArrowLeft";

export const GasAddress = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  return (
    <>
      <div className="bg-[#0e0f0e] overflow-y-scroll w-full">
        <div className="relative w-full h-[600px] top-[-178px] left-[-158px]">
          <div className="flex flex-col w-[640px] sidebar:w-[360px] items-start gap-[64px] absolute top-[228px] left-[198px]">
            <div className="flex flex-col items-start gap-[40px] relative self-stretch w-full flex-[0_0_auto] rounded-[16px]">
              <div
                className="flex items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]"
                onClick={handleNavigate}>
                <ArrowLeft className="!relative !w-[24px] !h-[24px]" />
                <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                  Gases And Address
                </div>
              </div>
              <div className="flex flex-col items-end gap-[32px] relative self-stretch w-full flex-[0_0_auto]">
                <Address />
                <Gas />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

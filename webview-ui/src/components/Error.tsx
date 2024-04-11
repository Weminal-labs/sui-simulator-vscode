import React from "react";
import { CloseIcon } from "../icons/CloseIcon";

interface Props {
  errorMsg: string;
}

export const Error = ({ errorMsg }: Props) => {
  return (
    <div className="flex flex-col items-start gap-[24px] p-[24px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px] border border-solid border-[#ff008b]">
      <div className="flex flex-col items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
          <div className="relative w-fit mt-[-1.00px] font-normal text-[#c83b7f] text-[18px] tracking-[0] leading-[21.6px] break-all">
            <pre className="whitespace-pre-wrap">Error: {errorMsg}</pre>
          </div>
          <CloseIcon className="!relative !w-[24px] !h-[24px]" />
        </div>
        {/* <p className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#c83b7f] text-[16px] text-center tracking-[0] leading-[19.2px] whitespace-nowrap">
          404: Can't Find Object Id
        </p> */}
      </div>
    </div>
  );
};

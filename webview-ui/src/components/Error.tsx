import React from "react";
import { CloseIcon } from "../icons/CloseIcon";

interface Props {
  errorMsg: string;
  closeError?():void;
}

export const Error = ({ errorMsg,closeError }: Props) => {
  return (
    <div className="flex flex-col items-start gap-[24px] p-[16px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px] border border-solid border-[#ff008b]">
      <div className="flex flex-col items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
          <div className="relative w-fit mt-[-1.00px] font-normal text-[#c83b7f] text-[18px] tracking-[0] leading-[21.6px] break-all">
            <pre className="whitespace-pre-wrap">Error: {errorMsg}</pre>
          </div>
          <div onClick={()=>{closeError!=null?closeError():null}}>
          <CloseIcon className="!relative !w-[24px] !h-[24px]" />

          </div>
        </div>
    
      </div>
    </div>
  );
};

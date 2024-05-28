import React from "react";
import { CloseIcon } from "../icons/CloseIcon";
interface Props {
  successMsg: string;
  closeSuccess?(): void;
}
const Success = ({ successMsg, closeSuccess }: Props) => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-[24px] p-[16px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px] border border-solid border-[#40c83b]">
          <div className="relative w-fit mt-[-1.00px] font-normal text-[#40c83b] text-[18px] tracking-[0] leading-[21.6px] break-all">
            <pre className="whitespace-pre-wrap">Success: {successMsg}</pre>
          </div>
         
    
    </div>
  );
};

export default Success;

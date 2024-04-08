import React from "react";

interface Props {
  value: string;
}

export const Option = ({ value }: Props) => {
  return (
    <div className="flex w-full items-center gap-[10px] px-[24px] py-[16px] relative flex-[0_0_auto] rounded-[8px] border border-solid border-transparent">
      <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
        {value}
      </div>
    </div>
  );
};

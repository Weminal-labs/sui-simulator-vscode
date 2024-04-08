import React from "react";

interface Props {
  children: React.ReactNode;
}

export const OptionList = ({ children }: Props) => {
  return (
    <div className="inline-flex flex-col items-end relative flex-[0_0_auto] rounded-[8px] border border-solid border-[#5a5a5a] w-full">
      {children}
    </div>
  );
};

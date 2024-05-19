import React from "react";
import { useNavigate } from "react-router-dom";

export const ListTransaction = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="relative h-10 w-full top-16 border border-solid border-white">
        <div className="grid grid-cols-3 gap-4 [font-family:'Aeonik-Medium',Helvetica] font-medium text-white text-[14px] tracking-[0] leading-[21.6px] whitespace-nowrap">
          <div className="text-center p-2">Number</div>
          <div className="text-center  p-2">Name</div>
          <div className="text-center  p-2">Status</div>

          <div className="text-center p-2">1</div>
          <div className="text-center p-2">test_game_func</div>
          <div className="text-center p-2">Active</div>
        </div>
      </div>
    </>
  );
};

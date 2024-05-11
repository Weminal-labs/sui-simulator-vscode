import React, { useEffect } from "react";
import { effects } from "../types/effectObjetc";
import "../css/dialog.css"; // File CSS cho Dialog

interface IResult {
  effect: effects;
  onClose: () => void; // Callback function để đóng dialog
}

const Result = ({ effect, onClose }: IResult) => {
  // Đóng dialog khi nhấn vào nút "Close" hoặc bên ngoài dialog
  const handleClose = () => {
    onClose();
  };

  // Đặt trạng thái ban đầu cho dialog là hiển thị khi component được render
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Vô hiệu hóa cuộn trang khi hiển thị dialog
    return () => {
      document.body.style.overflow = ""; // Kích hoạt lại cuộn trang khi đóng dialog
    };
  }, []);

  return (
    <div className="dialog-overlay overflow-y-scroll" onClick={handleClose}>
      <div className="dialog-content " onClick={(e) => e.stopPropagation()}>
        <div className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-black text-[28px] tracking-[0] leading-[33.6px] whitespace-nowrap">
          Result
        </div>
        <div className="flex flex-col items-start gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex p-3 m-3  w-full   rounded-md border-solid border-2 border-black">
            <div className="text-xl w-full [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-center">Status: {effect.status.status}</div>
          </div>
          <div className="flex flex-col p-3 m-3 w-full  rounded-md border-solid border-2 border-black [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] ">
            <div className="text-xl text-center ">Gas Usage</div>
            <div className="border-solid border-2 border-black p-3 m-3 flex flex-col gap-2">
              <div className="text-xl ">
                ComputationCost: {effect.gasUsed.computationCost}
              </div>
              <div className="text-xl ">
                NonRefundableStorageFee: {effect.gasUsed.nonRefundableStorageFee}
              </div>
              <div className="text-xl ">StorageCost: {effect.gasUsed.storageCost}</div>
              <div className="text-xl ">
                StorageRebate: {effect.gasUsed.storageRebate}
              </div>
            </div>
          </div>
        </div>
        {/* Nút đóng dialog */}
        <button className="dialog-close" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Result;

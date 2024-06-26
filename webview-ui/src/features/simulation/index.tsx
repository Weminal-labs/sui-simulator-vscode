import React, { useEffect, useState } from "react";
import { Tab } from "../../components/Tab";
import { Link } from "react-router-dom";

import { ArrowLeft } from "../../icons/ArrowLeft";
import { useNavigate } from "react-router-dom";
import { CreateTransaction } from "./createTransaction";
import { ListTransaction } from "./listTransaction";
import { Label } from "../../components/Label";
const WarningBanner = ({ isVisible }: any) => {
  if (!isVisible) return null;

  return (
    <div className="h-[100%] w-[100%] fixed top-0 left-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className=" transform -translate-x-1/2 -translate-y-1/2 bg-yellow-200 text-yellow-800 p-4 rounded-xl ">
        Please expand your width!
      </div>
    </div>
  );
};
const Simulation = () => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleNavigate = () => {
    navigate("/");
  };

  // Hàm xử lý sự kiện khi click vào nút "Create Transaction"
  const handleCreateTransaction = () => {
    navigate("/create-transaction");
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <WarningBanner isVisible={windowWidth < 850} />

      <div className="h-[160vh] grow overflow-y-scroll">
        <div className="absolute w-[800px]  h-[766px] top-[-178px] left-[25px]">
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
              <div className="">
                Simulations are available to everyone and free to use. It allow you to simulate
                several transactions consecutively using dry-run transactions in a virtual
                environment.
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

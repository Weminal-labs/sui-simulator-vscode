import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { SuiCommand } from "../../../../src/enums";
import styles from "./address.module.css";
import { useSuiClientContext } from "@mysten/dapp-kit";
import { useMySuiAccount } from "../../context/MySuiAccountProvider";
import { shortenAddress } from "../../utils/address_shortener";

export const Address = () => {
  // remember that then change UI in here need to call to terminal
  const { network } = useSuiClientContext();
  const { addresses, currentAddress, setCurrentAddress, setAddresses } = useMySuiAccount();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const switchAddress = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true);
    const resp = await requestDataFromTerminal({
      cmd: SuiCommand.SWITCH_ADDRESS,
      address: e.target.value,
    });
    const { stdout, stderr } = resp;
    setCurrentAddress(e.target.value);
    console.log(stdout);
    setIsLoading(false);
  };

  useEffect(() => {
    async function getAddresses() {
      setIsLoading(true);
      const resp = await requestDataFromTerminal({
        cmd: SuiCommand.GET_ADDRESSES,
      });
      const { stdout, stderr } = resp;
      const objects = JSON.parse(stdout);
      const { activeAddress, addresses } = objects;
      setCurrentAddress(activeAddress);
      setAddresses(addresses);
      setIsLoading(false);
      // console.log(objects);
    }
    getAddresses();
  }, [network]);

  return (
    <>
      <div className="flex flex-col items-start gap-[24px] relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-[33.6px] whitespace-nowrap">
          Active Address
        </div>
        <div className="flex flex-col items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex w-full items-center justify-between px-0 py-[4px] relative flex-[0_0_auto] rounded-[8px]">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
              Active Address
            </div>
            <div className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#000aff] text-[16px] tracking-[0] leading-[19.2px] whitespace-nowrap">
              Create
            </div>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <select
              className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"
              value={currentAddress}
              onChange={switchAddress}>
              {addresses.map((address, index) => {
                return (
                  <option
                    value={address[1]}
                    className={`${
                      currentAddress && currentAddress === address[1] ? styles["activeAddress"] : ""
                    }`}>
                    {shortenAddress(address[1], 5)}
                  </option>
                );
              })}
            </select>
          )}
          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            {/* <div className="flex flex-col items-end gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative self-stretch w-full h-[54px]">
                <div className="flex w-full items-start justify-between px-[24px] py-[16px] relative rounded-[8px] border border-solid border-[#5a5a5a]">
                  <div className="mt-[-1.00px] text-center relative w-fit [font-family:'Aeonik-Medium',Helvetica] font-medium text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                    Ox122346...heh8faf
                  </div>
                  <ArrowUp className="!relative !w-[24px] !h-[24px]" />
                </div>
              </div>
              <div className="inline-flex flex-col items-end relative flex-[0_0_auto] rounded-[8px] border border-solid border-[#5a5a5a] w-full">
                <div className="flex w-full items-center justify-between px-[24px] py-[16px] relative flex-[0_0_auto] rounded-[8px] border border-solid border-transparent">
                  <div className="relative w-fit [font-family:'Aeonik-Medium',Helvetica] font-medium text-white text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                    Ox122346...heh8faf
                  </div>
                  <Label
                    className="!flex-[0_0_auto] !pt-[3px] !pb-[7px] !px-[8px] !bg-white"
                    labelClassName="!text-black !tracking-[-0.28px] !text-[14px] ![font-style:unset] !font-normal ![font-family:'Aeonik-Regular',Helvetica] !leading-[15.7px]"
                    status="hover"
                    text="Copied"
                  />
                </div>
                <div className="flex w-full items-center justify-between px-[24px] py-[16px] relative flex-[0_0_auto] rounded-[8px] border border-solid border-transparent">
                  <div className="relative w-fit [font-family:'Aeonik-Medium',Helvetica] font-medium text-white text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                    Ox122346...heh8faf
                  </div>
                  <Label
                    className="!flex-[0_0_auto] !pt-[3px] !pb-[7px] !px-[8px]"
                    labelClassName="!tracking-[-0.28px] !text-[14px] ![font-style:unset] !font-normal ![font-family:'Aeonik-Regular',Helvetica] !leading-[15.7px]"
                    status="hover"
                    text="Copy"
                  />
                </div>
                <div className="flex w-full items-center justify-between px-[24px] py-[16px] relative flex-[0_0_auto] rounded-[8px] border border-solid border-transparent">
                  <div className="relative w-fit [font-family:'Aeonik-Medium',Helvetica] font-medium text-white text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                    Ox122346...heh8faf
                  </div>
                  <Label
                    className="!flex-[0_0_auto] !pt-[3px] !pb-[7px] !px-[8px]"
                    labelClassName="!tracking-[-0.28px] !text-[14px] ![font-style:unset] !font-normal ![font-family:'Aeonik-Regular',Helvetica] !leading-[15.7px]"
                    status="hover"
                    text="Copy"
                  />
                </div>
              </div>
            </div> */}
            <div className="flex w-full items-center px-0 py-[4px] relative flex-[0_0_auto] rounded-[8px]">
              <p className="relative flex-1 mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#5c5c5c] text-[14px] tracking-[0] leading-[16.8px]">
                The Address Managed By The Client
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

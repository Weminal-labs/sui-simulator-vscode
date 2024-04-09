import React from 'react'
import { ArrowLeft } from "../icons/ArrowLeft"
import { ArrowDown } from "../icons/ArrowDown"
import { ArrowUp } from "../icons/ArrowUp"
import { Label } from './Label'
import { useNavigate } from 'react-router-dom'

export const GasAddress = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/')
    }

    return (
        <div className="bg-[#0e0f0e] overflow-hidden w-full h-[1024px]">
            <div className="relative w-[1023px] h-[1805px] top-[-178px] left-[-158px]">
                <div className="flex flex-col w-[640px] sidebar:w-[360px] items-start gap-[64px] absolute top-[228px] left-[198px]">
                    <div className="flex flex-col items-start gap-[40px] p-[24px] relative self-stretch w-full flex-[0_0_auto] rounded-[16px]">
                        <div className="flex items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]" onClick={handleNavigate}>
                            <ArrowLeft className="!relative !w-[24px] !h-[24px]" />
                            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                                Gases And Address
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-[32px] relative self-stretch w-full flex-[0_0_auto]">
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
                                    <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                                        <div className="flex flex-col items-end gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
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
                                        </div>
                                        <div className="flex w-full items-center px-0 py-[4px] relative flex-[0_0_auto] rounded-[8px]">
                                            <p className="relative flex-1 mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#5c5c5c] text-[14px] tracking-[0] leading-[16.8px]">
                                                The Address Managed By The Client
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-start justify-center gap-[24px] relative self-stretch w-full flex-[0_0_auto]">
                                <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-[33.6px] whitespace-nowrap">
                                    Gas Object
                                </div>
                                <div className="flex flex-col items-start justify-center gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
                                    <div className="flex flex-col items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
                                        <div className="flex w-full items-center justify-between px-0 py-[4px] relative flex-[0_0_auto] rounded-[8px]">
                                            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                                Gas Coin Id
                                            </div>
                                            <div className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#000aff] text-[16px] tracking-[0] leading-[19.2px] whitespace-nowrap">
                                                Create
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                                            <div className="flex items-center justify-between px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px] border border-solid border-[#676767]">
                                                <div className="relative w-fit [font-family:'Aeonik-Medium',Helvetica] font-medium text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                                    Ox122346...heh8faf
                                                </div>
                                                <ArrowDown className="!relative !w-[24px] !h-[24px]" />
                                            </div>
                                            <div className="flex w-full items-center px-0 py-[4px] relative flex-[0_0_auto] rounded-[8px]">
                                                <p className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#5c5c5c] text-[14px] tracking-[0] leading-[16.8px] whitespace-nowrap">
                                                    The gas owed by the address
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-center justify-between px-0 py-[4px] relative flex-[0_0_auto] rounded-[8px]">
                                        <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                            Balance
                                        </div>
                                        <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                            1.00 Sui
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]">
                                        <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                            Faucet
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

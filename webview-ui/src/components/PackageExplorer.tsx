import React from 'react'
import { ArrowLeft } from '../icons/ArrowLeft'
import { Label } from './Label'
import { ArrowDown } from '../icons/ArrowDown'

export const PackageExplorer = () => {
    return (
        <div className="bg-[#0e0f0e] overflow-hidden w-full h-[1122px]">
            <div className="relative w-[1023px] h-[1421px] top-[-178px] left-[-158px]">
                <div className="flex flex-col w-[640px] items-start gap-[64px] px-[24px] py-0 absolute top-[228px] left-[198px]">
                    <div className="flex flex-col items-start gap-[40px] px-0 py-[24px] relative self-stretch w-full flex-[0_0_auto] rounded-[16px]">
                        <div className="flex items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
                            <ArrowLeft className="!relative !w-[24px] !h-[24px]" />
                            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                                Package Explorer
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
                            <div className="flex flex-col h-[92px] items-start gap-[8px] relative self-stretch w-full">
                                <div className="flex w-[592px] items-center px-0 py-[4px] relative flex-1 grow rounded-[8px]">
                                    <div className="relative w-fit mt-[-6.00px] mb-[-4.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                        Input Package
                                    </div>
                                </div>
                                <div className="flex items-center justify-between px-[24px] py-[16px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px] border border-solid border-[#676767]">
                                    <div className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                        input your package here
                                    </div>
                                    <Label
                                        className="!border-[#fefefe] !rounded-[4px] !flex-[0_0_auto] !border !border-solid !bg-[unset]"
                                        labelClassName="!text-white"
                                        status="active"
                                        text="TESTNET"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
                        {/* <div className="flex flex-col items-start gap-[24px] p-[24px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px] border border-solid border-[#ff008b]">
                                <div className="flex flex-col items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
                                    <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
                                        <p className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#c83b7f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                            Error: Couldn’t Find Package Id
                                        </p>
                                        <VuesaxLinearCloseCircle className="!relative !w-[24px] !h-[24px]" />
                                    </div>
                                </div>
                            </div> */}
                        <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                            <div className="flex flex-col items-start gap-[24px] p-[24px] relative self-stretch w-full flex-[0_0_auto] bg-[#0e1011] rounded-[8px] border border-solid border-[#676767]">
                                <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
                                    <p className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-transparent text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                        <span className="text-[#8f8f8f]">Package ID: </span>
                                        <span className="text-white">0ghhffghhghf2330056666</span>
                                    </p>
                                    <Label
                                        className="!flex-[0_0_auto] !pt-[3px] !pb-[7px] !px-[8px]"
                                        labelClassName="!tracking-[-0.28px] !text-[14px] ![font-style:unset] !font-normal ![font-family:'Aeonik-Regular',Helvetica] !leading-[15.7px]"
                                        status="hover"
                                        text="Copy"
                                    />
                                </div>
                                <div className="flex items-start justify-between px-[24px] py-[16px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px] border border-solid border-[#5a5a5a]">
                                    <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                                        Module
                                    </div>
                                    <ArrowDown className="!relative !w-[24px] !h-[24px]" />
                                </div>
                                <div className="flex items-start justify-between px-[24px] py-[16px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px] border border-solid border-[#5a5a5a]">
                                    <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                                        Function
                                    </div>
                                    <ArrowDown className="!relative !w-[24px] !h-[24px]" />
                                </div>
                                <div className="flex flex-col items-start justify-center gap-[10px] px-[24px] py-[16px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px] border border-solid border-[#5a5a5a]">
                                    <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                                        Args
                                    </div>
                                    <div className="flex h-[56px] items-start gap-[10px] px-[24px] py-[16px] relative self-stretch w-full rounded-[8px] border border-solid border-[#5a5a5a]">
                                        <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                            U64
                                        </div>
                                    </div>
                                    <div className="flex h-[56px] items-start gap-[10px] px-[24px] py-[16px] relative self-stretch w-full rounded-[8px] border border-solid border-[#5a5a5a]">
                                        <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                            String
                                        </div>
                                    </div>
                                    <div className="flex h-[56px] items-start gap-[10px] px-[24px] py-[16px] relative self-stretch w-full rounded-[8px] border border-solid border-[#5a5a5a]">
                                        <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                            Hero
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]">
                                    <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                        Call
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

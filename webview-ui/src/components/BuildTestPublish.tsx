import React from 'react'
import { Label } from './Label'
import { CloseIcon } from '../icons/CloseIcon'
import { ArrowLeft } from '../icons/ArrowLeft'
import { useNavigate } from 'react-router-dom'

export const BuildTestPublish = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/')
    }

    return (
        <div className="bg-[#0e0f0e] overflow-hidden w-full h-[1707px]">
            <div className="relative w-[1023px] h-[2350px] top-[-178px] left-[-158px]">
                <div className="flex flex-col w-[640px] items-start gap-[64px] absolute top-[228px] left-[198px]">
                    <div className="flex flex-col items-start gap-[40px] p-[24px] relative self-stretch w-full flex-[0_0_auto] rounded-[16px] sidebar:w-[360px]">
                        <div className="flex items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]" onClick={handleNavigate}>
                            <ArrowLeft className="!relative !w-[24px] !h-[24px]" />
                            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                                Build, Test And Publish
                            </div>
                        </div>
                        <div className="flex flex-col items-start gap-[32px] relative self-stretch w-full flex-[0_0_auto]">
                            <div className="flex flex-col items-start gap-[24px] p-[24px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px] border border-solid border-[#676767]">
                                <div className="flex flex-col items-start gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
                                    <div className="items-center justify-center flex-[0_0_auto] border-white flex gap-[10px] px-[23px] py-[16px] relative self-stretch w-full rounded-[8px] border border-solid">
                                        <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-white text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                            Test
                                        </div>
                                    </div>
                                    <div className="bg-white flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px]">
                                        <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                            Build
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
                                    <div className="flex items-center px-0 py-[4px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px]">
                                        <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                            Output
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start justify-center relative self-stretch w-full flex-[0_0_auto]">
                                        <div className="h-[128px] items-start border-[#676767] flex gap-[10px] px-[23px] py-[16px] relative self-stretch w-full rounded-[8px] border border-solid">
                                            <div className="text-[14px] leading-[16.8px] relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] tracking-[0] whitespace-nowrap">
                                                Output...
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-[24px] p-[24px] relative self-stretch w-full flex-[0_0_auto] bg-[#0e1011] rounded-[8px] border border-solid border-[#676767]">
                                <div className="bg-[#000aff] flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px]">
                                    <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-white text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                        Publish
                                    </div>
                                </div>
                                <div className="flex flex-col items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
                                    <div className="flex items-center px-0 py-[4px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px]">
                                        <div className="text-[18px] leading-[21.6px] relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] tracking-[0] whitespace-nowrap">
                                            Gas Budget
                                        </div>
                                    </div>
                                    <div className="relative w-full">
                                        <div className="border-[#676767] gap-[10px] px-[23px] py-[16px] relative w-full rounded-[8px] border border-solid">
                                            <div className="relative w-fit mt-[-1.00px] mr-[-8.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[14px] tracking-[0] leading-[16.8px] break-all">
                                                100000000
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-[40px] relative self-stretch w-full flex-[0_0_auto]">
                                    <div className="inline-flex flex-col items-start gap-[8px] relative flex-[0_0_auto]">
                                        <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                            Publisher
                                        </div>
                                        <div className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[16px] text-center tracking-[0] leading-[19.2px] whitespace-nowrap">
                                            012x...298734
                                        </div>
                                    </div>
                                    <img className="relative w-px h-[45px] object-cover" alt="Line" src="/img/line-1.svg" />
                                    <div className="inline-flex flex-col items-start gap-[8px] relative flex-[0_0_auto]">
                                        <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                            Gas Object
                                        </div>
                                        <div className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[16px] text-center tracking-[0] leading-[19.2px] whitespace-nowrap">
                                            012x...298734
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-[33.6px] whitespace-nowrap">
                                Result
                            </div>
                            <div className="flex flex-col items-start gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
                                <div className="flex flex-col items-start gap-[24px] p-[24px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px] border border-solid border-[#ff008b]">
                                    <div className="flex flex-col items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
                                        <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
                                            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#c83b7f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                                Error: Can't Create Object
                                            </div>
                                            <CloseIcon className="!relative !w-[24px] !h-[24px]" />
                                        </div>
                                        <p className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#c83b7f] text-[16px] text-center tracking-[0] leading-[19.2px] whitespace-nowrap">
                                            404: Can't Find Object Id
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                                    <div className="flex flex-col items-start gap-[24px] p-[24px] relative self-stretch w-full flex-[0_0_auto] bg-[#0e1011] rounded-[8px] border border-solid border-[#676767]">
                                        <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
                                            <p className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-transparent text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                                <span className="text-[#8f8f8f]">Package ID: </span>
                                                <span className="text-white">0xhhf...56666</span>
                                            </p>
                                            <Label
                                                className="!flex-[0_0_auto] !pt-[3px] !pb-[7px] !px-[8px]"
                                                labelClassName="!tracking-[-0.28px] !text-[14px] ![font-style:unset] !font-normal ![font-family:'Aeonik-Regular',Helvetica] !leading-[15.7px]"
                                                status="hover"
                                                text="Copy"
                                            />
                                        </div>
                                        <div className="flex flex-col items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
                                            <div className="flex items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
                                                <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                                    Object Id
                                                </div>
                                            </div>
                                            <div className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[16px] text-center tracking-[0] leading-[19.2px] whitespace-nowrap">
                                                0xhhf...56666
                                            </div>
                                        </div>
                                        <div className="inline-flex flex-col items-start gap-[8px] relative flex-[0_0_auto]">
                                            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                                Owner
                                            </div>
                                            <div className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[16px] text-center tracking-[0] leading-[19.2px] whitespace-nowrap">
                                                0xhhf...56666
                                            </div>
                                        </div>
                                        <div className="inline-flex flex-col items-start gap-[8px] relative flex-[0_0_auto]">
                                            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                                Object Type
                                            </div>
                                            <div className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[16px] text-center tracking-[0] leading-[19.2px] whitespace-nowrap">
                                                0xhhf...56666
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-center justify-end gap-[30px] px-0 py-[4px] relative flex-[0_0_auto] rounded-[8px]">
                                        <div className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#bababa] text-[14px] tracking-[0] leading-[16.8px] whitespace-nowrap">
                                            Remove
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                                    <div className="flex flex-col items-start gap-[24px] p-[24px] relative self-stretch w-full flex-[0_0_auto] bg-[#0e1011] rounded-[8px] border border-solid border-[#676767]">
                                        <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
                                            <p className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-transparent text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                                <span className="text-[#8f8f8f]">Package ID: </span>
                                                <span className="text-white">0xhhf...56666</span>
                                            </p>
                                            <Label
                                                className="!flex-[0_0_auto] !pt-[3px] !pb-[7px] !px-[8px]"
                                                labelClassName="!tracking-[-0.28px] !text-[14px] ![font-style:unset] !font-normal ![font-family:'Aeonik-Regular',Helvetica] !leading-[15.7px]"
                                                status="hover"
                                                text="Copy"
                                            />
                                        </div>
                                        <div className="flex flex-col items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
                                            <div className="flex items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
                                                <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                                    Object Id
                                                </div>
                                            </div>
                                            <div className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[16px] text-center tracking-[0] leading-[19.2px] whitespace-nowrap">
                                                0xhhf...56666
                                            </div>
                                        </div>
                                        <div className="inline-flex flex-col items-start gap-[8px] relative flex-[0_0_auto]">
                                            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                                Owner
                                            </div>
                                            <div className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[16px] text-center tracking-[0] leading-[19.2px] whitespace-nowrap">
                                                0xhhf...56666
                                            </div>
                                        </div>
                                        <div className="inline-flex flex-col items-start gap-[8px] relative flex-[0_0_auto]">
                                            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                                Object Type
                                            </div>
                                            <div className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[16px] text-center tracking-[0] leading-[19.2px] whitespace-nowrap">
                                                0xhhf...56666
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-center justify-end gap-[30px] px-0 py-[4px] relative flex-[0_0_auto] rounded-[8px]">
                                        <div className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#bababa] text-[14px] tracking-[0] leading-[16.8px] whitespace-nowrap">
                                            Remove
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

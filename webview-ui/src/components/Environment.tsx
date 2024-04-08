import React from 'react'
import { ArrowLeft } from '../icons/ArrowLeft'
import { ArrowDown } from '../icons/ArrowDown'
import { useNavigate, useNavigation } from 'react-router-dom'

export const Environment = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/')
    }

    return (
        <div className='h-[1024px]'>

            <div className="absolute w-[640px] sidebar:w-[400px] h-[766px] top-[-178px] left-[40px]">
                <div className="flex flex-col w-full items-start gap-[64px] absolute top-[228px] left-0">
                    <div className="flex-col gap-[40px] p-[24px] self-stretch w-full flex-[0_0_auto] rounded-[16px] flex items-start relative">
                        <div className="flex items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]" onClick={handleNavigate}>
                            <ArrowLeft className="!relative !w-[24px] !h-[24px]" />
                            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                                Environment
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
                            <div className="flex flex-col items-end gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
                                <div className="flex flex-col h-[92px] items-start gap-[8px] relative self-stretch w-full">
                                    <div className="flex w-full items-center justify-between px-0 py-[4px] relative flex-1 grow rounded-[8px]">
                                        <div className="[font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] relative w-fit mt-[-1.00px] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                            Binaries
                                        </div>
                                        <div className="inline-flex items-center gap-[8px] relative flex-[0_0_auto]">
                                            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                                On
                                            </div>
                                            <div className="relative w-[16px] h-[16px] rounded-[8px] border-2 border-solid border-white">
                                                <div className="relative w-[8px] h-[8px] top-[2px] left-[2px] bg-[#000aff] rounded-[4px]" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px] border border-solid border-white">
                                        <div className="[font-family:'Aeonik-Medium',Helvetica] font-medium text-white relative w-fit mt-[-1.00px] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                            Binaries Path
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
                                    <div className="relative self-stretch w-full h-[54px]">
                                        <div className="w-full justify-between px-[24px] py-[16px] rounded-[8px] border border-solid border-[#5a5a5a] flex items-start relative">
                                            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                                                None
                                            </div>
                                            <ArrowDown className="!relative !w-[24px] !h-[24px]" />
                                        </div>
                                    </div>
                                    <div className="inline-flex flex-col items-end relative flex-[0_0_auto] rounded-[8px] border border-solid border-[#5a5a5a] w-full">
                                        <div className="flex w-full items-center gap-[10px] px-[24px] py-[16px] relative flex-[0_0_auto] rounded-[8px] border border-solid border-transparent">
                                            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                                                Testnet
                                            </div>
                                        </div>
                                        <div className="flex w-full items-center gap-[10px] px-[24px] py-[16px] relative flex-[0_0_auto] rounded-[8px] border border-solid border-transparent">
                                            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                                                None
                                            </div>
                                        </div>
                                        <div className="flex w-full items-center gap-[10px] px-[24px] py-[16px] relative flex-[0_0_auto] rounded-[8px] border border-solid border-transparent">
                                            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                                                Devnet
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]">
                            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                Rpc Custom
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

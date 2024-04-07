import React from 'react'
import { ArrowRight } from "../icons/ArrowRight";

interface TabProps {
    icon: JSX.Element;
    title: string;
}

export const Tab = ({ icon, title }: TabProps) => {
    return (
        <div className="flex w-[640px] sidebar:w-[360px] justify-between p-[24px] bg-[#50505026]">
            <div className="inline-flex items-center gap-[12px]">
                {icon}
                <div className="w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] whitespace-nowrap">
                    {title}
                </div>
            </div>
            <ArrowRight className="!relative !w-[24px] !h-[24px]" />
        </div>
    )
}

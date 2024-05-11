import React, { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { AliasList } from "./AliasList";
import { AliasItem } from "./AliasItem";
import { useMySuiAlias } from "../context/MySuiAliasProvider";

export const Aliases = () => {
  const { alias, aliases, handleAddAlias, handleDeleteAlias, objectId, setAlias, setObjectId } = useMySuiAlias();

  return (
    <>
      <div className="inline-flex flex-col items-start justify-center gap-[24px] p-[24px] relative border border-solid border-[#8d8b8c] w-full">
        <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-[33.6px] whitespace-nowrap">
          Aliases
        </div>
        <div className="flex flex-col items-start justify-center gap-[12px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="w-full inline-flex items-center gap-[15px] relative flex-[0_0_auto]">
            <input
              className="border-[#676767] gap-[10px] px-[23px] py-[16px] relative w-full rounded-[8px] border border-solid relative w-fit mt-[-1.00px] mr-[-8.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[14px] tracking-[0] leading-[16.8px] bg-[#0e0f0e]"
              type="text"
              placeholder="Alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
            <input
              className="border-[#676767] gap-[10px] px-[23px] py-[16px] relative w-full rounded-[8px] border border-solid relative w-fit mt-[-1.00px] mr-[-8.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[14px] tracking-[0] leading-[16.8px] bg-[#0e0f0e]"
              type="text"
              placeholder="Object id"
              value={objectId}
              onChange={(e) => setObjectId(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-[10px] px-[20px] py-[12px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]" onClick={handleAddAlias}>
            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
              Add Alias
            </div>
          </button>
        </div>
        <div className="flex flex-col items-start gap-[16px] pt-[var(--collection-1-1)] pb-[var(--collection-1-1)] px-[12px] relative self-stretch w-full flex-[0_0_auto] rounded-[7px] border border-solid border-[#8d8b8c]">
          {aliases.length !== 0 && <AliasList >
            {aliases.map((ele, index) => {
              return (
                <AliasItem aliasItem={ele} handleDeleteAlias={handleDeleteAlias} index={index} />
              );
            })}
          </AliasList>}
        </div>
      </div>
    </>
  );
};

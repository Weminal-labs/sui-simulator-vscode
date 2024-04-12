import React, { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { AliasList } from "./AliasList";
import { AliasItem } from "./AliasItem";

export const Aliases = () => {
  const [aliases, setAliases] = useState<any[]>([]);
  const [alias, setAlias] = useState<string>("");
  const [objectId, setObjectId] = useState<string>("");

  const handleAddAlias = () => {
    setAliases([
      ...aliases,
      {
        alias,
        objectId,
      },
    ]);
    setAlias("");
    setObjectId("");
  };

  const handleDeleteAlias = (index: number) => {
    setAliases((prevAliases) => prevAliases.filter((_, i) => i !== index));
  };

  const handleSaveAliasesToWorkspace = () => {};

  return (
    <>
      {/* <h1>Aliases</h1>
      <Input placeholder="alias" value={alias} onChange={(e) => setAlias(e.target.value)} />
      <Input placeholder="object id" value={objectId} onChange={(e) => setObjectId(e.target.value)} />
      <Button onClick={handleAddAlias}>
        Add alias
      </Button>
      
      <AliasList >
        {aliases.map((ele, index) => {
            return (
              <AliasItem aliasItem={ele} handleDeleteAlias={handleDeleteAlias} index={index} />
            );
          })}
      </AliasList>

      <Button onClick={handleSaveAliasesToWorkspace}>
        Save Aliases to Workspace
      </Button> */}
      <div className="inline-flex flex-col items-start justify-center gap-[24px] p-[24px] relative border border-solid border-[#8d8b8c] w-full">
        <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-[33.6px] whitespace-nowrap">
          Aliases
        </div>
        <div className="flex flex-col items-start justify-center gap-[12px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="w-full inline-flex items-center gap-[15px] relative flex-[0_0_auto]">
            <div className="flex w-[268px] items-center gap-[var(--collection-1-1)] pt-[var(--collection-1-1)] pb-[var(--collection-1-1)] px-[12px] relative rounded-[7px] border border-solid border-[#8d8b8c]">
              <div className="relative w-fit mt-[-1.00px] font-subtitle font-[number:var(--subtitle-font-weight)] text-[#8d8b8c] text-[length:var(--subtitle-font-size)] tracking-[var(--subtitle-letter-spacing)] leading-[var(--subtitle-line-height)] whitespace-nowrap [font-style:var(--subtitle-font-style)] py-[16px] text-[18px]">
                Set alias
              </div>
            </div>
            <div className="flex w-[268px] items-center gap-[var(--collection-1-1)] pt-[var(--collection-1-1)] pb-[var(--collection-1-1)] px-[12px] relative rounded-[7px] border border-solid border-[#8d8b8c]">
              <div className="relative w-fit mt-[-1.00px] font-subtitle font-[number:var(--subtitle-font-weight)] text-[#8d8b8c] text-[length:var(--subtitle-font-size)] tracking-[var(--subtitle-letter-spacing)] leading-[var(--subtitle-line-height)] whitespace-nowrap [font-style:var(--subtitle-font-style)] py-[16px] text-[18px]">
                Objcet id
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-[10px] px-[20px] py-[12px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
              Add Alias
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-[16px] pt-[var(--collection-1-1)] pb-[var(--collection-1-1)] px-[12px] relative self-stretch w-full flex-[0_0_auto] rounded-[7px] border border-solid border-[#8d8b8c]">
          <table className="w-full text-[18px]">
            <tr className="border-b-2 border-white">
              <td>Name</td>
              <td>ID</td>
            </tr>
            <tr>
              <td className="pt-[16px]">ABC</td>
              <td className="pt-[16px]">0x.....</td>
            </tr>
            <tr>
              <td className="pt-[16px]">ABC</td>
              <td className="pt-[16px]">0x.....</td>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
};

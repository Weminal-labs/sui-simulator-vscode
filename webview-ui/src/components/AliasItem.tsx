import React from "react";
import { copyToClipBoard } from "../utils";
import { CopyIcon } from "../icons/CopyIcon";

export interface IAliasItemProps {
  aliasItem: {
    alias: string;
    objectId: string;
  };
  index: number;
  handleDeleteAlias: (index: number) => void;
}

export const AliasItem = ({
  aliasItem,
  index,
  handleDeleteAlias,
}: IAliasItemProps) => {
  return (
    <tr>
      <td className="pt-[16px]">
        {aliasItem.alias}
      </td>
      <td className="pt-[16px]">
        {aliasItem.objectId}
      </td>
      <td>
        <CopyIcon handleClick={() => copyToClipBoard(aliasItem.objectId)} />
      </td>
      <td>
        <button onClick={() => handleDeleteAlias(index)}>X</button>
      </td>
    </tr>
  );
};

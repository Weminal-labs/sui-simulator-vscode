import React from "react";
import { copyToClipBoard } from "../utils";

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
      <td>
        <p>{aliasItem.alias}</p>
      </td>
      <td>
        <p>{aliasItem.objectId}</p>
      </td>
      <td>
        <button onClick={() => copyToClipBoard(aliasItem.objectId)}>
          Copy
        </button>
      </td>
      <td>
        <button onClick={() => handleDeleteAlias(index)}>X</button>
      </td>
    </tr>
  );
};

import React from "react";

export interface IAliasListProps {
  children: React.ReactNode;
}

export const AliasList = ({ children }: IAliasListProps) => {
  return <table className="w-full text-[18px]">
    <tr className="border-b-2 border-white">
      <td>Alias</td>
      <td>Object ID</td>
      <td></td>
      <td></td>
    </tr>
    {children}
  </table>;
};

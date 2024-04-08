import React from "react";

export interface IAliasListProps {
  children: React.ReactNode;
}

export const AliasList = ({ children }: IAliasListProps) => {
  return <table>{children}</table>;
};
